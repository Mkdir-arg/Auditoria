from django.db import models
from decimal import Decimal
from nutricion.models import AlimentoNutricional


class Institucion(models.Model):
    TIPO_CHOICES = [
        ('escuela', 'Escuela'),
        ('cdi', 'CDI'),
        ('hogar', 'Hogar'),
        ('geriatrico', 'Geriátrico'),
        ('otro', 'Otro'),
    ]

    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    barrio = models.CharField(max_length=100, null=True, blank=True)
    comuna = models.CharField(max_length=50, null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Institución"
        verbose_name_plural = "Instituciones"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"


class VisitaAuditoria(models.Model):
    TIPO_COMIDA_CHOICES = [
        ("desayuno", "Desayuno"),
        ("almuerzo", "Almuerzo"),
        ("merienda", "Merienda"),
        ("cena", "Cena"),
        ("vianda", "Vianda"),
    ]

    institucion = models.ForeignKey(
        Institucion,
        on_delete=models.PROTECT,
        related_name="visitas",
    )
    fecha = models.DateField()
    tipo_comida = models.CharField(max_length=20, choices=TIPO_COMIDA_CHOICES)
    observaciones = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = "Visita de auditoría"
        verbose_name_plural = "Visitas de auditoría"
        ordering = ['-fecha']
        indexes = [
            models.Index(fields=['institucion', '-fecha']),
        ]

    def __str__(self):
        return f"{self.institucion.nombre} - {self.fecha} - {self.get_tipo_comida_display()}"


class PlatoObservado(models.Model):
    TIPO_PLATO_CHOICES = [
        ("principal", "Plato principal"),
        ("guarnicion", "Guarnición"),
        ("postre", "Postre"),
        ("bebida", "Bebida"),
        ("otro", "Otro"),
    ]

    visita = models.ForeignKey(
        VisitaAuditoria,
        on_delete=models.CASCADE,
        related_name="platos",
    )
    nombre = models.CharField(max_length=255)
    tipo_plato = models.CharField(
        max_length=50,
        choices=TIPO_PLATO_CHOICES,
        null=True,
        blank=True,
    )
    porciones_servidas = models.IntegerField(null=True, blank=True)
    notas = models.TextField(null=True, blank=True)

    energia_kcal_total = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    proteinas_g_total = models.DecimalField(
        max_digits=12, decimal_places=3, null=True, blank=True
    )
    grasas_totales_g_total = models.DecimalField(
        max_digits=12, decimal_places=3, null=True, blank=True
    )
    carbohidratos_g_total = models.DecimalField(
        max_digits=12, decimal_places=3, null=True, blank=True
    )
    fibra_g_total = models.DecimalField(
        max_digits=12, decimal_places=3, null=True, blank=True
    )
    sodio_mg_total = models.DecimalField(
        max_digits=12, decimal_places=3, null=True, blank=True
    )

    class Meta:
        verbose_name = "Plato observado"
        verbose_name_plural = "Platos observados"
        ordering = ['id']

    def __str__(self):
        return f"{self.nombre} ({self.visita})"

    def recalcular_totales(self, save=True):
        """Recalcula los totales nutricionales del plato sumando todos sus ingredientes."""
        energia = Decimal("0")
        prot = Decimal("0")
        grasa = Decimal("0")
        cho = Decimal("0")
        fibra = Decimal("0")
        sodio = Decimal("0")

        # Optimización: Prefetch alimentos en una sola query
        for ing in self.ingredientes.select_related('alimento').all():
            factor = (ing.cantidad or 0) / Decimal("100")
            alimento = ing.alimento

            if alimento.energia_kcal is not None:
                energia += factor * alimento.energia_kcal
            if alimento.proteinas_g is not None:
                prot += factor * alimento.proteinas_g
            if alimento.grasas_totales_g is not None:
                grasa += factor * alimento.grasas_totales_g
            if alimento.carbohidratos_disponibles_g is not None:
                cho += factor * alimento.carbohidratos_disponibles_g
            elif alimento.carbohidratos_totales_g is not None:
                cho += factor * alimento.carbohidratos_totales_g
            if alimento.fibra_g is not None:
                fibra += factor * alimento.fibra_g
            if alimento.sodio_mg is not None:
                sodio += factor * alimento.sodio_mg

        self.energia_kcal_total = energia
        self.proteinas_g_total = prot
        self.grasas_totales_g_total = grasa
        self.carbohidratos_g_total = cho
        self.fibra_g_total = fibra
        self.sodio_mg_total = sodio

        if save:
            self.save()

        return {
            "energia_kcal_total": energia,
            "proteinas_g_total": prot,
            "grasas_totales_g_total": grasa,
            "carbohidratos_g_total": cho,
            "fibra_g_total": fibra,
            "sodio_mg_total": sodio,
        }


class IngredientePlato(models.Model):
    plato = models.ForeignKey(
        PlatoObservado,
        on_delete=models.CASCADE,
        related_name="ingredientes",
    )
    alimento = models.ForeignKey(
        AlimentoNutricional,
        on_delete=models.PROTECT,
        related_name="ingredientes_en_platos",
    )
    cantidad = models.DecimalField(max_digits=10, decimal_places=3)
    unidad = models.CharField(max_length=20, default="g")
    orden = models.IntegerField(null=True, blank=True)

    energia_kcal = models.DecimalField(
        max_digits=12, decimal_places=3, null=True, blank=True
    )
    proteinas_g = models.DecimalField(
        max_digits=12, decimal_places=5, null=True, blank=True
    )
    grasas_totales_g = models.DecimalField(
        max_digits=12, decimal_places=5, null=True, blank=True
    )
    carbohidratos_g = models.DecimalField(
        max_digits=12, decimal_places=5, null=True, blank=True
    )
    fibra_g = models.DecimalField(
        max_digits=12, decimal_places=5, null=True, blank=True
    )
    sodio_mg = models.DecimalField(
        max_digits=12, decimal_places=5, null=True, blank=True
    )

    class Meta:
        verbose_name = "Ingrediente de plato"
        verbose_name_plural = "Ingredientes de plato"
        ordering = ['orden', 'id']

    def __str__(self):
        return f"{self.alimento.nombre} ({self.cantidad}{self.unidad})"

    def recalcular_aporte(self, save=True):
        """Calcula y guarda el aporte nutricional de ESTE ingrediente."""
        factor = self.cantidad / Decimal("100")
        a = self.alimento

        self.energia_kcal = factor * (a.energia_kcal or 0)
        self.proteinas_g = factor * (a.proteinas_g or 0)
        self.grasas_totales_g = factor * (a.grasas_totales_g or 0)

        if a.carbohidratos_disponibles_g is not None:
            self.carbohidratos_g = factor * a.carbohidratos_disponibles_g
        else:
            self.carbohidratos_g = factor * (a.carbohidratos_totales_g or 0)

        self.fibra_g = factor * (a.fibra_g or 0)
        self.sodio_mg = factor * (a.sodio_mg or 0)

        if save:
            self.save()

        return {
            "energia_kcal": self.energia_kcal,
            "proteinas_g": self.proteinas_g,
            "grasas_totales_g": self.grasas_totales_g,
            "carbohidratos_g": self.carbohidratos_g,
            "fibra_g": self.fibra_g,
            "sodio_mg": self.sodio_mg,
        }
