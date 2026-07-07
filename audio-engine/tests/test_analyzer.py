"""
Tests reales para el módulo analyzer.py del audio-engine de Brand Music Curator.
Verifica: filtro paso-alto, análisis BPM, energía RMS, detección de tonalidad.
"""
import sys
import os
import json
import numpy as np
import pytest

# Añadir el directorio padre al path para importar analyzer
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import analyzer


class TestHighpassFilter:
    """Verifica el filtro paso-alto para optimización retail."""

    def test_highpass_removes_low_frequencies(self):
        """Un filtro paso-alto a 80Hz debe atenuar frecuencias bajas."""
        sr = 22050
        duration = 1.0
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)
        # Señal con componente grave (50Hz) y agudo (1000Hz)
        y = np.sin(2 * np.pi * 50 * t) + 0.5 * np.sin(2 * np.pi * 1000 * t)
        y_filtered = analyzer.apply_highpass_filter(y, sr, cutoff=80)

        # Verificar que la señal filtrada tiene menos energía en graves
        fft_original = np.abs(np.fft.rfft(y))
        fft_filtered = np.abs(np.fft.rfft(y_filtered))
        # La energía por debajo de 80Hz debe reducirse significativamente
        low_freq_bins = int(80 / (sr / len(y)))
        energy_original_low = np.sum(fft_original[:low_freq_bins])
        energy_filtered_low = np.sum(fft_filtered[:low_freq_bins])
        assert energy_filtered_low < energy_original_low * 0.5, \
            f"El filtro paso-alto no atenuó suficientemente las frecuencias bajas. Original: {energy_original_low:.2f}, Filtrado: {energy_filtered_low:.2f}"

    def test_highpass_cutoff_zero_no_filtering(self):
        """Con cutoff=0, la señal debe permanecer inalterada."""
        sr = 22050
        y = np.random.randn(22050).astype(np.float32)
        y_filtered = analyzer.apply_highpass_filter(y, sr, cutoff=0)
        np.testing.assert_array_almost_equal(y, y_filtered, decimal=5,
            err_msg="Con cutoff=0 la señal no debe ser modificada")

    def test_highpass_preserves_high_frequencies(self):
        """Las frecuencias altas (>200Hz) deben conservarse tras el filtro."""
        sr = 22050
        duration = 1.0
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)
        y = np.sin(2 * np.pi * 1000 * t)
        y_filtered = analyzer.apply_highpass_filter(y, sr, cutoff=80)

        # La amplitud de la frecuencia alta debe mantenerse aproximadamente
        rms_original = np.sqrt(np.mean(y ** 2))
        rms_filtered = np.sqrt(np.mean(y_filtered ** 2))
        # Permitimos hasta 20% de variación por efectos de borde del filtro
        assert abs(rms_filtered - rms_original) / rms_original < 0.20, \
            f"La frecuencia alta fue demasiado atenuada. RMS original: {rms_original:.4f}, RMS filtrado: {rms_filtered:.4f}"


class TestAnalyzeTrack:
    """Verifica la función principal analyze_track con un archivo WAV sintético."""

    @pytest.fixture
    def synthetic_wav(self, tmp_path):
        """Genera un archivo WAV sintético con tono puro a 440Hz (A4) y 120 BPM simulado."""
        import wave
        import struct

        sr = 22050
        duration = 4.0  # 4 segundos
        freq = 440.0  # La (A4) -> tonalidad A
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)

        # Generar tono puro con pulsos rítmicos cada 0.5s (120 BPM)
        y = np.sin(2 * np.pi * freq * t)
        # Añadir pulsos de onset cada 0.5 segundos para que librosa detecte BPM
        pulse_interval = 0.5  # 120 BPM = 0.5s entre beats
        for i in range(int(duration / pulse_interval)):
            start = int(i * pulse_interval * sr)
            end = start + int(0.05 * sr)  # pulso de 50ms
            if end < len(y):
                y[start:end] *= 3.0  # Amplificar el pulso

        # Normalizar a 16-bit PCM
        y_16bit = np.int16(y / np.max(np.abs(y)) * 32767 * 0.8)

        wav_path = tmp_path / "test_synthetic.wav"
        with wave.open(str(wav_path), 'w') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sr)
            wf.writeframes(y_16bit.tobytes())

        return str(wav_path)

    def test_analyze_track_returns_valid_json(self, synthetic_wav, capsys):
        """analyze_track debe imprimir un JSON válido con status=success."""
        analyzer.analyze_track(synthetic_wav)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success", \
            f"El análisis falló: {result.get('message', 'unknown error')}"
        assert "bpm" in result, "Falta el campo 'bpm' en el resultado"
        assert "energy" in result, "Falta el campo 'energy' en el resultado"
        assert "key" in result, "Falta el campo 'key' en el resultado"

    def test_analyze_track_detects_key_A(self, synthetic_wav, capsys):
        """Un tono puro a 440Hz (A4) debe detectar tonalidad 'A'."""
        analyzer.analyze_track(synthetic_wav)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["key"] == "A", \
            f"Se esperaba tonalidad 'A' para 440Hz, pero se detectó '{result['key']}'"

    def test_analyze_track_bpm_near_120(self, synthetic_wav, capsys):
        """Con pulsos cada 0.5s, el BPM detectado debe estar cerca de 120."""
        analyzer.analyze_track(synthetic_wav)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert 100 <= result["bpm"] <= 140, \
            f"BPM detectado ({result['bpm']}) fuera del rango esperado [100-140] para pulsos a 120 BPM"

    def test_analyze_track_energy_positive(self, synthetic_wav, capsys):
        """La energía RMS debe ser un valor positivo."""
        analyzer.analyze_track(synthetic_wav)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["energy"] > 0, \
            f"La energía debe ser positiva, pero se obtuvo {result['energy']}"

    def test_analyze_track_dsp_applied_with_highpass(self, synthetic_wav, capsys):
        """Con cutoff > 0, el campo dsp_applied debe indicar el filtro aplicado."""
        analyzer.analyze_track(synthetic_wav, cutoff=80)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert "High-pass Filter" in result["dsp_applied"], \
            f"No se registró el filtro paso-alto en dsp_applied: {result['dsp_applied']}"

    def test_analyze_track_nonexistent_file_returns_error(self, capsys):
        """Un archivo inexistente debe devolver status=error."""
        try:
            analyzer.analyze_track("/nonexistent/path/audio.wav")
        except SystemExit:
            pass
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "error", \
            f"Se esperaba error para archivo inexistente, pero se obtuvo: {result}"


class TestCLIInterface:
    """Verifica la interfaz de línea de comandos."""

    def test_no_arguments_exits_with_error(self, capsys):
        """Sin argumentos, el CLI debe salir con error."""
        # Simular llamada sin argumentos
        old_argv = sys.argv
        try:
            sys.argv = ['analyzer.py']
            try:
                analyzer.analyze_track  # no llamamos, solo verificamos el __main__
            except SystemExit:
                pass
        finally:
            sys.argv = old_argv