/**
 * Agent Tools
 * Pre-built integrations with Logixal commerce platforms
 */

import axios, { AxiosInstance } from "axios";
import { logger } from "./utils";

// VTEX Client
export interface VTEXConfig {
  storeUrl: string;
  appKey: string;
  appToken: string;
}

export class VTEXClient {
  private client: AxiosInstance;

  constructor(config: VTEXConfig) {
    this.client = axios.create({
      baseURL: config.storeUrl,
      headers: {
        "X-VTEX-API-AppKey": config.appKey,
        "X-VTEX-API-AppToken": config.appToken,
        "Content-Type": "application/json",
      },
    });
  }

  async getOrder(orderId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/oms/pvt/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting order: ${error.message}`);
      throw error;
    }
  }

  async getInventory(skuId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/logistics/pvt/inventory/skus/${skuId}`
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting inventory: ${error.message}`);
      throw error;
    }
  }

  async searchProducts(query: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await this.client.get(
        `/api/catalog_system/pub/products/search/${query}`,
        {
          params: { _from: 0, _to: limit },
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error searching products: ${error.message}`);
      throw error;
    }
  }

  // Checkout API methods for Customer Experience Orchestrator
  async getCheckoutSession(orderFormId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/checkout/pub/orderForm/${orderFormId}`
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting checkout session: ${error.message}`);
      throw error;
    }
  }

  async getOrderForm(orderFormId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/checkout/pub/orderForm/${orderFormId}`
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting order form: ${error.message}`);
      throw error;
    }
  }

  async getActiveOrderForms(): Promise<any[]> {
    try {
      // Note: This is a simplified approach. In production, you might need to track active sessions differently
      // VTEX doesn't have a direct API to list all active order forms, so this would typically be tracked via webhooks
      const response = await this.client.get(`/api/checkout/pub/orderForm`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      logger.error(`Error getting active order forms: ${error.message}`);
      return [];
    }
  }

  // Session API methods
  async getSession(sessionId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/sessions/${sessionId}`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting session: ${error.message}`);
      throw error;
    }
  }

  async getCustomerOrders(email: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await this.client.get(`/api/oms/pvt/orders`, {
        params: {
          q: email,
          _limit: limit,
        },
      });
      return response.data?.list || [];
    } catch (error: any) {
      logger.error(`Error getting customer orders: ${error.message}`);
      return [];
    }
  }

  async getCustomerProfile(email: string): Promise<any> {
    try {
      const orders = await this.getCustomerOrders(email, 1);
      return {
        email,
        isFirstTime: orders.length === 0,
        totalOrders: orders.length,
        lastOrderDate: orders[0]?.creationDate || null,
      };
    } catch (error: any) {
      logger.error(`Error getting customer profile: ${error.message}`);
      return {
        email,
        isFirstTime: true,
        totalOrders: 0,
        lastOrderDate: null,
      };
    }
  }
}

// CommerceTools Client
export interface CommerceToolsConfig {
  projectKey: string;
  clientId: string;
  clientSecret: string;
  apiUrl: string;
  authUrl: string;
}

export class CommerceToolsClient {
  private config: CommerceToolsConfig;
  private client: AxiosInstance;
  private accessToken?: string;

  constructor(config: CommerceToolsConfig) {
    this.config = config;
    this.client = axios.create();
  }

