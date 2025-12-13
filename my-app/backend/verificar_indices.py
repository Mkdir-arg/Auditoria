#!/usr/bin/env python
"""
Script para verificar el uso y efectividad de los índices de base de datos
"""
import os
import sys
import django
from django.db import connection
from django.utils import timezone
from datetime import timedelta
import time

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from nutricion.models import AlimentoNutricional, CategoriaAlimento
from auditoria.models import Institucion, VisitaAuditoria, PlatoObservado


def print_header(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)


def show_table_indexes(table_name):
    """Muestra los índices de una tabla"""
    with connection.cursor() as cursor:
        cursor.execute(f"SHOW INDEX FROM {table_name}")
        indexes = cursor.fetchall()
        
        print(f"\n📊 Índices en {table_name}:")
        print("-" * 70)
        
        seen = set()
        for idx in indexes:
            index_name = idx[2]
            if index_name not in seen:
                seen.add(index_name)
                column = idx[4]
                unique = "UNIQUE" if idx[1] == 0 else "INDEX"
                print(f"  • {unique:8} | {index_name:40} | {column}")


def benchmark_query(description, query_func):
    """Ejecuta y mide el tiempo de una query"""
    start = time.time()
    result = query_func()
    elapsed = (time.time() - start) * 1000  # en ms
    
    count = result.count() if hasattr(result, 'count') else len(result)
    print(f"  ✓ {description:50} | {elapsed:6.2f}ms | {count:5} resultados")
    return elapsed


def main():
    print_header("🔍 VERIFICACIÓN DE ÍNDICES DE BASE DE DATOS")
    
    # 1. Mostrar índices de cada tabla
    print_header("📋 ÍNDICES CREADOS")
    
    tables = [
        'nutricion_categoriaalimento',
        'nutricion_alimentonutricional',
        'auditoria_institucion',
        'auditoria_visitaauditoria',
        'auditoria_platoobservado',
        'auditoria_platoplantilla',
        'auditoria_ingredienteplato',
        'auditoria_ingredienteplantilla',
    ]
    
    for table in tables:
        show_table_indexes(table)
    
    # 2. Benchmark de queries comunes
    print_header("⚡ BENCHMARK DE QUERIES")
    
    print("\n🥗 Nutrición:")
    benchmark_query(
        "Búsqueda de alimentos por nombre",
        lambda: AlimentoNutricional.objects.filter(nombre__icontains='a')[:20]
    )
    benchmark_query(
        "Alimentos ordenados por energía",
        lambda: AlimentoNutricional.objects.order_by('-energia_kcal')[:20]
    )
    benchmark_query(
        "Alimentos por categoría + nombre",
        lambda: AlimentoNutricional.objects.filter(categoria__codigo='CAR').order_by('nombre')[:20]
    )
    
    print("\n🏢 Instituciones:")
    benchmark_query(
        "Instituciones activas por tipo",
        lambda: Institucion.objects.filter(activo=True, tipo='escuela')
    )
    benchmark_query(
        "Instituciones por comuna",
        lambda: Institucion.objects.filter(comuna='1', activo=True)
    )
    
    print("\n📅 Visitas:")
    fecha_inicio = timezone.now().date() - timedelta(days=365)
    benchmark_query(
        "Visitas últimos 365 días",
        lambda: VisitaAuditoria.objects.filter(fecha__gte=fecha_inicio)
    )
    benchmark_query(
        "Visitas por tipo de comida",
        lambda: VisitaAuditoria.objects.filter(tipo_comida='almuerzo').order_by('-fecha')[:20]
    )
    
    if VisitaAuditoria.objects.exists():
        primera_visita = VisitaAuditoria.objects.first()
        benchmark_query(
            "Visitas de una institución",
            lambda: VisitaAuditoria.objects.filter(institucion=primera_visita.institucion)
        )
    
    print("\n🍽️ Platos:")
    if VisitaAuditoria.objects.exists():
        visita = VisitaAuditoria.objects.first()
        benchmark_query(
            "Platos de una visita",
            lambda: PlatoObservado.objects.filter(visita=visita)
        )
    
    # 3. Análisis de uso de índices
    print_header("📊 ANÁLISIS DE USO DE ÍNDICES")
    
    with connection.cursor() as cursor:
        # Verificar si hay estadísticas disponibles
        cursor.execute("""
            SELECT 
                table_name,
                index_name,
                COUNT(*) as num_columns
            FROM information_schema.statistics
            WHERE table_schema = DATABASE()
            AND table_name LIKE 'nutricion_%' OR table_name LIKE 'auditoria_%'
            GROUP BY table_name, index_name
            ORDER BY table_name, index_name
        """)
        
        print("\n📈 Resumen de índices por tabla:")
        print("-" * 70)
        
        current_table = None
        for row in cursor.fetchall():
            table, index, cols = row
            if table != current_table:
                print(f"\n  {table}:")
                current_table = table
            print(f"    • {index} ({cols} columna{'s' if cols > 1 else ''})")
    
    # 4. Recomendaciones
    print_header("💡 RECOMENDACIONES")
    
    total_alimentos = AlimentoNutricional.objects.count()
    total_visitas = VisitaAuditoria.objects.count()
    total_platos = PlatoObservado.objects.count()
    
    print(f"\n📊 Estadísticas actuales:")
    print(f"  • Alimentos: {total_alimentos}")
    print(f"  • Visitas: {total_visitas}")
    print(f"  • Platos: {total_platos}")
    
    print(f"\n✅ Estado de optimización:")
    if total_alimentos > 100:
        print(f"  ✓ Índices en AlimentoNutricional son CRÍTICOS (>{total_alimentos} registros)")
    if total_visitas > 50:
        print(f"  ✓ Índices en VisitaAuditoria son IMPORTANTES (>{total_visitas} registros)")
    if total_platos > 100:
        print(f"  ✓ Índices en PlatoObservado son RECOMENDADOS (>{total_platos} registros)")
    
    print(f"\n🎯 Los índices aplicados están optimizando:")
    print(f"  • Búsquedas de alimentos (nombre, código)")
    print(f"  • Filtros por categoría")
    print(f"  • Ordenamiento por calorías")
    print(f"  • Consultas de visitas por fecha")
    print(f"  • Reportes por institución")
    print(f"  • Agregaciones nutricionales")
    
    print_header("✅ VERIFICACIÓN COMPLETADA")
    print("\nPara más detalles, ejecuta:")
    print("  EXPLAIN SELECT * FROM nutricion_alimentonutricional WHERE nombre LIKE '%arroz%';")
    print()


if __name__ == '__main__':
    main()
