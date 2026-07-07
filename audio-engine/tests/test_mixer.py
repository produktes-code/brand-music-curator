"""
Tests reales para el módulo mixer.py del audio-engine de Brand Music Curator.
Verifica: mezcla armónica (Camelot Wheel), curvas de transición, diferencias de energía.
"""
import sys
import os
import json
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import mixer


class TestGenerateMixCurve:
    """Verifica la generación de curvas de mezcla entre dos pistas."""

    def test_harmonic_match_same_key(self, capsys):
        """Dos pistas con la misma tonalidad deben ser harmonic_match=True."""
        track1 = json.dumps({"key": "A", "bpm": 120, "energy": 50})
        track2 = json.dumps({"key": "A", "bpm": 122, "energy": 55})
        mixer.generate_mix_curve(track1, track2)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success"
        assert result["harmonic_match"] is True, \
            f"Misma tonalidad debería ser armónica. Resultado: {result}"
        assert "Long Crossfade" in result["transition"], \
            f"BPMs cercanos y misma tonalidad deberían dar Long Crossfade. Transición: {result['transition']}"

    def test_different_keys_not_harmonic(self, capsys):
        """Dos pistas con distinta tonalidad deben ser harmonic_match=False."""
        track1 = json.dumps({"key": "A", "bpm": 120, "energy": 50})
        track2 = json.dumps({"key": "C", "bpm": 125, "energy": 55})
        mixer.generate_mix_curve(track1, track2)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["harmonic_match"] is False, \
            f"Distinta tonalidad no debería ser armónica. Resultado: {result}"

    def test_energy_boost_triggers_drop_cut(self, capsys):
        """Un salto de energía >30 debe generar Drop/Quick Cut."""
        track1 = json.dumps({"key": "A", "bpm": 120, "energy": 20})
        track2 = json.dumps({"key": "C", "bpm": 140, "energy": 80})
        mixer.generate_mix_curve(track1, track2)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert "Drop / Quick Cut" in result["transition"], \
            f"Salto de energía >30 debería dar Drop/Quick Cut. Transición: {result['transition']}"
        assert result["energy_delta"] == 60.0, \
            f"Delta de energía debería ser 60.0. Resultado: {result['energy_delta']}"

    def test_standard_fade_for_moderate_diff(self, capsys):
        """Diferencia moderada sin match armónico debe dar Standard Fade."""
        track1 = json.dumps({"key": "A", "bpm": 120, "energy": 50})
        track2 = json.dumps({"key": "C", "bpm": 130, "energy": 60})
        mixer.generate_mix_curve(track1, track2)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert "Standard Fade" in result["transition"], \
            f"Diferencia moderada debería dar Standard Fade. Transición: {result['transition']}"

    def test_energy_delta_calculation(self, capsys):
        """El campo energy_delta debe ser t2.energy - t1.energy."""
        track1 = json.dumps({"key": "A", "bpm": 120, "energy": 30})
        track2 = json.dumps({"key": "C", "bpm": 130, "energy": 70})
        mixer.generate_mix_curve(track1, track2)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["energy_delta"] == 40.0, \
            f"Delta de energía incorrecto. Esperado: 40.0, Obtenido: {result['energy_delta']}"

    def test_missing_keys_defaults(self, capsys):
        """Pistas sin campos 'key' o 'energy' deben usar defaults sin crash."""
        track1 = json.dumps({"bpm": 120})
        track2 = json.dumps({"bpm": 125})
        mixer.generate_mix_curve(track1, track2)
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success", \
            f"Debe manejar campos faltantes sin error. Resultado: {result}"

    def test_invalid_json_returns_error(self, capsys):
        """JSON inválido debe devolver status=error."""
        try:
            mixer.generate_mix_curve("not valid json", '{"key": "A"}')
        except SystemExit:
            pass
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "error", \
            f"JSON inválido debería dar error. Resultado: {result}"