import { Server } from 'socket.io';
import { createServer } from 'http';
import { EventEmitter } from 'events';

export interface RealtimeEvent {
  type: 'crawl:progress' | 'document:added' | 'source:updated' | 'search:performed';
  data: any;
  timestamp: Date;
}

export class RealtimeServer extends EventEmitter {
  private io: Server | null = null;
  private httpServer: any = null;
  private port: number;
  private clients: Map<string, any> = new Map();

  constructor(port: number = 8089) {
    super();
    this.port = port;
  }

  async start() {
    try {
      // Create HTTP server
      this.httpServer = createServer();
      
      // Create Socket.IO server
      this.io = new Server(this.httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        },
        transports: ['websocket', 'polling']
      });

      // Handle connections
      this.io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        this.clients.set(socket.id, socket);

        // Send initial connection confirmation
        socket.emit('connected', {
          id: socket.id,
          timestamp: new Date()
        });

        // Handle client events
        socket.on('subscribe', (channel: string) => {
          socket.join(channel);
          console.log(`Client ${socket.id} subscribed to ${channel}`);
        });

        socket.on('unsubscribe', (channel: string) => {
          socket.leave(channel);
          console.log(`Client ${socket.id} unsubscribed from ${channel}`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
          console.log(`Client disconnected: ${socket.id}`);
          this.clients.delete(socket.id);
        });

        // Custom event handlers
        socket.on('search:request', (data) => {
          this.emit('search:request', { socketId: socket.id, ...data });
        });

        socket.on('crawl:control', (data) => {
          this.emit('crawl:control', { socketId: socket.id, ...data });
        });
      });

      // Start HTTP server
      await new Promise<void>((resolve) => {
        this.httpServer.listen(this.port, () => {
          console.log(`Realtime server listening on port ${this.port}`);
          resolve();
        });
      });

    } catch (error) {
      console.error('Failed to start realtime server:', error);
      throw error;
    }
  }

  // Broadcast to all clients
  broadcast(event: RealtimeEvent) {
    if (!this.io) return;
    
    this.io.emit(event.type, {
      ...event.data,
      timestamp: event.timestamp
    });
  }

  // Send to specific client
  sendToClient(socketId: string, event: RealtimeEvent) {
    const client = this.clients.get(socketId);
    if (client) {
      client.emit(event.type, {
        ...event.data,
        timestamp: event.timestamp
      });
    }
  }

  // Broadcast to a specific channel/room
  broadcastToChannel(channel: string, event: RealtimeEvent) {
    if (!this.io) return;
    
    this.io.to(channel).emit(event.type, {
      ...event.data,
      timestamp: event.timestamp
    });
  }

  // Send crawl progress updates
  sendCrawlProgress(progress: any) {
    this.broadcast({
      type: 'crawl:progress',
      data: progress,
      timestamp: new Date()
    });
  }

  // Send document added notification
  sendDocumentAdded(document: any) {
    this.broadcast({
      type: 'document:added',
      data: document,
      timestamp: new Date()
    });
  }

  // Send source update
  sendSourceUpdate(source: any) {
    this.broadcast({
      type: 'source:updated',
      data: source,
      timestamp: new Date()
    });
  }

  async stop() {
    if (this.io) {
      // Disconnect all clients
      this.io.disconnectSockets();
      
      // Close Socket.IO server
      await new Promise<void>((resolve) => {
        this.io!.close(() => {
          console.log('Socket.IO server closed');
          resolve();
        });
      });
    }

    if (this.httpServer) {
      // Close HTTP server
      await new Promise<void>((resolve) => {
        this.httpServer.close(() => {
          console.log('HTTP server closed');
          resolve();
        });
      });
    }

    this.clients.clear();
    this.io = null;
    this.httpServer = null;
  }

  getConnectedClients() {
    return Array.from(this.clients.keys());
  }

  getClientCount() {
    return this.clients.size;
  }
}