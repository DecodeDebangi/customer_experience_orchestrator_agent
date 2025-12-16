/**
 * Base Agent Implementation
 * Provides core functionality for building Logixal agents
 */

import express, { Express, Request, Response } from 'express';
import { A2AProtocol, A2AMessage, MessageAction, MessagePriority } from './A2AProtocol';
import { setupLogging, logger } from './utils';
import http from 'http';

export interface AgentConfig {
  agentId: string;
  agentName: string;
  agentType: string;
  version?: string;
  description?: string;
  capabilities?: string[];
  host?: string;
  port?: number;
  logLevel?: string;
}

export interface AgentHealth {
  status: string;
  agentId: string;
  uptimeSeconds: number;
  totalMessagesProcessed: number;
  totalMessagesSent: number;
  errorCount: number;
  lastActivity: string;
}

export class BaseAgent {
  protected config: AgentConfig;
  protected agentId: string;
  protected a2a: A2AProtocol;
  protected app: Express;
  protected server?: http.Server;

  private startTime: Date;
  private totalMessagesProcessed: number = 0;
  private totalMessagesSent: number = 0;
  private errorCount: number = 0;
  private lastActivity: Date;
  private backgroundTaskInterval?: NodeJS.Timeout;

  constructor(config: AgentConfig) {
    this.config = {
      version: '1.0.0',
      description: '',
      capabilities: [],
      host: '0.0.0.0',
      port: 8080,
      logLevel: 'info',
      ...config,
    };

    this.agentId = config.agentId;
    this.startTime = new Date();
    this.lastActivity = new Date();

    // Setup logging
    setupLogging(this.config.logLevel!);

    // Initialize A2A protocol
    this.a2a = new A2AProtocol({ agentId: this.agentId });

    // Initialize Express app
    this.app = express();
    this.app.use(express.json());

    // Setup endpoints
    this.setupEndpoints();

    // Setup default A2A handlers
    this.setupA2AHandlers();

    logger.info(`🤖 Agent initialized: ${this.agentId} (${config.agentName})`);
  }

