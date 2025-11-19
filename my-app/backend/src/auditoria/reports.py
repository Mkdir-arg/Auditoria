from django.db.models import Count, Avg, Sum, Q
from django.db.models.functions import TruncDate
from django.core.cache import cache
from .models import Institucion, VisitaAuditoria, PlatoObservado


class ReportService:
    @staticmethod
    def get_dashboard_stats():
        """Estadísticas generales del dashboard - CON CACHÉ"""
        cache_key = 'dashboard_stats'
        stats = cache.get(cache_key)
        
        if stats is None:
            stats = {
                'total_instituciones': Institucion.objects.filter(activo=True).count(),
                'total_visitas': VisitaAuditoria.objects.count(),
                'total_platos': PlatoObservado.objects.count(),
                'visitas_por_tipo': list(
                    VisitaAuditoria.objects.values('tipo_comida')
                    .annotate(count=Count('id'))
                    .order_by('-count')
                ),
                'instituciones_por_tipo': list(
                    Institucion.objects.filter(activo=True)
                    .values('tipo')
                    .annotate(count=Count('id'))
                    .order_by('-count')
                ),
            }
            # Caché por 5 minutos
            cache.set(cache_key, stats, 300)
        
        return stats

    @staticmethod
    def get_visitas_por_periodo(fecha_inicio=None, fecha_fin=None):
        """Visitas agrupadas por fecha"""
        queryset = VisitaAuditoria.objects.all()
        
        if fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)
        
        return list(
            queryset.annotate(dia=TruncDate('fecha'))
            .values('dia')
            .annotate(count=Count('id'))
            .order_by('dia')
        )

    @staticmethod
    def get_reporte_institucion(institucion_id, fecha_inicio=None, fecha_fin=None):
        """Reporte detallado de una institución"""
        institucion = Institucion.objects.get(id=institucion_id)
        visitas = VisitaAuditoria.objects.filter(institucion=institucion)
        
        if fecha_inicio:
            visitas = visitas.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            visitas = visitas.filter(fecha__lte=fecha_fin)
        
        platos = PlatoObservado.objects.filter(visita__in=visitas)
        
        return {
            'institucion': {
                'id': institucion.id,
                'nombre': institucion.nombre,
                'codigo': institucion.codigo,
                'tipo': institucion.tipo,
            },
            'total_visitas': visitas.count(),
            'visitas_por_tipo_comida': list(
                visitas.values('tipo_comida')
                .annotate(count=Count('id'))
            ),
            'total_platos': platos.count(),
            'promedios_nutricionales': platos.aggregate(
                energia_promedio=Avg('energia_kcal_total'),
                proteinas_promedio=Avg('proteinas_g_total'),
                grasas_promedio=Avg('grasas_totales_g_total'),
                carbohidratos_promedio=Avg('carbohidratos_g_total'),
                fibra_promedio=Avg('fibra_g_total'),
                sodio_promedio=Avg('sodio_mg_total'),
            ),
            'ultimas_visitas': list(
                visitas.order_by('-fecha')[:10]
                .values('id', 'fecha', 'tipo_comida', 'observaciones')
            ),
        }

    @staticmethod
    def get_ranking_instituciones(fecha_inicio=None, fecha_fin=None, limit=10):
        """Ranking de instituciones por cantidad de visitas"""
        queryset = VisitaAuditoria.objects.all()
        
        if fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)
        
        return list(
            queryset.values('institucion__id', 'institucion__nombre', 'institucion__tipo')
            .annotate(total_visitas=Count('id'))
            .order_by('-total_visitas')[:limit]
        )

    @staticmethod
    def get_comparativa_nutricional(institucion_ids, fecha_inicio=None, fecha_fin=None):
        """Comparativa nutricional entre instituciones - OPTIMIZADO"""
        from django.db.models import F, Subquery, OuterRef
        
        # Filtrar visitas
        visitas_qs = VisitaAuditoria.objects.filter(institucion_id__in=institucion_ids)
        if fecha_inicio:
            visitas_qs = visitas_qs.filter(fecha__gte=fecha_inicio)
        if fecha_fin:
            visitas_qs = visitas_qs.filter(fecha__lte=fecha_fin)
        
        # Una sola query con aggregates por institución
        resultados = visitas_qs.values(
            'institucion__id', 'institucion__nombre'
        ).annotate(
            total_visitas=Count('id', distinct=True),
            total_platos=Count('platos', distinct=True),
            energia=Avg('platos__energia_kcal_total'),
            proteinas=Avg('platos__proteinas_g_total'),
            grasas=Avg('platos__grasas_totales_g_total'),
            carbohidratos=Avg('platos__carbohidratos_g_total'),
            fibra=Avg('platos__fibra_g_total'),
            sodio=Avg('platos__sodio_mg_total'),
        ).order_by('institucion__nombre')
        
        # Formatear respuesta
        return [
            {
                'institucion_id': r['institucion__id'],
                'institucion_nombre': r['institucion__nombre'],
                'total_visitas': r['total_visitas'],
                'total_platos': r['total_platos'],
                'promedios': {
                    'energia': r['energia'],
                    'proteinas': r['proteinas'],
                    'grasas': r['grasas'],
                    'carbohidratos': r['carbohidratos'],
                    'fibra': r['fibra'],
                    'sodio': r['sodio'],
                }
            }
            for r in resultados
        ]
