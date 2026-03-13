// WebSocket utility for real-time features

import { useState, useEffect, useRef, useCallback } from 'react';
import { logger } from './logger';

class WebSocketManager {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnected = false;
    this.connectionPromise = null;
  }

  // Connect to WebSocket server
  async connect(url = 'ws://localhost:8004/ws') {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
          logger.info('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.connectionPromise = null;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            logger.error('WebSocket message parse error', error);
          }
        };

        this.ws.onclose = (event) => {
          logger.warn('WebSocket disconnected', { code: event.code, reason: event.reason });
          this.isConnected = false;
          this.connectionPromise = null;
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          logger.error('WebSocket error', error);
          this.connectionPromise = null;
          reject(error);
        };

      } catch (error) {
        logger.error('WebSocket connection failed', error);
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  // Schedule reconnection attempt
  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    logger.info(`Scheduling WebSocket reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, delay);
  }

  // Handle incoming messages
  handleMessage(data) {
    const { type, payload } = data;
    
    // Notify all listeners for this message type
    const typeListeners = this.listeners.get(type) || [];
    typeListeners.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        logger.error('WebSocket listener error', error);
      }
    });

    // Notify global listeners
    const globalListeners = this.listeners.get('*') || [];
    globalListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error('WebSocket global listener error', error);
      }
    });
  }

  // Send message to server
  send(type, payload) {
    if (!this.isConnected || !this.ws) {
      logger.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      const message = JSON.stringify({ type, payload });
      this.ws.send(message);
      logger.debug('WebSocket message sent', { type, payload });
      return true;
    } catch (error) {
      logger.error('WebSocket send error', error);
      return false;
    }
  }

  // Add event listener
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(callback);
  }

  // Remove event listener
  removeEventListener(type, callback) {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      const index = typeListeners.indexOf(callback);
      if (index > -1) {
        typeListeners.splice(index, 1);
      }
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.connectionPromise = null;
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Global WebSocket manager instance
export const wsManager = new WebSocketManager();

// React hook for WebSocket
export const useWebSocket = (url, autoConnect = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const listenersRef = useRef(new Set());

  useEffect(() => {
    if (autoConnect) {
      wsManager.connect(url).catch(setError);
    }

    const updateConnectionStatus = () => {
      setIsConnected(wsManager.isConnected);
    };

    const handleMessage = (data) => {
      setLastMessage(data);
    };

    wsManager.addEventListener('*', handleMessage);
    
    const statusInterval = setInterval(updateConnectionStatus, 1000);

    return () => {
      wsManager.removeEventListener('*', handleMessage);
      clearInterval(statusInterval);
      
      // Clean up component-specific listeners
      listenersRef.current.forEach(callback => {
        wsManager.removeEventListener('*', callback);
      });
      listenersRef.current.clear();
    };
  }, [url, autoConnect]);

  const sendMessage = useCallback((type, payload) => {
    return wsManager.send(type, payload);
  }, []);

  const addListener = useCallback((type, callback) => {
    wsManager.addEventListener(type, callback);
    listenersRef.current.add(callback);
    
    return () => {
      wsManager.removeEventListener(type, callback);
      listenersRef.current.delete(callback);
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    addListener
  };
};

// Real-time notifications hook
export const useRealTimeNotifications = (userRole, userId) => {
  const [notifications, setNotifications] = useState([]);
  const { addListener } = useWebSocket();

  useEffect(() => {
    if (!userRole || !userId) return;

    const handleNotification = (payload) => {
      // Only show notifications relevant to current user
      if (payload.targetRole === userRole || payload.targetUserId === userId) {
        setNotifications(prev => [payload, ...prev.slice(0, 9)]); // Keep last 10
        
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.title, {
            body: payload.message,
            icon: '/favicon.ico'
          });
        }
      }
    };

    const unsubscribe = addListener('notification', handleNotification);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return unsubscribe;
  }, [userRole, userId, addListener]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, clearNotifications };
};

// Real-time book availability hook
export const useBookAvailability = () => {
  const [bookUpdates, setBookUpdates] = useState({});
  const { addListener } = useWebSocket();

  useEffect(() => {
    const handleBookUpdate = (payload) => {
      setBookUpdates(prev => ({
        ...prev,
        [payload.bookId]: payload
      }));
    };

    return addListener('book_update', handleBookUpdate);
  }, [addListener]);

  return bookUpdates;
};

// Real-time dashboard updates hook
export const useDashboardUpdates = (userRole) => {
  const [dashboardData, setDashboardData] = useState(null);
  const { sendMessage, addListener } = useWebSocket();

  useEffect(() => {
    if (!userRole) return;

    // Subscribe to dashboard updates
    sendMessage('subscribe_dashboard', { role: userRole });

    const handleDashboardUpdate = (payload) => {
      setDashboardData(payload);
    };

    return addListener('dashboard_update', handleDashboardUpdate);
  }, [userRole, sendMessage, addListener]);

  return dashboardData;
};

// Real-time chat/messaging hook (for library staff communication)
export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(new Set());
  const { sendMessage, addListener } = useWebSocket();

  useEffect(() => {
    if (!roomId) return;

    // Join chat room
    sendMessage('join_chat', { roomId });

    const handleNewMessage = (payload) => {
      if (payload.roomId === roomId) {
        setMessages(prev => [...prev, payload]);
      }
    };

    const handleTypingIndicator = (payload) => {
      if (payload.roomId === roomId) {
        setIsTyping(prev => {
          const newSet = new Set(prev);
          if (payload.isTyping) {
            newSet.add(payload.userId);
          } else {
            newSet.delete(payload.userId);
          }
          return newSet;
        });
      }
    };

    const unsubscribeMessage = addListener('chat_message', handleNewMessage);
    const unsubscribeTyping = addListener('typing_indicator', handleTypingIndicator);

    return () => {
      sendMessage('leave_chat', { roomId });
      unsubscribeMessage();
      unsubscribeTyping();
    };
  }, [roomId, sendMessage, addListener]);

  const sendTypingIndicator = useCallback((isTyping) => {
    sendMessage('typing', { roomId, isTyping });
  }, [roomId, sendMessage]);

  const sendMessage = useCallback((content) => {
    sendMessage('chat_message', { roomId, content });
  }, [roomId, sendMessage]);

  return {
    messages,
    isTyping,
    sendTypingIndicator,
    sendMessage
  };
};

// Initialize WebSocket connection when app loads
export const initializeWebSocket = async () => {
  try {
    await wsManager.connect();
    logger.info('WebSocket initialized successfully');
  } catch (error) {
    logger.error('WebSocket initialization failed', error);
  }
};

export default wsManager;