  private setupEndpoints(): void {
    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json(this.getHealth());
    });

    // Detailed status endpoint
    this.app.get('/status', async (_req: Request, res: Response) => {
      try {
        res.json({
          agentId: this.agentId,
          agentName: this.config.agentName,
          agentType: this.config.agentType,
          version: this.config.version,
          capabilities: this.config.capabilities,
          health: this.getHealth(),
          metadata: await this.getMetadata(),
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Capabilities endpoint
    this.app.get('/capabilities', (_req: Request, res: Response) => {
      res.json({
        agentId: this.agentId,
        capabilities: this.config.capabilities,
        supportedActions: Object.values(MessageAction),
      });
    });

    // Receive A2A message
    this.app.post('/message', async (req: Request, res: Response) => {
      try {
        const message: A2AMessage = req.body;
        this.totalMessagesProcessed++;
        this.lastActivity = new Date();

        const response = await this.a2a.handleMessage(message);
        res.json({ success: true, response });
      } catch (error: any) {
        this.errorCount++;
        logger.error(`Error processing message: ${error.message}`, error);
        res.status(500).json({ error: error.message });
      }
    });
  }

  private setupA2AHandlers(): void {
    // Handle QUERY messages
    this.a2a.registerHandler(MessageAction.QUERY, async (message: A2AMessage) => {
      const queryType = message.data.queryType;

      if (queryType === 'status') {
        return {
          agentId: this.agentId,
          status: 'active',
          uptime: (Date.now() - this.startTime.getTime()) / 1000,
        };
      } else if (queryType === 'capabilities') {
        return { capabilities: this.config.capabilities };
      } else {
        return { error: `Unknown query type: ${queryType}` };
      }
    });
  }

  /**
   * Send a message to another agent
   */
  async sendMessage(
    receiverId: string,
    action: MessageAction,
    data: Record<string, any>,
    priority: MessagePriority = MessagePriority.NORMAL,
  ): Promise<A2AMessage> {
    this.totalMessagesSent++;
    this.lastActivity = new Date();
    return await this.a2a.sendMessage(receiverId, action, data, priority);
  }

  /**
   * Request a capability from another agent
   */
  async request(
    receiverId: string,
    capability: string,
    params: Record<string, any>,
    timeout?: number,
  ): Promise<Record<string, any> | null> {
    const response = await this.a2a.request(
      receiverId,
      MessageAction.REQUEST,
      { capability, params },
      timeout,
    );
    return response ? response.data : null;
  }

  /**
   * Send a notification to another agent
   */
  async notify(
    receiverId: string,
    notificationType: string,
    data: Record<string, any>,
    priority: MessagePriority = MessagePriority.NORMAL,
  ): Promise<void> {
    await this.sendMessage(
      receiverId,
      MessageAction.NOTIFY,
      { type: notificationType, ...data },
      priority,
    );
  }

  /**
   * Register a message handler
   */
  registerHandler(action: MessageAction, handler: (message: A2AMessage) => Promise<any>): void {
    logger.error('action', action);
    logger.error('handler', handler);
    this.a2a.registerHandler(action, handler);
  }

  /**
   * Get agent health status
   */
  getHealth(): AgentHealth {
    const uptime = (Date.now() - this.startTime.getTime()) / 1000;

    return {
      status: this.errorCount === 0 ? 'healthy' : 'degraded',
      agentId: this.agentId,
      uptimeSeconds: uptime,
      totalMessagesProcessed: this.totalMessagesProcessed,
      totalMessagesSent: this.totalMessagesSent,
      errorCount: this.errorCount,
      lastActivity: this.lastActivity.toISOString(),
    };
  }

  /**
   * Get agent metadata (override in subclass)
   */
  async getMetadata(): Promise<Record<string, any>> {
    return {
      agentType: this.config.agentType,
      version: this.config.version,
      description: this.config.description,
    };
  }

  /**
   * Called when agent starts (override in subclass)
   */
  async onStart(): Promise<void> {
    logger.info(`🚀 Agent ${this.agentId} starting...`);
  }

  /**
   * Called when agent stops (override in subclass)
   */
  async onStop(): Promise<void> {
    logger.info(`🛑 Agent ${this.agentId} stopping...`);
  }

  /**
   * Background task loop (override in subclass)
   * Runs continuously while agent is active
   */
  async backgroundTask(): Promise<void> {
    // Override this in your agent implementation
    logger.debug('Background task running...');
  }

  /**
   * Start the agent
   */
  async start(): Promise<void> {
    logger.info(`🚀 Starting agent: ${this.agentId}`);
    logger.info(`📡 Listening on ${this.config.host}:${this.config.port}`);

    // Run startup hook
    await this.onStart();

    // Start background task
    this.backgroundTaskInterval = setInterval(async () => {
      try {
        await this.backgroundTask();
      } catch (error: any) {
        logger.error(`Error in background task: ${error.message}`, error);
        this.errorCount++;
      }
    }, 30000); // Run every 30 seconds

    // Start HTTP server
    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.port || 8080, this.config.host || '0.0.0.0', () => {
        logger.info(`✅ Agent ${this.agentId} is ready and listening`);
        resolve();
      });
    });
  }

  /**
   * Stop the agent
   */
  async stop(): Promise<void> {
    logger.info(`🛑 Stopping agent: ${this.agentId}`);

    // Stop background task
    if (this.backgroundTaskInterval) {
      clearInterval(this.backgroundTaskInterval);
    }

    // Run shutdown hook
    await this.onStop();

    // Close HTTP server
    if (this.server) {
      return new Promise((resolve) => {
        this.server!.close(() => {
          logger.info(`✅ Agent ${this.agentId} stopped`);
          resolve();
        });
      });
    }

    // Clean up A2A protocol
    this.a2a.destroy();
  }
}
