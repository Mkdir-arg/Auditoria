from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InstitucionViewSet,
    VisitaAuditoriaViewSet,
    PlatoObservadoViewSet,
    IngredientePlatoViewSet,
    dashboard_stats,
    visitas_por_periodo,
    reporte_institucion,
    ranking_instituciones,
    comparativa_nutricional,
)

router = DefaultRouter()
router.register(r'instituciones', InstitucionViewSet)
router.register(r'visitas', VisitaAuditoriaViewSet)
router.register(r'platos', PlatoObservadoViewSet)
router.register(r'ingredientes', IngredientePlatoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reportes/dashboard/', dashboard_stats, name='dashboard-stats'),
    path('reportes/visitas-periodo/', visitas_por_periodo, name='visitas-periodo'),
    path('reportes/institucion/<int:institucion_id>/', reporte_institucion, name='reporte-institucion'),
    path('reportes/ranking/', ranking_instituciones, name='ranking-instituciones'),
    path('reportes/comparativa/', comparativa_nutricional, name='comparativa-nutricional'),
]
