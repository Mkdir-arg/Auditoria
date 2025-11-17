from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, me

router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('me/', me, name='me'),
    path('', include(router.urls)),
]