interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: any
  timestamp: string
  url: string
  userAgent: string
  userId?: string
  correlationId?: string
}

class Logger {
  private static correlationId: string = this.generateCorrelationId()
  private static userId: string | null = null

  private static generateCorrelationId(): string {
    return 'web-' + Math.random().toString(36).substr(2, 9)
  }

  static setUserId(userId: string) {
    this.userId = userId
  }

  static setCorrelationId(correlationId: string) {
    this.correlationId = correlationId
  }

  private static createLogEntry(level: LogEntry['level'], message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId || undefined,
      correlationId: this.correlationId
    }
  }

  private static async sendToBackend(logEntry: LogEntry) {
    try {
      await fetch('/api/logs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      })
    } catch (error) {
      console.warn('Failed to send log to backend:', error)
    }
  }

  static info(message: string, data?: any) {
    const logEntry = this.createLogEntry('info', message, data)
    console.info(`[${logEntry.correlationId}] ${message}`, data)
    this.sendToBackend(logEntry)
  }

  static warn(message: string, data?: any) {
    const logEntry = this.createLogEntry('warn', message, data)
    console.warn(`[${logEntry.correlationId}] ${message}`, data)
    this.sendToBackend(logEntry)
  }

  static error(message: string, error?: Error | any) {
    const logEntry = this.createLogEntry('error', message, {
      error: error?.message || error,
      stack: error?.stack,
      name: error?.name
    })
    console.error(`[${logEntry.correlationId}] ${message}`, error)
    this.sendToBackend(logEntry)
  }

  static debug(message: string, data?: any) {
    const logEntry = this.createLogEntry('debug', message, data)
    console.debug(`[${logEntry.correlationId}] ${message}`, data)
    this.sendToBackend(logEntry)
  }

  static transaction(action: string, data?: any) {
    this.info(`Transaction: ${action}`, {
      transactionType: action,
      ...data
    })
  }

  static userAction(action: string, element?: string, data?: any) {
    this.info(`User Action: ${action}`, {
      action,
      element,
      ...data
    })
  }

  static apiCall(method: string, url: string, duration: number, status: number, data?: any) {
    const level = status >= 400 ? 'error' : 'info'
    this[level](`API Call: ${method} ${url}`, {
      method,
      url,
      duration,
      status,
      ...data
    })
  }

  static performance(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance: ${metric}`, {
      metric,
      value,
      unit
    })
  }
}

// Capturar errores globales
window.addEventListener('error', (event) => {
  Logger.error('Global Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  })
})

// Capturar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  Logger.error('Unhandled Promise Rejection', {
    reason: event.reason
  })
})

export default Logger