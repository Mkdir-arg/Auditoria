#!/usr/bin/env python
import json
from pathlib import Path

def convertir_pescados():
    archivo = Path("../data/PESCADOS MARISCOS Y CONSERVAS.json")
    
    with open(archivo, 'r', encoding='utf-8') as f:
        datos = json.load(f)
    
    # Cargar fixtures existentes
    fixtures_path = Path("fixtures/alimentos_inicial.json")
    with open(fixtures_path, 'r', encoding='utf-8') as f:
        fixtures = json.load(f)
    
    # Obtener último PK
    cat_pk = max([f["pk"] for f in fixtures if f["model"] == "nutricion.categoriaalimento"]) + 1
    alim_pk = max([f["pk"] for f in fixtures if f["model"] == "nutricion.alimentonutricional"]) + 1
    
    # Mapeo de categorías
    categorias_map = {
        "Pescados": {"pk": cat_pk, "codigo": "PES"},
        "Mariscos": {"pk": cat_pk + 1, "codigo": "MAR"},
        "Conservas": {"pk": cat_pk + 2, "codigo": "CON"}
    }
    
    # Agregar categorías
    for nombre, data in categorias_map.items():
        fixtures.append({
            "model": "nutricion.categoriaalimento",
            "pk": data["pk"],
            "fields": {"codigo": data["codigo"], "nombre": nombre}
        })
    
    # Procesar cada sección
    for seccion, items in datos.items():
        if seccion not in categorias_map:
            continue
            
        cat_pk_actual = categorias_map[seccion]["pk"]
        
        for item in items:
            comp = item.get("Composición Nutricional", {})
            
            fixtures.append({
                "model": "nutricion.alimentonutricional",
                "pk": alim_pk,
                "fields": {
                    "codigo_argenfood": int(item.get("Nº", 0)),
                    "nombre": item.get("Alimento", ""),
                    "especie": item.get("Género - especie - variedad"),
                    "unidad_base": "100 g",
                    "categoria": cat_pk_actual,
                    "energia_kj": comp.get("Energía (kj)"),
                    "energia_kcal": comp.get("Energía (kcal)"),
                    "agua_g": comp.get("Agua (g)"),
                    "proteinas_g": comp.get("Proteínas (g)"),
                    "grasas_totales_g": comp.get("Grasa Total (g)"),
                    "carbohidratos_totales_g": comp.get("Carbohidratos totales (g)") if comp.get("Carbohidratos totales (g)") not in ["...", None] else None,
                    "carbohidratos_disponibles_g": None,
                    "fibra_g": None,
                    "cenizas_g": comp.get("Cenizas (g)"),
                    "sodio_mg": comp.get("Sodio (mg)"),
                    "potasio_mg": comp.get("Potasio (mg)"),
                    "calcio_mg": comp.get("Calcio (mg)"),
                    "fosforo_mg": comp.get("Fósforo (mg)"),
                    "hierro_mg": comp.get("Hierro (mg)"),
                    "zinc_mg": comp.get("Zinc (mg)"),
                    "tiamina_mg": comp.get("Tiamina (mg)"),
                    "riboflavina_mg": comp.get("Rivoflavina (mg)"),
                    "niacina_mg": comp.get("Niacina (mg)"),
                    "vitamina_c_mg": comp.get("Vitamina C (mg)"),
                    "grasas_saturadas_g": comp.get("Ac. grasos saturados (g)"),
                    "grasas_monoinsat_g": comp.get("Ac. grasos monoinsaturados (g)"),
                    "grasas_poliinsat_g": comp.get("Ac. grasos poliinsaturados (g)"),
                    "colesterol_mg": None,
                    "ag_c14_0_g": None,
                    "ag_c16_0_g": None,
                    "ag_c18_0_g": None,
                    "ag_c18_1w9_g": None,
                    "ag_c18_2w6_g": None,
                    "ag_c18_3w3_g": None,
                    "ag_epa_g": None,
                    "ag_dha_g": None,
                    "fuente": "UNLu - Argenfood"
                }
            })
            alim_pk += 1
    
    # Guardar
    with open(fixtures_path, 'w', encoding='utf-8') as f:
        json.dump(fixtures, f, ensure_ascii=False, indent=2)
    
    print(f"Fixtures actualizados: {fixtures_path}")
    print(f"   Total categorias: {len([f for f in fixtures if f['model'] == 'nutricion.categoriaalimento'])}")
    print(f"   Total alimentos: {len([f for f in fixtures if f['model'] == 'nutricion.alimentonutricional'])}")

if __name__ == "__main__":
    convertir_pescados()
