import sys
import json

def generate_energy_arc(store_state, current_traffic_level):
    """
    Motor psicofisiológico para secuenciación en bloques (Energy Arcs).
    Modula la energía de la música basándose en el estado de la tienda
    y los datos de los sensores IoT (Tráfico de clientes).
    """
    
    # store_state: "PRE_OPENING", "OPEN", "CLOSING"
    # current_traffic_level: 0 a 100
    
    try:
        traffic = int(current_traffic_level)
        
        target_arc = {
            "status": "success",
            "state": store_state,
            "traffic": traffic,
            "target_bpm_range": [100, 120],
            "target_energy": 50,
            "curation_logic": ""
        }
        
        if store_state == "PRE_OPENING":
            target_arc["target_bpm_range"] = [115, 125]
            target_arc["target_energy"] = 80
            target_arc["curation_logic"] = "Motivación del staff. Ritmos alegres para tareas de limpieza y reposición."
            
        elif store_state == "CLOSING":
            target_arc["target_bpm_range"] = [125, 135]
            target_arc["target_energy"] = 90
            target_arc["curation_logic"] = "Alta energía para acelerar el flujo de salida de clientes y animar al personal en el cierre."
            
        elif store_state == "OPEN":
            if traffic < 30:
                # Neuro-optimización: Milliman 1982
                target_arc["target_bpm_range"] = [85, 105]
                target_arc["target_energy"] = 40
                target_arc["curation_logic"] = "Afluencia baja: Reducción de BPMs para aumentar el tiempo de permanencia (Dwell Time) e impulsar ventas."
            elif traffic > 80:
                target_arc["target_bpm_range"] = [120, 130]
                target_arc["target_energy"] = 85
                target_arc["curation_logic"] = "Afluencia alta: Incremento de BPMs para evitar aglomeraciones y estimular compras impulsivas."
            else:
                target_arc["target_bpm_range"] = [105, 120]
                target_arc["target_energy"] = 60
                target_arc["curation_logic"] = "Afluencia media: Ritmo estándar de marca."
                
        print(json.dumps(target_arc))
        
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"status": "error", "message": "Missing store_state or traffic_level"}))
        sys.exit(1)
        
    generate_energy_arc(sys.argv[1], sys.argv[2])
