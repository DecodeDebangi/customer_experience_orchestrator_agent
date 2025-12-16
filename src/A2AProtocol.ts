/**
 * A2A (Agent-to-Agent) Protocol Implementation
 * Enables seamless communication between agents in the Logixal ecosystem
 */

import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum MessageAction {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
  NOTIFY = 'NOTIFY',
  PROPOSE = 'PROPOSE',
  CONFIRM = 'CONFIRM',
  REJECT = 'REJECT',
  QUERY = 'QUERY',
  COMMAND = 'COMMAND',
}

export interface A2AMessage {
  messageId: string;
  senderId: string;
  receiverId: string;
  action: MessageAction;
  data: Record<string, any>;
  priority: MessagePriority;
  timestamp: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export type MessageHandler = (message: A2AMessage) => Promise<any>;

export interface A2AProtocolConfig {
  agentId: string;
  timeout?: number;
}

export class A2AProtocol extends EventEmitter {
  private agentId: string;
  private messageHandlers: Map<MessageAction, MessageHandler>;
  private pendingResponses: Map<
    string,
    {
      resolve: (value: A2AMessage | null) => void;
      reject: (reason?: any) => void;
      timeout: NodeJS.Timeout;
    }
  >;
  private subscriptions: Map<string, Set<Function>>;
  private defaultTimeout: number;

  constructor(config: A2AProtocolConfig) {
    super();
    this.agentId = config.agentId;
    this.defaultTimeout = config.timeout || 5000;
    this.messageHandlers = new Map();
    this.pendingResponses = new Map();
    this.subscriptions = new Map();

    console.log(`📡 A2A Protocol initialized for agent: ${this.agentId}`);
  }

  /**
   * Register a message handler for a specific action
   */
  registerHandler(action: MessageAction, handler: MessageHandler): void {
    this.messageHandlers.set(action, handler);
  }

  /**
   * Send a message to another agent
   */
  async sendMessage(
    receiverId: string,
    action: MessageAction,
    data: Record<string, any>,
    priority: MessagePriority = MessagePriority.NORMAL,
    correlationId?: string,
    metadata?: Record<string, any>,
  ): Promise<A2AMessage> {
    const message: A2AMessage = {
      messageId: `msg_${uuidv4().substring(0, 12)}`,
      senderId: this.agentId,
      receiverId,
      action,
      data,
      priority,
      timestamp: new Date().toISOString(),
      correlationId,
      metadata,
    };

    console.log(
      `📤 Sending message: ${this.agentId} -> ${receiverId} [${action}] (priority: ${priority})`,
    );

    // Dispatch message (in production, this would use a message broker)
    await this.dispatchMessage(message);

    return message;
  }

  /**
   * Send a request and wait for response
   */
  async request(
    receiverId: string,
    action: MessageAction,
    data: Record<string, any>,
    timeout?: number,
  ): Promise<A2AMessage | null> {
    const correlationId = `req_${uuidv4().substring(0, 12)}`;
    const timeoutMs = timeout || this.defaultTimeout;

    // Create promise for response
    const responsePromise = new Promise<A2AMessage | null>((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        this.pendingResponses.delete(correlationId);
        console.warn(`⏱️  Request timeout for ${correlationId}`);
        resolve(null);
      }, timeoutMs);

      this.pendingResponses.set(correlationId, {
        resolve,
        reject,
        timeout: timeoutHandle,
      });
    });

    // Send request
    await this.sendMessage(receiverId, action, data, MessagePriority.NORMAL, correlationId);

    // Wait for response
    try {
      const response = await responsePromise;
      console.log(`✅ Received response for ${correlationId}`);
      return response;
    } finally {
      this.pendingResponses.delete(correlationId);
    }
  }

  /**
   * Handle an incoming message
   */
  async handleMessage(message: A2AMessage): Promise<A2AMessage | null> {
    console.log(`📥 Received message: ${message.senderId} -> ${this.agentId} [${message.action}]`);

    // Handle response to pending request
    if (message.correlationId && this.pendingResponses.has(message.correlationId)) {
      const pending = this.pendingResponses.get(message.correlationId);
      if (pending) {
        clearTimeout(pending.timeout);
        pending.resolve(message);
        this.pendingResponses.delete(message.correlationId);
      }
      return null;
    }

    // Dispatch to registered handler
    const handler = this.messageHandlers.get(message.action);
    if (handler) {
      try {
        const responseData = await handler(message);

        // If handler returns data, send response
        if (responseData !== undefined && responseData !== null) {
          return await this.sendMessage(
            message.senderId,
            MessageAction.RESPONSE,
            responseData,
            MessagePriority.NORMAL,
            message.messageId,
          );
        }
      } catch (error: any) {
        console.error(`❌ Error handling message: ${error.message}`, error);
        return await this.sendMessage(
          message.senderId,
          MessageAction.RESPONSE,
          { error: error.message, success: false },
          MessagePriority.NORMAL,
          message.messageId,
        );
      }
    } else {
      console.warn(`⚠️  No handler for action: ${message.action}`);
    }

    return null;
  }

  /**
   * Subscribe to a topic for pub-sub messaging
   */
  subscribe(topic: string, callback: Function): void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)!.add(callback);
    console.log(`📮 Subscribed to topic: ${topic}`);
  }

  /**
   * Publish a message to a topic
   */
  async publish(topic: string, data: Record<string, any>): Promise<void> {
    console.log(`📢 Publishing to topic: ${topic}`);
    const callbacks = this.subscriptions.get(topic);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          await callback(data);
        } catch (error: any) {
          console.error(`❌ Error in subscription callback: ${error.message}`);
        }
      }
    }
  }

  /**
   * Dispatch message to receiver
   * In production, this would use a message broker (RabbitMQ, Kafka, etc.)
   */
  private async dispatchMessage(message: A2AMessage): Promise<void> {
    // Placeholder for actual message broker integration
    // In production, send via:
    // - RabbitMQ
    // - Apache Kafka
    // - AWS SQS
    // - Redis Pub/Sub
    // - HTTP webhook

    this.emit('message', message);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    // Clear all pending responses
    for (const [_correlationId, pending] of this.pendingResponses.entries()) {
      clearTimeout(pending.timeout);
      pending.resolve(null);
    }
    this.pendingResponses.clear();
    this.messageHandlers.clear();
    this.subscriptions.clear();
    this.removeAllListeners();
  }
}

// Convenience functions

export async function sendNotification(
  protocol: A2AProtocol,
  receiverId: string,
  notificationType: string,
  data: Record<string, any>,
  priority: MessagePriority = MessagePriority.NORMAL,
): Promise<A2AMessage> {
  return await protocol.sendMessage(
    receiverId,
    MessageAction.NOTIFY,
    { type: notificationType, ...data },
    priority,
  );
}

export async function requestCapability(
  protocol: A2AProtocol,
  receiverId: string,
  capability: string,
  params: Record<string, any>,
  timeout?: number,
): Promise<Record<string, any> | null> {
  const response = await protocol.request(
    receiverId,
    MessageAction.REQUEST,
    { capability, params },
    timeout,
  );
  return response ? response.data : null;
}
