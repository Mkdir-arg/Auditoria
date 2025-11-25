#!/usr/bin/env python
import json
import os
from pathlib import Path

CATEGORIA_CODIGOS = {
    "Cereales y derivados": "CER",
    "Frutas": "FRT",
    "Vegetales y derivados": "VEG",
    "Grasas y aceites": "GRA",
    "Pescados y mariscos": "PES",
}

def convertir_a_fixtures():
    data_dir = Path("../data")
    archivos = [
        "cereales.json",
        "fruta.json",
        "vegetales.json",
        "GRASASyACEITES.json",
        "PESCADOS MARISCOS Y CONSERVAS.json"
    ]
    
    categorias = {}
    cat_pk = 1
    alimentos = []
    alim_pk = 1
    
    for archivo in archivos:
        ruta = data_dir / archivo
        if not ruta.exists():
            continue
            
        with open(ruta, 'r', encoding='utf-8') as f:
            datos = json.load(f)
        
        if not isinstance(datos, list):
            print(f"Saltando {archivo}: no es una lista")
            continue
        
        for item in datos:
            if not isinstance(item, dict):
                continue
            cat_nombre = item.get("categoria")
            
            # Crear categoría si no existe
            if cat_nombre not in categorias:
                codigo = CATEGORIA_CODIGOS.get(cat_nombre, cat_nombre[:3].upper())
                categorias[cat_nombre] = {
                    "pk": cat_pk,
                    "codigo": codigo
                }
                cat_pk += 1
            
            # Crear alimento
            alimento = {
                "model": "nutricion.alimentonutricional",
                "pk": alim_pk,
                "fields": {
                    "codigo_argenfood": item["codigo_argenfood"],
                    "nombre": item["nombre"],
                    "especie": item.get("especie"),
                    "unidad_base": item.get("unidad_base", "100 g"),
                    "categoria": categorias[cat_nombre]["pk"],
                    "energia_kj": item.get("energia_kj"),
                    "energia_kcal": item.get("energia_kcal"),
                    "agua_g": item.get("agua_g"),
                    "proteinas_g": item.get("proteinas_g"),
                    "grasas_totales_g": item.get("grasas_totales_g"),
                    "carbohidratos_totales_g": item.get("carbohidratos_totales_g"),
                    "carbohidratos_disponibles_g": item.get("carbohidratos_disponibles_g"),
                    "fibra_g": item.get("fibra_g"),
                    "cenizas_g": item.get("cenizas_g"),
                    "sodio_mg": item.get("sodio_mg"),
                    "potasio_mg": item.get("potasio_mg"),
                    "calcio_mg": item.get("calcio_mg"),
                    "fosforo_mg": item.get("fosforo_mg"),
                    "hierro_mg": item.get("hierro_mg"),
                    "zinc_mg": item.get("zinc_mg"),
                    "tiamina_mg": item.get("tiamina_mg"),
                    "riboflavina_mg": item.get("riboflavina_mg"),
                    "niacina_mg": item.get("niacina_mg"),
                    "vitamina_c_mg": item.get("vitamina_c_mg"),
                    "grasas_saturadas_g": item.get("grasas_saturadas_g"),
                    "grasas_monoinsat_g": item.get("grasas_monoinsat_g"),
                    "grasas_poliinsat_g": item.get("grasas_poliinsat_g"),
                    "colesterol_mg": item.get("colesterol_mg"),
                    "ag_c14_0_g": item.get("ag_c14_0_g"),
                    "ag_c16_0_g": item.get("ag_c16_0_g"),
                    "ag_c18_0_g": item.get("ag_c18_0_g"),
                    "ag_c18_1w9_g": item.get("ag_c18_1w9_g"),
                    "ag_c18_2w6_g": item.get("ag_c18_2w6_g"),
                    "ag_c18_3w3_g": item.get("ag_c18_3w3_g"),
                    "ag_epa_g": item.get("ag_epa_g"),
                    "ag_dha_g": item.get("ag_dha_g"),
                    "fuente": item.get("fuente")
                }
            }
            alimentos.append(alimento)
            alim_pk += 1
    
    # Crear fixtures
    fixtures = []
    
    # Agregar categorías
    for nombre, data in categorias.items():
        fixtures.append({
            "model": "nutricion.categoriaalimento",
            "pk": data["pk"],
            "fields": {
                "codigo": data["codigo"],
                "nombre": nombre
            }
        })
    
    # Agregar alimentos
    fixtures.extend(alimentos)
    
    # Guardar
    output = Path("fixtures/alimentos_inicial.json")
    output.parent.mkdir(exist_ok=True)
    
    with open(output, 'w', encoding='utf-8') as f:
        json.dump(fixtures, f, ensure_ascii=False, indent=2)
    
    print(f"Fixtures creados: {output}")
    print(f"   Categorias: {len(categorias)}")
    print(f"   Alimentos: {len(alimentos)}")

if __name__ == "__main__":
    convertir_a_fixtures()
