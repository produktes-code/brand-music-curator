import sys
import json
import librosa
import numpy as np
import scipy.signal
import argparse
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger("audio_analyzer")

def apply_highpass_filter(y, sr, cutoff=80):
    """
    Aplica un filtro paso-alto para recortar subgraves.
    Esencial para evitar el enmascaramiento de frecuencias en retail
    (grandes superficies donde los graves retumban).
    """
    if cutoff <= 0:
        return y
    nyquist = 0.5 * sr
    normal_cutoff = cutoff / nyquist
    b, a = scipy.signal.butter(4, normal_cutoff, btype='high', analog=False)
    filtered_y = scipy.signal.filtfilt(b, a, y)
    return filtered_y

def analyze_track(file_path, cutoff=80, target_bpm=None):
    try:
        logger.info(f"Iniciando análisis del archivo: {file_path}")
        y, sr = librosa.load(file_path, sr=22050)
        
        # 1. Filtro Paso-Alto (Retail Audio Optimization)
        y_filtered = apply_highpass_filter(y, sr, cutoff=cutoff)
        
        # 2. Extraer BPM
        onset_env = librosa.onset.onset_strength(y=y_filtered, sr=sr)
        tempo, _ = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
        bpm = float(tempo[0]) if isinstance(tempo, np.ndarray) else float(tempo)
        
        # 3. Extraer Energía (RMS) sobre el audio filtrado
        rms = librosa.feature.rms(y=y_filtered)
        energy_level = float(np.mean(rms)) * 1000
        
        # 4. Extraer Tonalidad (Chromagram)
        chromagram = librosa.feature.chroma_stft(y=y_filtered, sr=sr)
        mean_chroma = np.mean(chromagram, axis=1)
        notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        key_index = np.argmax(mean_chroma)
        key = notes[key_index]

        result = {
            "status": "success",
            "file": file_path,
            "bpm": round(bpm, 2),
            "energy": round(energy_level, 2),
            "key": key,
            "dsp_applied": f"High-pass Filter ({cutoff}Hz) - Retail Optimized" if cutoff > 0 else "None"
        }
        logger.info(f"Análisis exitoso para {file_path}. BPM: {result['bpm']}, Key: {result['key']}")
        print(json.dumps(result))
        
    except Exception as e:
        logger.error(f"Error procesando el archivo {file_path}: {e}", exc_info=True)
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analizador de archivos de audio para DJ / Retail")
    parser.add_argument('--file', type=str, help="Ruta al archivo de audio")
    parser.add_argument('--highpass', type=int, default=80, help="Frecuencia de corte del filtro paso-alto")
    parser.add_argument('--target-bpm', type=str, default='auto', help="BPM objetivo")
    
    # Si los argumentos se pasan en estilo antiguo (ej: python analyzer.py path_de_archivo)
    # damos soporte a ambos para mantener compatibilidad total
    if len(sys.argv) == 2 and not sys.argv[1].startswith('-'):
        file_path = sys.argv[1]
        analyze_track(file_path)
    elif len(sys.argv) > 1:
        args = parser.parse_args()
        if args.file:
            analyze_track(args.file, cutoff=args.highpass)
        else:
            print(json.dumps({"status": "error", "message": "Missing file parameter"}))
            sys.exit(1)
    else:
        print(json.dumps({"status": "error", "message": "No arguments provided"}))
        sys.exit(1)
