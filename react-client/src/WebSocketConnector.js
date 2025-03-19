export const Author = {
    SELF: "self",
    OTHER: "other",
    UNKNOWN: "unknown",
};

export class WebSocketConnector {
  static instance;

  constructor() {
    if (WebSocketConnector.instance) {
      return WebSocketConnector.instance;
    }
    WebSocketConnector.instance = this;

    this.listeners = [];
    this.connectWebSocket();
  }


  static getInstance() {
    if (!WebSocketConnector.instance) {
        WebSocketConnector.instance = new WebSocketConnector();
    }
    return WebSocketConnector.instance;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  addSentMessage(text, author) {
    this.sentMessages = [...this.sentMessages, {author: author, text}];
    this.notifyListeners();
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  connectWebSocket = () => {
    this.websocket = new WebSocket('wss://yv6mz81ws8.execute-api.us-west-2.amazonaws.com/production/');
    this.isConnected = false; // Track connection status
    this.sentMessages = [];

    this.websocket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
    };

    this.websocket.onmessage = (event) => {
      const message = event.data;
      console.log('Received message:', message);
      this.addSentMessage(message, Author.OTHER);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      // You might want to attempt reconnection here after a delay:
      setTimeout(this.connectWebSocket, 3000); // Reconnect after 3 seconds
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  disconnectWebSocket = () => {
    if (this.websocket) {
      this.websocket.close();
    }
  };

  sendMessage = (message) => {
    if (this.websocket && this.isConnected) {
      this.websocket.send(JSON.stringify({ action: 'sendmessage', message }));
      this.addSentMessage(message, Author.SELF)
      console.log('Sent message:', message);
    } else {
      console.log('WebSocket is not connected. Cannot send message.');
    }
  };
}