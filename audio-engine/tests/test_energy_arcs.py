"""
Tests reales para el módulo energy_arcs.py del audio-engine de Brand Music Curator.
Verifica: motor psicofisiológico de secuenciación por estado de tienda y tráfico IoT.
"""
import sys
import os
import json
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import energy_arcs


class TestGenerateEnergyArc:
    """Verifica la generación de arcos de energía según estado de tienda y tráfico."""

    def test_pre_opening_state(self, capsys):
        """PRE_OPENING: BPM alto (115-125), energía 80, lógica de motivación."""
        energy_arcs.generate_energy_arc("PRE_OPENING", "50")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success"
        assert result["state"] == "PRE_OPENING"
        assert result["target_bpm_range"] == [115, 125], \
            f"PRE_OPENING debe tener BPM [115, 125]. Obtenido: {result['target_bpm_range']}"
        assert result["target_energy"] == 80, \
            f"PRE_OPENING debe tener energía 80. Obtenido: {result['target_energy']}"
        assert "Motivación" in result["curation_logic"] or "staff" in result["curation_logic"].lower(), \
            f"PRE_OPENING debe mencionar motivación del staff. Lógica: {result['curation_logic']}"

    def test_closing_state(self, capsys):
        """CLOSING: BPM muy alto (125-135), energía 90, lógica de salida."""
        energy_arcs.generate_energy_arc("CLOSING", "75")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success"
        assert result["state"] == "CLOSING"
        assert result["target_bpm_range"] == [125, 135], \
            f"CLOSING debe tener BPM [125, 135]. Obtenido: {result['target_bpm_range']}"
        assert result["target_energy"] == 90, \
            f"CLOSING debe tener energía 90. Obtenido: {result['target_energy']}"
        assert "salida" in result["curation_logic"].lower() or "cierre" in result["curation_logic"].lower(), \
            f"CLOSING debe mencionar salida/cierre. Lógica: {result['curation_logic']}"

    def test_open_low_traffic(self, capsys):
        """OPEN + tráfico <30: BPM bajo (85-105), energía 40 (Milliman 1982)."""
        energy_arcs.generate_energy_arc("OPEN", "15")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success"
        assert result["target_bpm_range"] == [85, 105], \
            f"Tráfico bajo debe tener BPM [85, 105]. Obtenido: {result['target_bpm_range']}"
        assert result["target_energy"] == 40, \
            f"Tráfico bajo debe tener energía 40. Obtenido: {result['target_energy']}"
        assert "Dwell Time" in result["curation_logic"] or "permanencia" in result["curation_logic"].lower(), \
            f"Tráfico bajo debe mencionar Dwell Time/permanencia. Lógica: {result['curation_logic']}"

    def test_open_high_traffic(self, capsys):
        """OPEN + tráfico >80: BPM alto (120-130), energía 85."""
        energy_arcs.generate_energy_arc("OPEN", "90")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success"
        assert result["target_bpm_range"] == [120, 130], \
            f"Tráfico alto debe tener BPM [120, 130]. Obtenido: {result['target_bpm_range']}"
        assert result["target_energy"] == 85, \
            f"Tráfico alto debe tener energía 85. Obtenido: {result['target_energy']}"
        assert "aglomeraciones" in result["curation_logic"].lower() or "impulsivas" in result["curation_logic"].lower(), \
            f"Tráfico alto debe mencionar aglomeraciones/compras impulsivas. Lógica: {result['curation_logic']}"

    def test_open_medium_traffic(self, capsys):
        """OPEN + tráfico entre 30-80: BPM medio (105-120), energía 60."""
        energy_arcs.generate_energy_arc("OPEN", "50")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success"
        assert result["target_bpm_range"] == [105, 120], \
            f"Tráfico medio debe tener BPM [105, 120]. Obtenido: {result['target_bpm_range']}"
        assert result["target_energy"] == 60, \
            f"Tráfico medio debe tener energía 60. Obtenido: {result['target_energy']}"
        assert "estándar" in result["curation_logic"].lower() or "marca" in result["curation_logic"].lower(), \
            f"Tráfico medio debe mencionar ritmo estándar. Lógica: {result['curation_logic']}"

    def test_boundary_traffic_30(self, capsys):
        """Tráfico exactamente 30 debe tratarse como bajo (<30)."""
        energy_arcs.generate_energy_arc("OPEN", "30")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        # 30 no es <30, así que cae en el else (medio)
        assert result["target_bpm_range"] == [105, 120], \
            f"Tráfico=30 debe ser medio [105,120]. Obtenido: {result['target_bpm_range']}"

    def test_boundary_traffic_80(self, capsys):
        """Tráfico exactamente 80 debe tratarse como medio (no >80)."""
        energy_arcs.generate_energy_arc("OPEN", "80")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        # 80 no es >80, así que cae en el else (medio)
        assert result["target_bpm_range"] == [105, 120], \
            f"Tráfico=80 debe ser medio [105,120]. Obtenido: {result['target_bpm_range']}"

    def test_invalid_state_defaults(self, capsys):
        """Un estado no reconocido debe devolver defaults sin crash."""
        energy_arcs.generate_energy_arc("UNKNOWN_STATE", "50")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["status"] == "success", \
            f"Estado desconocido debe devolver success con defaults. Resultado: {result}"
        assert result["target_bpm_range"] == [100, 120], \
            f"Estado desconocido debe usar BPM default [100,120]"

    def test_traffic_string_conversion(self, capsys):
        """El tráfico pasado como string debe convertirse a int correctamente."""
        energy_arcs.generate_energy_arc("OPEN", "25")
        captured = capsys.readouterr()
        result = json.loads(captured.out.strip())
        assert result["traffic"] == 25, \
            f"El tráfico debe convertirse a int. Obtenido: {result['traffic']} (tipo: {type(result['traffic']).__name__})"