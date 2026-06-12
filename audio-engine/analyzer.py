import sys
import json
import librosa
import numpy as np
import scipy.signal

def apply_highpass_filter(y, sr, cutoff=80):
    """
    Aplica un filtro paso-alto para recortar subgraves.
    Esencial para evitar el enmascaramiento de frecuencias en retail
    (grandes superficies donde los graves retumban).
    """
    nyquist = 0.5 * sr
    normal_cutoff = cutoff / nyquist
    b, a = scipy.signal.butter(4, normal_cutoff, btype='high', analog=False)
    filtered_y = scipy.signal.filtfilt(b, a, y)
    return filtered_y

def analyze_track(file_path):
    try:
        y, sr = librosa.load(file_path, sr=22050)
        
        # 1. Filtro Paso-Alto (Retail Audio Optimization)
        y_filtered = apply_highpass_filter(y, sr, cutoff=80)
        
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
            "dsp_applied": "High-pass Filter (80Hz) - Retail Optimized"
        }
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "Missing audio file path"}))
        sys.exit(1)
        
    analyze_track(sys.argv[1])
