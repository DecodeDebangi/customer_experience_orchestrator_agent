/**
 * Main Entry Point
 * Start your agent from here
 */

import dotenv from 'dotenv';
import { BaseAgent } from './Agent';
import { MessageAction, A2AMessage } from './A2AProtocol';
import { LogAgentClient } from './tools';
import { logger } from './utils';

// Load environment variables
dotenv.config();

class MyCustomAgent extends BaseAgent {
  private logagent: LogAgentClient;

  constructor() {
    super({
      agentId: process.env.AGENT_ID || 'my_custom_agent',
      agentName: process.env.AGENT_NAME || 'My Custom Agent',
      agentType: process.env.AGENT_TYPE || 'custom',
      version: process.env.AGENT_VERSION || '1.0.0',
      description: 'My custom agent for the hackathon',
      capabilities: ['capability1', 'capability2'], // List your capabilities
      host: process.env.HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8080'),
      logLevel: process.env.LOG_LEVEL || 'info'
    });

    // Initialize LogAgent client
    this.logagent = new LogAgentClient({
      baseUrl: process.env.LOGAGENT_URL || 'http://192.168.15.48:8000',
      apiKey: process.env.LOGAGENT_API_KEY || 'logixal-agent-api-key-2024'
    });

    // Register message handlers
    this.registerHandler(MessageAction.REQUEST, this.handleRequest.bind(this));
    this.registerHandler(MessageAction.NOTIFY, this.handleNotification.bind(this));
  }

  async onStart(): Promise<void> {
    logger.info(`🚀 ${this.config.agentName} is starting...`);

    // Register with LogAgent
    try {
      await this.registerWithLogAgent();
      logger.info('✅ Registered with LogAgent');
    } catch (error: any) {
      logger.error(`❌ Failed to register with LogAgent: ${error.message}`);
    }
  }

  private async registerWithLogAgent(): Promise<void> {
    await this.logagent.registerAgent({
      agentId: this.agentId,
      agentName: this.config.agentName!,
      agentType: this.config.agentType!,
      version: this.config.version!,
      capabilities: this.config.capabilities!,
      endpoint: `http://${this.config.host}:${this.config.port}`,
      healthCheckUrl: `http://${this.config.host}:${this.config.port}/health`,
      metadata: {
        description: this.config.description,
        author: 'Logixal Hackathon Participant'
      }
    });
  }

  /**
   * Handle incoming REQUEST messages
   * This is where you implement your agent's capabilities!
   */
  private async handleRequest(message: A2AMessage): Promise<any> {
    const { capability, params } = message.data;

    logger.info(`🔧 Processing request for capability: ${capability}`);

    // Implement your capabilities here
    if (capability === 'capability1') {
      const result = await this.doCapability1(params);
      return { success: true, result };
    } else if (capability === 'capability2') {
      const result = await this.doCapability2(params);
      return { success: true, result };
    } else {
      return { success: false, error: `Unknown capability: ${capability}` };
    }
  }

  /**
   * Handle incoming NOTIFY messages
   */
  private async handleNotification(message: A2AMessage): Promise<void> {
    const notificationType = message.data.type;
    logger.info(`📬 Received notification: ${notificationType}`);

    // Handle different notification types
    // Add your notification handling logic here
  }

  /**
   * Implement your first capability
   */
  private async doCapability1(params: any): Promise<any> {
    // TODO: Implement your first capability
    return { message: 'Capability 1 executed', params };
  }

  /**
   * Implement your second capability
   */
  private async doCapability2(params: any): Promise<any> {
    // TODO: Implement your second capability
    return { message: 'Capability 2 executed', params };
  }

  /**
   * Send an event to LogAgent for tracking
   * Use this to log important events, errors, or status updates
   */
  async sendEvent(eventType: string, message: string, severity: 'info' | 'warning' | 'error' = 'info', metadata?: any): Promise<void> {
    try {
      await this.logagent.sendEvent(
        this.agentId,
        eventType,
        {
          message,
          severity,
          ...metadata
        }
      );
      logger.info(`📤 Event sent to LogAgent: ${eventType} - ${message}`);
    } catch (error: any) {
      logger.error(`❌ Failed to send event to LogAgent: ${error.message}`);
    }
  }

  /**
   * Send A2A message to notification agent (via A2A Bridge)
   * Use this to send emails or other notifications
   */
  async sendA2AMessage(targetAgent: string, action: string, payload: any, priority: 'low' | 'normal' | 'high' = 'normal'): Promise<void> {
    try {
      const response = await this.logagent.sendA2AMessage({
        agentId: this.agentId,
        targetAgent,
        action,
        payload,
        priority
      });
      logger.info(`📨 A2A message sent to ${targetAgent}: ${action}`);
      return response;
    } catch (error: any) {
      logger.error(`❌ Failed to send A2A message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update agent metadata and capabilities
   * Use this to dynamically update your agent's configuration
   */
  async updateAgentMetadata(updates: { agentName?: string; capabilities?: string[]; metadata?: Record<string, any> }): Promise<void> {
    try {
      await this.logagent.updateAgent(this.agentId, updates);
      logger.info(`✅ Agent metadata updated`);
    } catch (error: any) {
      logger.error(`❌ Failed to update agent metadata: ${error.message}`);
    }
  }

  /**
   * Get agent logs from LogAgent
   * Use this to retrieve your agent's event history
   */
  async getMyLogs(limit: number = 50, eventType?: string): Promise<any> {
    try {
      const logs = await this.logagent.getAgentLogs(this.agentId, limit, 0, eventType);
      logger.info(`📋 Retrieved ${logs.logs?.length || 0} logs`);
      return logs;
    } catch (error: any) {
      logger.error(`❌ Failed to get logs: ${error.message}`);
      return { logs: [] };
    }
  }

  /**
   * Background task that runs continuously
   * Use this for periodic checks, scheduled tasks, monitoring, etc.
   */
  async backgroundTask(): Promise<void> {
    try {
      // Send heartbeat to LogAgent
      const health = this.getHealth();
      await this.logagent.updateStatus(
        this.agentId,
        health.status,
        {
          uptimeSeconds: health.uptimeSeconds,
          messagesProcessed: health.totalMessagesProcessed,
          messagesSent: health.totalMessagesSent,
          errorCount: health.errorCount
        }
      );

      logger.info('💓 Heartbeat sent to LogAgent');
    } catch (error: any) {
      logger.error(`❌ Error in background task: ${error.message}`);
    }
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('🤖 Logixal Agent AI - TypeScript Template');
  console.log('='.repeat(60));
  console.log();

  const agent = new MyCustomAgent();
  
  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    await agent.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    await agent.stop();
    process.exit(0);
  });

  // Start the agent
  await agent.start();
}

// Run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Fatal error: ${error.message}`, error);
    process.exit(1);
  });
}

export { MyCustomAgent };