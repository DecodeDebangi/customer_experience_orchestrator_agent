/**
 * Example: Inventory Monitoring Agent
 * 
 * This agent monitors product inventory and sends notifications
 * when stock levels are low or items are back in stock.
 * 
 * Use Case: VTEX Inventory Monitoring
 */

import dotenv from 'dotenv';
import { BaseAgent } from '../src/Agent';
import { MessageAction, A2AMessage, MessagePriority } from '../src/A2AProtocol';
import { VTEXClient, LogAgentClient } from '../src/tools';
import { logger } from '../src/utils';

dotenv.config();

class InventoryMonitorAgent extends BaseAgent {
  private vtex: VTEXClient;
  private logagent: LogAgentClient;
  private subscriptions: Map<string, string[]> = new Map();

  constructor() {
    super({
      agentId: 'inventory_monitor_agent',
      agentName: 'Inventory Monitor Agent',
      agentType: 'inventory',
      version: '1.0.0',
      description: 'Monitors product inventory and sends alerts for low stock and restocks',
      capabilities: ['check_inventory', 'subscribe_to_alerts', 'get_stock_level'],
      port: 8081
    });

    // Initialize VTEX
    this.vtex = new VTEXClient({
      storeUrl: process.env.VTEX_STORE_URL!,
      appKey: process.env.VTEX_APP_KEY!,
      appToken: process.env.VTEX_APP_TOKEN!
    });

    // Initialize LogAgent
    this.logagent = new LogAgentClient({
      baseUrl: process.env.LOGAGENT_URL || 'https://logagent.logixal.com',
      apiKey: process.env.LOGAGENT_API_KEY || ''
    });

    // Register handlers
    this.registerHandler(MessageAction.REQUEST, this.handleRequest.bind(this));
  }

  async onStart(): Promise<void> {
    logger.info('🚀 Inventory Monitor Agent starting...');

    try {
      await this.logagent.registerAgent({
        agentId: this.agentId,
        agentName: this.config.agentName!,
        agentType: this.config.agentType!,
        version: this.config.version!,
        capabilities: this.config.capabilities!,
        endpoint: `http://localhost:${this.config.port}`,
        healthCheckUrl: `http://localhost:${this.config.port}/health`
      });
      logger.info('✅ Registered with LogAgent');
    } catch (error: any) {
      logger.error(`❌ Failed to register: ${error.message}`);
    }
  }

  private async handleRequest(message: A2AMessage): Promise<any> {
    const { capability, params } = message.data;

    if (capability === 'check_inventory') {
      return await this.checkInventory(params);
    } else if (capability === 'subscribe_to_alerts') {
      return await this.subscribeToAlerts(message.senderId, params);
    } else if (capability === 'get_stock_level') {
      return await this.getStockLevel(params);
    } else {
      return { success: false, error: `Unknown capability: ${capability}` };
    }
  }

  private async checkInventory(params: any): Promise<any> {
    const skuId = params.skuId;
    if (!skuId) {
      return { success: false, error: 'skuId required' };
    }

    try {
      const inventory = await this.vtex.getInventory(skuId);
      const totalQuantity = inventory.totalQuantity || 0;

      return {
        success: true,
        skuId,
        quantity: totalQuantity,
        inStock: totalQuantity > 0
      };
    } catch (error: any) {
      logger.error(`Error checking inventory: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  private async subscribeToAlerts(subscriberId: string, params: any): Promise<any> {
    const skuId = params.skuId;
    if (!skuId) {
      return { success: false, error: 'skuId required' };
    }

    if (!this.subscriptions.has(skuId)) {
      this.subscriptions.set(skuId, []);
    }

    const subscribers = this.subscriptions.get(skuId)!;
    if (!subscribers.includes(subscriberId)) {
      subscribers.push(subscriberId);
    }

    logger.info(`📮 ${subscriberId} subscribed to alerts for SKU ${skuId}`);

    return {
      success: true,
      message: `Subscribed to alerts for SKU ${skuId}`
    };
  }

  private async getStockLevel(params: any): Promise<any> {
    const skuId = params.skuId;
    if (!skuId) {
      return { success: false, error: 'skuId required' };
    }

    try {
      const inventory = await this.vtex.getInventory(skuId);
      return {
        success: true,
        skuId,
        availableQuantity: inventory.totalQuantity || 0,
        reservedQuantity: inventory.reservedQuantity || 0
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async backgroundTask(): Promise<void> {
    if (this.subscriptions.size === 0) {
      return;
    }

    logger.info(`🔍 Checking inventory for ${this.subscriptions.size} SKUs...`);

    for (const [skuId, subscribers] of this.subscriptions.entries()) {
      try {
        const inventory = await this.vtex.getInventory(skuId);
        const quantity = inventory.totalQuantity || 0;

        // Send alerts if out of stock
        if (quantity === 0) {
          await this.sendOOSAlert(skuId, subscribers);
        }
        // Send alerts if low stock
        else if (quantity < 5) {
          await this.sendLowStockAlert(skuId, quantity, subscribers);
        }
      } catch (error: any) {
        logger.error(`Error checking SKU ${skuId}: ${error.message}`);
      }
    }
  }

  private async sendOOSAlert(skuId: string, subscribers: string[]): Promise<void> {
    for (const subscriberId of subscribers) {
      try {
        await this.notify(
          subscriberId,
          'out_of_stock',
          { skuId, quantity: 0 },
          MessagePriority.HIGH
        );
        logger.info(`⚠️  Sent OOS alert for SKU ${skuId} to ${subscriberId}`);
      } catch (error: any) {
        logger.error(`Error sending alert: ${error.message}`);
      }
    }
  }

  private async sendLowStockAlert(skuId: string, quantity: number, subscribers: string[]): Promise<void> {
    for (const subscriberId of subscribers) {
      try {
        await this.notify(
          subscriberId,
          'low_stock',
          { skuId, quantity },
          MessagePriority.NORMAL
        );
        logger.info(`📉 Sent low stock alert for SKU ${skuId} to ${subscriberId}`);
      } catch (error: any) {
        logger.error(`Error sending alert: ${error.message}`);
      }
    }
  }
}

// Start the agent
if (require.main === module) {
  console.log('🤖 Starting Inventory Monitor Agent...');
  const agent = new InventoryMonitorAgent();
  agent.start();
}

export { InventoryMonitorAgent };

