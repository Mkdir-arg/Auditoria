import logging
import json
from datetime import datetime
from elasticsearch import Elasticsearch
from django.conf import settings

class ElasticsearchHandler(logging.Handler):
    """Custom logging handler to send logs directly to Elasticsearch"""
    
    def __init__(self):
        super().__init__()
        self.es = Elasticsearch([{'host': 'auditoria-elasticsearch', 'port': 9200}])
        
    def emit(self, record):
        try:
            # Create log document
            log_doc = {
                '@timestamp': datetime.utcnow().isoformat(),
                'level': record.levelname,
                'message': record.getMessage(),
                'logger': record.name,
                'module': record.module,
                'function': record.funcName,
                'line': record.lineno,
                'source': 'django-backend'
            }
            
            # Add extra fields if present
            if hasattr(record, 'correlation_id'):
                log_doc['correlation_id'] = record.correlation_id
            if hasattr(record, 'user_id'):
                log_doc['user_id'] = record.user_id
            if hasattr(record, 'url'):
                log_doc['url'] = record.url
            if hasattr(record, 'data'):
                log_doc['data'] = record.data
                
            # Generate index name with current date
            index_name = f"auditoria-logs-{datetime.now().strftime('%Y.%m.%d')}"
            
            # Send to Elasticsearch
            self.es.index(index=index_name, document=log_doc)
            
        except Exception as e:
            # Don't let logging errors break the application
            print(f"Failed to send log to Elasticsearch: {e}")