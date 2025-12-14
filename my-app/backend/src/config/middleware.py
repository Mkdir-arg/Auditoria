import time
import uuid
import structlog
from django.utils.deprecation import MiddlewareMixin
from opentelemetry import trace

logger = structlog.get_logger(__name__)

class LoggingMiddleware(MiddlewareMixin):
    """Middleware para logging completo de requests/responses"""
    
    def process_request(self, request):
        # Generar correlation ID único
        correlation_id = str(uuid.uuid4())
        request.correlation_id = correlation_id
        
        # Obtener tracer de OpenTelemetry
        tracer = trace.get_tracer(__name__)
        span = tracer.start_span(f"{request.method} {request.path}")
        request.span = span
        
        # Agregar atributos al span
        span.set_attribute("http.method", request.method)
        span.set_attribute("http.url", request.build_absolute_uri())
        span.set_attribute("http.user_agent", request.META.get('HTTP_USER_AGENT', ''))
        span.set_attribute("correlation.id", correlation_id)
        
        if request.user.is_authenticated:
            span.set_attribute("user.id", str(request.user.id))
            span.set_attribute("user.username", request.user.username)
        
        # Log del request
        logger.info(
            "Request iniciado",
            correlation_id=correlation_id,
            method=request.method,
            path=request.path,
            user=str(request.user) if request.user.is_authenticated else "Anonymous",
            ip=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            content_type=request.content_type,
            query_params=dict(request.GET),
        )
        
        request.start_time = time.time()
    
    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            
            # Actualizar span
            if hasattr(request, 'span'):
                request.span.set_attribute("http.status_code", response.status_code)
                request.span.set_attribute("http.response_size", len(response.content))
                request.span.set_attribute("duration.ms", duration * 1000)
                request.span.end()
            
            # Log del response
            logger.info(
                "Request completado",
                correlation_id=getattr(request, 'correlation_id', 'unknown'),
                method=request.method,
                path=request.path,
                status_code=response.status_code,
                duration_ms=round(duration * 1000, 2),
                response_size=len(response.content),
                user=str(request.user) if request.user.is_authenticated else "Anonymous",
            )
        
        return response
    
    def process_exception(self, request, exception):
        # Log de excepciones
        logger.error(
            "Request falló con excepción",
            correlation_id=getattr(request, 'correlation_id', 'unknown'),
            method=request.method,
            path=request.path,
            exception_type=type(exception).__name__,
            exception_message=str(exception),
            user=str(request.user) if request.user.is_authenticated else "Anonymous",
            exc_info=True
        )
        
        # Marcar span como error
        if hasattr(request, 'span'):
            request.span.set_attribute("error", True)
            request.span.set_attribute("error.type", type(exception).__name__)
            request.span.set_attribute("error.message", str(exception))
            request.span.end()
    
    def get_client_ip(self, request):
        """Obtener IP real del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class TransactionLoggingMiddleware(MiddlewareMixin):
    """Middleware para logging de transacciones de negocio"""
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Log específico para operaciones de auditoría
        if 'auditoria' in request.path:
            logger.info(
                "Transacción de auditoría",
                correlation_id=getattr(request, 'correlation_id', 'unknown'),
                view=view_func.__name__,
                args=view_args,
                kwargs=view_kwargs,
                user=str(request.user) if request.user.is_authenticated else "Anonymous",
                transaction_type=self.get_transaction_type(request.path, request.method)
            )
    
    def get_transaction_type(self, path, method):
        """Determinar tipo de transacción basado en path y método"""
        if 'instituciones' in path:
            if method == 'POST':
                return 'crear_institucion'
            elif method == 'PUT' or method == 'PATCH':
                return 'actualizar_institucion'
            elif method == 'DELETE':
                return 'eliminar_institucion'
            else:
                return 'consultar_institucion'
        elif 'visitas' in path:
            if method == 'POST':
                return 'crear_visita'
            elif method == 'PUT' or method == 'PATCH':
                return 'actualizar_visita'
            elif method == 'DELETE':
                return 'eliminar_visita'
            else:
                return 'consultar_visita'
        elif 'platos' in path:
            if method == 'POST':
                return 'crear_plato'
            elif method == 'PUT' or method == 'PATCH':
                return 'actualizar_plato'
            elif method == 'DELETE':
                return 'eliminar_plato'
            else:
                return 'consultar_plato'
        else:
            return f"{method.lower()}_general"