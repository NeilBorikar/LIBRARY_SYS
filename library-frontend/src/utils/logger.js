// Comprehensive logging and monitoring utility

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs
    this.logLevel = process.env.NODE_ENV === 'production' ? 'error' : 'debug';
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  // Core logging method
  log(level, message, data = null, context = {}) {
    if (this.levels[level] < this.levels[this.logLevel]) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        userId: this.getCurrentUserId(),
        sessionId: this.getSessionId(),
        ...context
      }
    };

    // Add to memory logs
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with formatting
    this.consoleOutput(logEntry);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      this.sendToMonitoring(logEntry);
    }
  }

  debug(message, data, context) {
    this.log('debug', message, data, context);
  }

  info(message, data, context) {
    this.log('info', message, data, context);
  }

  warn(message, data, context) {
    this.log('warn', message, data, context);
  }

  error(message, error, context) {
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error;
    
    this.log('error', message, errorData, context);
  }

  // API call logging
  logApiCall(method, url, status, duration, error = null) {
    this.info('API Call', {
      method,
      url,
      status,
      duration: `${duration}ms`,
      error: error ? error.message : null
    }, {
      type: 'api'
    });
  }

  // User action logging
  logUserAction(action, details = {}) {
    this.info('User Action', {
      action,
      ...details
    }, {
      type: 'user_action'
    });
  }

  // Performance logging
  logPerformance(metric, value, unit = 'ms') {
    this.info('Performance', {
      metric,
      value,
      unit
    }, {
      type: 'performance'
    });
  }

  // Error boundary logging
  logErrorBoundary(error, errorInfo, componentStack) {
    this.error('Error Boundary Caught Error', error, {
      componentStack,
      type: 'error_boundary'
    });
  }

  // Console output with colors
  consoleOutput(logEntry) {
    const colors = {
      debug: '#6b7280',
      info: '#3b82f6',
      warn: '#f59e0b',
      error: '#ef4444'
    };

    const style = `color: ${colors[logEntry.level]}; font-weight: bold;`;
    
    console.group(
      `%c[${logEntry.level.toUpperCase()}] ${logEntry.timestamp}`,
      style
    );
    
    console.log('Message:', logEntry.message);
    
    if (logEntry.data) {
      console.log('Data:', logEntry.data);
    }
    
    if (Object.keys(logEntry.context).length > 1) {
      console.log('Context:', logEntry.context);
    }
    
    console.groupEnd();
  }

  // Get current user ID from localStorage
  getCurrentUserId() {
    return localStorage.getItem('userIdentifier') || 'anonymous';
  }

  // Get or create session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('logger_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('logger_session_id', sessionId);
    }
    return sessionId;
  }

  // Send logs to monitoring service (mock implementation)
  async sendToMonitoring(logEntry) {
    try {
      // In a real implementation, send to your monitoring service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
      
      // For now, just store in localStorage for debugging
      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(logEntry);
      localStorage.setItem('error_logs', JSON.stringify(existingLogs.slice(-50))); // Keep last 50 errors
    } catch (err) {
      console.error('Failed to send log to monitoring service:', err);
    }
  }

  // Get logs for debugging
  getLogs(level = null, limit = 100) {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-limit);
  }

  // Export logs for analysis
  exportLogs() {
    const logsStr = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([logsStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Set log level
  setLogLevel(level) {
    this.logLevel = level;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  // Start timing an operation
  start(name) {
    this.metrics.set(name, performance.now());
  }

  // End timing and log the duration
  end(name, logToConsole = true) {
    const startTime = this.metrics.get(name);
    if (!startTime) {
      console.warn(`Performance metric "${name}" was not started`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);

    if (logToConsole) {
      logger.logPerformance(name, duration);
    }

    return duration;
  }

  // Measure a function execution time
  async measure(name, fn) {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  // Monitor page load performance
  observePageLoad() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            logger.logPerformance('page_load', navigation.loadEventEnd - navigation.loadEventStart);
            logger.logPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
          }
        }, 0);
      });
    }
  }

  // Monitor Core Web Vitals
  observeCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logger.logPerformance('lcp', Math.round(lastEntry.startTime));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          logger.logPerformance('fid', Math.round(entry.processingStart - entry.startTime));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        logger.logPerformance('cls', Math.round(clsValue * 1000) / 1000);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  // Disconnect all observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// API call wrapper with logging
export const withApiLogging = (apiFunction) => {
  return async (...args) => {
    const start = performance.now();
    const method = args[0]?.method || 'GET';
    const url = args[0]?.url || 'unknown';
    
    try {
      const result = await apiFunction(...args);
      const duration = performance.now() - start;
      
      logger.logApiCall(method, url, 'success', duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      logger.logApiCall(method, url, 'error', duration, error);
      throw error;
    }
  };
};

// React hook for performance monitoring
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const mountTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    
    if (renderCount.current === 1) {
      logger.logPerformance(`${componentName}_mount`, performance.now() - mountTime.current);
    } else {
      logger.logPerformance(`${componentName}_render_${renderCount.current}`, 0);
    }
  });

  useEffect(() => {
    return () => {
      const duration = performance.now() - mountTime.current;
      logger.logPerformance(`${componentName}_lifetime`, duration);
    };
  }, []);
};

// Global logger instance
export const logger = new Logger();
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring
performanceMonitor.observePageLoad();
performanceMonitor.observeCoreWebVitals();

// Global error handlers
window.addEventListener('error', (event) => {
  logger.error('Global JavaScript Error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    type: 'global_error'
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', event.reason, {
    type: 'unhandled_rejection'
  });
});

export default logger;
