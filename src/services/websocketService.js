class WebSocketService {
  // Add a static instance property
  static instance = null;
  
  constructor() {
    // Return existing instance if available
    if (WebSocketService.instance) {
      return WebSocketService.instance;
    }
    
    this.socket = null;
    this.listeners = new Map();
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
    
    WebSocketService.instance = this;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = import.meta.env.VITE_WS_URL || 'wss://ffb.vercel.app';
        
        // Add token for authentication if available
        const token = localStorage.getItem('token');
        const fullUrl = token ? `${wsUrl}?token=${token}` : wsUrl;
        
        this.socket = new WebSocket(fullUrl);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.reconnectAttempts = 0;
          this.reconnectDelay = 2000;
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const { channel, payload } = data;
            
            if (this.listeners.has(channel)) {
              this.listeners.get(channel).forEach(callback => callback(payload));
            }
          } catch (error) {
            console.error('Error parsing websocket message:', error);
          }
        };
        
        this.socket.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectTimeout = setTimeout(() => {
              this.reconnectAttempts++;
              this.reconnectDelay *= 1.5;
              this.connect();
            }, this.reconnectDelay);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
      } catch (error) {
        console.error('Failed to establish WebSocket connection:', error);
        reject(error);
      }
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.listeners.clear();
  }
  
  subscribe(channel, callback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
      
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'subscribe', channel }));
      }
    }
    
    this.listeners.get(channel).push(callback);
    
    return () => this.unsubscribe(channel, callback);
  }
  
  unsubscribe(channel, callback) {
    if (!this.listeners.has(channel)) return;
    
    const callbacks = this.listeners.get(channel);
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
    
    if (callbacks.length === 0) {
      this.listeners.delete(channel);
      
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'unsubscribe', channel }));
      }
    }
  }
  
  sendMessage(action, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action, data }));
    } else {
      console.error('WebSocket not connected, unable to send message');
    }
  }
}

export default new WebSocketService();