  private async getToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.config.authUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
          scope: `manage_project:${this.config.projectKey}`,
        }),
        {
          auth: {
            username: this.config.clientId,
            password: this.config.clientSecret,
          },
        }
      );

      this.accessToken = response.data.access_token;
      return this.accessToken || "";
    } catch (error: any) {
      logger.error(`Error getting token: ${error.message}`);
      throw error;
    }
  }

  async getCart(cartId: string): Promise<any> {
    try {
      const token = await this.getToken();
      const response = await this.client.get(
        `${this.config.apiUrl}/${this.config.projectKey}/carts/${cartId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting cart: ${error.message}`);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<any> {
    try {
      const token = await this.getToken();
      const response = await this.client.get(
        `${this.config.apiUrl}/${this.config.projectKey}/customers/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting customer: ${error.message}`);
      throw error;
    }
  }
}

// LogAgent Client
export interface LogAgentConfig {
  baseUrl: string;
  apiKey: string;
}

export interface AgentRegistration {
  agentId: string;
  agentName: string;
  agentType: string;
  version: string;
  capabilities: string[];
  endpoint: string;
  healthCheckUrl: string;
  metadata?: Record<string, any>;
}

export class LogAgentClient {
  private client: AxiosInstance;

  constructor(config: LogAgentConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async registerAgent(registration: AgentRegistration): Promise<any> {
    try {
      const response = await this.client.post(
        "/api/v1/agents/register",
        registration
      );
      logger.info(`✅ Agent registered: ${registration.agentId}`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error registering agent`);
      throw error;
    }
  }

  async updateStatus(
    agentId: string,
    status: string,
    metrics: Record<string, any>
  ): Promise<any> {
    try {
      const response = await this.client.put(
        `/api/v1/agents/${agentId}/status`,
        {
          status,
          metrics,
        }
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error updating status: ${error.message}`);
      throw error;
    }
  }

  async sendEvent(
    agentId: string,
    eventType: string,
    data: Record<string, any>
  ): Promise<any> {
    try {
      const response = await this.client.post("/api/v1/events", {
        agentId,
        eventType,
        data,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error: any) {
      logger.error(`Error sending event: ${error.message}`);
      throw error;
    }
  }

  async getAgentInfo(agentId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/v1/agents/${agentId}`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting agent info: ${error.message}`);
      throw error;
    }
  }

  async listAgents(limit: number = 50, offset: number = 0): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/v1/agents?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error listing agents: ${error.message}`);
      throw error;
    }
  }

  async updateAgent(
    agentId: string,
    updates: {
      agentName?: string;
      capabilities?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<any> {
    try {
      const response = await this.client.put(
        `/api/v1/agents/${agentId}`,
        updates
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error updating agent: ${error.message}`);
      throw error;
    }
  }

  async deregisterAgent(agentId: string): Promise<any> {
    try {
      const response = await this.client.delete(`/api/v1/agents/${agentId}`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error deregistering agent: ${error.message}`);
      throw error;
    }
  }

  async getAgentLogs(
    agentId: string,
    limit: number = 50,
    offset: number = 0,
    eventType?: string,
    severity?: string
  ): Promise<any> {
    try {
      let url = `/api/v1/agents/${agentId}/logs?limit=${limit}&offset=${offset}`;
      if (eventType) url += `&event_type=${eventType}`;
      if (severity) url += `&severity=${severity}`;

      const response = await this.client.get(url);
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting agent logs: ${error.message}`);
      throw error;
    }
  }

  async getAgentLogSummary(agentId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/v1/agents/${agentId}/logs/summary`
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting log summary: ${error.message}`);
      throw error;
    }
  }

  async getAgentLogsByRange(
    agentId: string,
    startDate: string,
    endDate: string,
    limit: number = 100,
    offset: number = 0,
    eventType?: string,
    severity?: string
  ): Promise<any> {
    try {
      let url = `/api/v1/agents/${agentId}/logs/range?start_date=${startDate}&end_date=${endDate}&limit=${limit}&offset=${offset}`;
      if (eventType) url += `&event_type=${eventType}`;
      if (severity) url += `&severity=${severity}`;

      const response = await this.client.get(url);
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting logs by range: ${error.message}`);
      throw error;
    }
  }

  async sendA2AMessage(message: {
    agentId: string;
    targetAgent: string;
    action: string;
    payload: Record<string, any>;
    priority?: string;
  }): Promise<any> {
    try {
      const response = await this.client.post("/api/v1/a2a/send", message);
      return response.data;
    } catch (error: any) {
      logger.error(`Error sending A2A message: ${error.message}`);
      throw error;
    }
  }

  async getDashboardOverview(): Promise<any> {
    try {
      const response = await this.client.get("/api/dashboard/overview");
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting dashboard overview: ${error.message}`);
      throw error;
    }
  }

  async getDashboardAgents(): Promise<any> {
    try {
      const response = await this.client.get("/api/dashboard/agents");
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting dashboard agents: ${error.message}`);
      throw error;
    }
  }

  async getDashboardEvents(limit: number = 50): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/dashboard/events?limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting dashboard events: ${error.message}`);
      throw error;
    }
  }

  async getDashboardMetrics(days: number = 0): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/dashboard/business-metrics?days=${days}`
      );
      return response.data;
    } catch (error: any) {
      logger.error(`Error getting dashboard metrics: ${error.message}`);
      throw error;
    }
  }
}
