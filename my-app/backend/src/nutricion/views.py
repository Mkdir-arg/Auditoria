from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CategoriaAlimento, AlimentoNutricional
from .serializers import (
    CategoriaAlimentoSerializer,
    AlimentoNutricionalSerializer,
    AlimentoNutricionalListSerializer
)


class CategoriaAlimentoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaAlimento.objects.all()
    serializer_class = CategoriaAlimentoSerializer


class AlimentoNutricionalViewSet(viewsets.ModelViewSet):
    queryset = AlimentoNutricional.objects.select_related('categoria').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria']
    search_fields = ['nombre', 'codigo_argenfood']
    ordering_fields = ['nombre', 'codigo_argenfood', 'energia_kcal']
    ordering = ['nombre']

    def get_serializer_class(self):
        if self.action == 'list':
            return AlimentoNutricionalListSerializer
        return AlimentoNutricionalSerializer
