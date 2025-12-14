from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
import json
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class ItemViewSet(viewsets.ModelViewSet):
    """ViewSet básico para items"""
    queryset = User.objects.none()  # Placeholder
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        return Response({'items': []})

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para usuarios"""
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        users = User.objects.all().values('id', 'username', 'email', 'first_name', 'last_name')
        return Response(list(users))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Obtener información del usuario actual"""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def log_frontend(request):
    """Endpoint para recibir logs del frontend"""
    try:
        from elasticsearch import Elasticsearch
        from datetime import datetime
        import socket
        
        log_data = request.data
        
        # Extraer información del log
        level = log_data.get('level', 'info')
        message = log_data.get('message', '')
        data = log_data.get('data', {})
        correlation_id = log_data.get('correlationId', 'unknown')
        user_id = log_data.get('userId')
        url = log_data.get('url', '')
        user_agent = log_data.get('userAgent', '')
        
        # Obtener IP del cliente
        client_ip = request.META.get('HTTP_X_FORWARDED_FOR')
        if client_ip:
            client_ip = client_ip.split(',')[0].strip()
        else:
            client_ip = request.META.get('REMOTE_ADDR', 'unknown')
        
        # Crear documento para Elasticsearch
        log_doc = {
            '@timestamp': datetime.utcnow().isoformat(),
            'level': level.upper(),
            'message': message[:1000],  # Limitar mensaje a 1000 chars
            'source': 'frontend',
            'correlation_id': correlation_id,
            'user_id': user_id,
            'url': url,
            'user_agent': user_agent[:500] if user_agent else '',  # Limitar user agent
            'client_ip': client_ip,
            'server_host': socket.gethostname(),
            'data': data if isinstance(data, dict) else {}
        }
        
        # Enviar a Elasticsearch con rotación diaria automática
        try:
            es = Elasticsearch(['http://auditoria-elasticsearch:9200'])
            # Índice con fecha UTC para rotación diaria
            index_name = f"auditoria-logs-{datetime.utcnow().strftime('%Y.%m.%d')}"
            es.index(index=index_name, document=log_doc)
        except Exception as es_error:
            logger.error(f'Failed to send to Elasticsearch: {es_error}')
        
        # También log en Django para backup
        logger.info(f'Frontend Log: {message}', extra={
            'correlation_id': correlation_id,
            'user_id': user_id,
            'url': url,
            'client_ip': client_ip
        })
        
        return Response({'status': 'logged'}, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error('Error processing frontend log', extra={'error': str(e)}, exc_info=True)
        return Response({'error': 'Failed to process log'}, status=status.HTTP_400_BAD_REQUEST)