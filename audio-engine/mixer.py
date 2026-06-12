import sys
import json

def generate_mix_curve(track_1, track_2):
    """
    Calcula la viabilidad de la mezcla armónica (Harmonic Mixing) 
    entre dos pistas y genera una curva de transición (crossfade).
    """
    try:
        t1 = json.loads(track_1)
        t2 = json.loads(track_2)
        
        # Lógica simplificada de "Camelot Wheel"
        # Si comparten misma tonalidad o son relativas, es "Harmonic"
        harmonic = (t1.get('key') == t2.get('key'))
        
        # Diferencia de energía
        energy_diff = t2.get('energy', 50) - t1.get('energy', 50)
        
        # Tipo de transición
        if harmonic and abs(t1.get('bpm', 120) - t2.get('bpm', 120)) < 5:
            transition_type = "Long Crossfade (32 beats)"
        elif energy_diff > 30:
            transition_type = "Drop / Quick Cut (Energy Boost)"
        else:
            transition_type = "Standard Fade (16 beats)"
            
        result = {
            "status": "success",
            "transition": transition_type,
            "harmonic_match": harmonic,
            "energy_delta": round(energy_diff, 2)
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"status": "error", "message": "Missing track JSON data"}))
        sys.exit(1)
        
    generate_mix_curve(sys.argv[1], sys.argv[2])
