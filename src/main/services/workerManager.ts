import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';
import path from 'path';

export interface WorkerTask {
  id: string;
  type: 'document:process' | 'embedding:generate' | 'index:update' | 'crawl:page';
  data: any;
  priority?: number;
}

export interface WorkerResult {
  taskId: string;
  success: boolean;
  result?: any;
  error?: string;
  duration: number;
}

export class WorkerManager extends EventEmitter {
  private workers: Map<string, Worker> = new Map();
  private workerPool: Worker[] = [];
  private taskQueue: WorkerTask[] = [];
  private activeTasks: Map<string, WorkerTask> = new Map();
  private maxWorkers: number;
  private workerScript: string;

  constructor(maxWorkers: number = 4) {
    super();
    this.maxWorkers = maxWorkers;
    this.workerScript = path.join(__dirname, 'workers', 'documentProcessor.js');
  }

  async initialize() {
    // Create worker pool
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = await this.createWorker(`worker-${i}`);
      this.workerPool.push(worker);
    }
    console.log(`Worker pool initialized with ${this.maxWorkers} workers`);
  }

  private async createWorker(name: string): Promise<Worker> {
    const worker = new Worker(`
      const { parentPort, workerData } = require('worker_threads');
      const crypto = require('crypto');
      
      // Simple document processor
      class DocumentProcessor {
        processDocument(doc) {
          // Simulate processing
          const processed = {
            ...doc,
            processedAt: new Date(),
            hash: crypto.createHash('sha256').update(doc.content).digest('hex'),
            wordCount: doc.content.split(' ').length,
            tokens: doc.content.toLowerCase().split(/\\s+/)
          };
          return processed;
        }
        
        generateEmbedding(text) {
          // Simulate embedding generation
          const hash = crypto.createHash('sha256').update(text).digest();
          const embedding = [];
          for (let i = 0; i < 768; i++) {
            embedding.push((hash[i % hash.length] / 255) * 2 - 1);
          }
          return embedding;
        }
      }
      
      const processor = new DocumentProcessor();
      
      parentPort.on('message', (task) => {
        const startTime = Date.now();
        try {
          let result;
          
          switch (task.type) {
            case 'document:process':
              result = processor.processDocument(task.data);
              break;
            case 'embedding:generate':
              result = processor.generateEmbedding(task.data.text);
              break;
            default:
              throw new Error(\`Unknown task type: \${task.type}\`);
          }
          
          parentPort.postMessage({
            taskId: task.id,
            success: true,
            result,
            duration: Date.now() - startTime
          });
        } catch (error) {
          parentPort.postMessage({
            taskId: task.id,
            success: false,
            error: error.message,
            duration: Date.now() - startTime
          });
        }
      });
    `, { eval: true, workerData: { name } });

    worker.on('error', (error) => {
      console.error(`Worker ${name} error:`, error);
      this.emit('worker:error', { worker: name, error });
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker ${name} exited with code ${code}`);
        this.emit('worker:exit', { worker: name, code });
      }
    });

    this.workers.set(name, worker);
    return worker;
  }

  async executeTask(task: WorkerTask): Promise<WorkerResult> {
    return new Promise((resolve, reject) => {
      // Add to queue
      this.taskQueue.push(task);
      this.processQueue();

      // Set up result handler
      const handler = (result: WorkerResult) => {
        if (result.taskId === task.id) {
          this.removeListener('task:complete', handler);
          if (result.success) {
            resolve(result);
          } else {
            reject(new Error(result.error));
          }
        }
      };

      this.on('task:complete', handler);

      // Timeout after 30 seconds
      setTimeout(() => {
        this.removeListener('task:complete', handler);
        reject(new Error('Task timeout'));
      }, 30000);
    });
  }

  private processQueue() {
    // Find available worker
    const availableWorker = this.workerPool.find(worker => {
      return !Array.from(this.activeTasks.values()).some(task => {
        return this.getWorkerForTask(task) === worker;
      });
    });

    if (!availableWorker || this.taskQueue.length === 0) {
      return;
    }

    // Get next task from queue
    const task = this.taskQueue.shift()!;
    this.activeTasks.set(task.id, task);

    // Send task to worker
    availableWorker.postMessage(task);

    // Handle response
    availableWorker.once('message', (result: WorkerResult) => {
      this.activeTasks.delete(task.id);
      this.emit('task:complete', result);
      
      // Process next task in queue
      this.processQueue();
    });
  }

  private getWorkerForTask(task: WorkerTask): Worker | undefined {
    // Simple round-robin assignment
    const index = parseInt(task.id, 16) % this.workerPool.length;
    return this.workerPool[index];
  }

  async processBatch(tasks: WorkerTask[]): Promise<WorkerResult[]> {
    const promises = tasks.map(task => this.executeTask(task));
    return Promise.all(promises);
  }

  getQueueSize(): number {
    return this.taskQueue.length;
  }

  getActiveTaskCount(): number {
    return this.activeTasks.size;
  }

  getStats() {
    return {
      queueSize: this.taskQueue.length,
      activeTasks: this.activeTasks.size,
      totalWorkers: this.workerPool.length,
      workers: Array.from(this.workers.keys())
    };
  }

  async terminate() {
    // Clear queue
    this.taskQueue = [];
    
    // Terminate all workers
    for (const [name, worker] of this.workers) {
      await worker.terminate();
      console.log(`Worker ${name} terminated`);
    }
    
    this.workers.clear();
    this.workerPool = [];
    this.activeTasks.clear();
  }
}