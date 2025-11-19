from django.contrib import admin
from .models import CategoriaAlimento, AlimentoNutricional


@admin.register(CategoriaAlimento)
class CategoriaAlimentoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre']
    search_fields = ['codigo', 'nombre']


@admin.register(AlimentoNutricional)
class AlimentoNutricionalAdmin(admin.ModelAdmin):
    list_display = ['codigo_argenfood', 'nombre', 'categoria', 'energia_kcal', 'proteinas_g']
    list_filter = ['categoria']
    search_fields = ['nombre', 'codigo_argenfood']
    list_per_page = 50
