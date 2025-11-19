from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.core.cache import cache
from .models import Institucion, VisitaAuditoria, PlatoObservado, IngredientePlato
from .serializers import (
    InstitucionSerializer,
    VisitaAuditoriaSerializer,
    VisitaAuditoriaListSerializer,
    PlatoObservadoSerializer,
    IngredientePlatoSerializer
)
from .reports import ReportService


class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tipo', 'activo', 'comuna']
    search_fields = ['nombre', 'codigo', 'barrio']


class VisitaAuditoriaViewSet(viewsets.ModelViewSet):
    queryset = VisitaAuditoria.objects.select_related('institucion').prefetch_related('platos').all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['institucion', 'tipo_comida', 'fecha']
    ordering_fields = ['fecha']
    ordering = ['-fecha']

    def get_serializer_class(self):
        if self.action == 'list':
            return VisitaAuditoriaListSerializer
        return VisitaAuditoriaSerializer


class PlatoObservadoViewSet(viewsets.ModelViewSet):
    queryset = PlatoObservado.objects.select_related('visita').prefetch_related('ingredientes__alimento').all()
    serializer_class = PlatoObservadoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['visita']

    @action(detail=True, methods=['post'])
    def recalcular(self, request, pk=None):
        """Recalcula los totales nutricionales del plato"""
        plato = self.get_object()
        totales = plato.recalcular_totales(save=True)
        return Response(totales)


class IngredientePlatoViewSet(viewsets.ModelViewSet):
    queryset = IngredientePlato.objects.select_related('plato', 'alimento').all()
    serializer_class = IngredientePlatoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['plato']

    def perform_create(self, serializer):
        ingrediente = serializer.save()
        ingrediente.recalcular_aporte(save=True)
        ingrediente.plato.recalcular_totales(save=True)
        # Invalidar caché del dashboard
        cache.delete('dashboard_stats')

    def perform_update(self, serializer):
        ingrediente = serializer.save()
        ingrediente.recalcular_aporte(save=True)
        ingrediente.plato.recalcular_totales(save=True)
        cache.delete('dashboard_stats')

    def perform_destroy(self, instance):
        plato = instance.plato
        instance.delete()
        plato.recalcular_totales(save=True)
        cache.delete('dashboard_stats')


@api_view(['GET'])
def dashboard_stats(request):
    """Estadísticas generales del dashboard"""
    stats = ReportService.get_dashboard_stats()
    return Response(stats)


@api_view(['GET'])
def visitas_por_periodo(request):
    """Visitas agrupadas por período"""
    fecha_inicio = request.query_params.get('fecha_inicio')
    fecha_fin = request.query_params.get('fecha_fin')
    data = ReportService.get_visitas_por_periodo(fecha_inicio, fecha_fin)
    return Response(data)


@api_view(['GET'])
def reporte_institucion(request, institucion_id):
    """Reporte detallado de una institución"""
    fecha_inicio = request.query_params.get('fecha_inicio')
    fecha_fin = request.query_params.get('fecha_fin')
    try:
        data = ReportService.get_reporte_institucion(institucion_id, fecha_inicio, fecha_fin)
        return Response(data)
    except Institucion.DoesNotExist:
        return Response({'error': 'Institución no encontrada'}, status=404)


@api_view(['GET'])
def ranking_instituciones(request):
    """Ranking de instituciones por visitas"""
    fecha_inicio = request.query_params.get('fecha_inicio')
    fecha_fin = request.query_params.get('fecha_fin')
    limit = int(request.query_params.get('limit', 10))
    data = ReportService.get_ranking_instituciones(fecha_inicio, fecha_fin, limit)
    return Response(data)


@api_view(['POST'])
def comparativa_nutricional(request):
    """Comparativa nutricional entre instituciones"""
    institucion_ids = request.data.get('institucion_ids', [])
    fecha_inicio = request.data.get('fecha_inicio')
    fecha_fin = request.data.get('fecha_fin')
    data = ReportService.get_comparativa_nutricional(institucion_ids, fecha_inicio, fecha_fin)
    return Response(data)
