/**
 * Customer Experience Orchestrator Agent
 *
 * Monitors customer journey in real-time, detects friction points,
 * and autonomously decides interventions to improve experience.
 *
 * Use Case #5 from HACKATHON_30_USE_CASES.md
 * Platform: VTEX
 */

import dotenv from "dotenv";
import { BaseAgent } from "./Agent";
import { MessageAction, A2AMessage, MessagePriority } from "./A2AProtocol";
import { VTEXClient, LogAgentClient } from "./tools";
import { logger } from "./utils";

dotenv.config();

interface CustomerSession {
  sessionId: string;
  orderFormId?: string;
  email?: string;
  cartValue: number;
  itemsCount: number;
  lastActivity: Date;
  createdAt: Date;
  status: "browsing" | "cart" | "checkout" | "completed" | "abandoned";
  interventions: Intervention[];
}

interface Intervention {
  type: "discount" | "free_shipping" | "chat_offer" | "reminder";
  timestamp: Date;
  success: boolean;
  details: Record<string, any>;
}

interface CustomerProfile {
  email: string;
  isFirstTime: boolean;
  totalOrders: number;
  lastOrderDate: string | null;
  averageOrderValue?: number;
}

class CustomerExperienceOrchestratorAgent extends BaseAgent {
  private vtex: VTEXClient;
  private logagent: LogAgentClient;
  private activeSessions: Map<string, CustomerSession> = new Map();

  // Configuration thresholds
  private readonly CART_ABANDONMENT_TIME_MS = 10 * 60 * 1000; // 10 minutes
  private readonly HIGH_VALUE_THRESHOLD = 50000; // ₹50,000
  private readonly CHECKOUT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
  // Note: BaseAgent runs backgroundTask every 30 seconds by default
  // This constant is kept for documentation/reference purposes
  private readonly _MONITORING_INTERVAL_MS = 30000; // 30 seconds

  constructor() {
    super({
      agentId: process.env.AGENT_ID || "customer_experience_orchestrator_agent",
      agentName:
        process.env.AGENT_NAME || "Customer Experience Orchestrator Agent",
      agentType: process.env.AGENT_TYPE || "customer_experience",
      version: process.env.AGENT_VERSION || "1.0.0",
      description:
        "Monitors customer journey in real-time, detects friction points, and autonomously decides interventions to improve experience",
      capabilities: [
        "monitor_customer_journey",
        "detect_friction_points",
        "decide_intervention",
        "personalize_approach",
        "coordinate_outreach",
        "measure_impact",
      ],
      host: process.env.HOST || "0.0.0.0",
      port: parseInt(process.env.PORT || "8080"),
      logLevel: process.env.LOG_LEVEL || "info",
    });

    // Initialize VTEX client
    this.vtex = new VTEXClient({
      storeUrl: process.env.VTEX_STORE_URL || "",
      appKey: process.env.VTEX_APP_KEY || "",
      appToken: process.env.VTEX_APP_TOKEN || "",
    });

    // Initialize LogAgent client
    this.logagent = new LogAgentClient({
      baseUrl: process.env.LOGAGENT_URL || "http://192.168.15.48:8000",
      apiKey: process.env.LOGAGENT_API_KEY || "logixal-agent-api-key-2024",
    });

    // Register message handlers
    this.registerHandler(MessageAction.REQUEST, this.handleRequest.bind(this));
    this.registerHandler(
      MessageAction.NOTIFY,
      this.handleNotification.bind(this)
    );
  }

  async onStart(): Promise<void> {
    logger.info(`🚀 ${this.config.agentName} is starting...`);

    // Register with LogAgent
    try {
      await this.registerWithLogAgent();
      await this.sendEvent(
        "STARTUP",
        "Customer Experience Orchestrator Agent started successfully",
        "info"
      );
      logger.info("✅ Registered with LogAgent");
    } catch (error: any) {
      logger.error(`❌ Failed to register with LogAgent: ${error.message}`);
      await this.sendEvent(
        "ERROR",
        `Failed to register with LogAgent: ${error.message}`,
        "error"
      );
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
        author: process.env.AGENT_AUTHOR || "Logixal Hackathon Participant",
        platform: "VTEX",
        useCase: "Customer Experience Orchestrator",
      },
    });
  }

  /**
   * Handle incoming REQUEST messages
   */
  private async handleRequest(message: A2AMessage): Promise<any> {
    const { capability, params } = message.data;

    logger.info(`🔧 Processing request for capability: ${capability}`);

    try {
      switch (capability) {
        case "monitor_customer_journey":
          return await this.monitorCustomerJourney(params);
        case "detect_friction_points":
          return await this.detectFrictionPoints(params);
        case "decide_intervention":
          return await this.decideIntervention(params);
        case "personalize_approach":
          return await this.personalizeApproach(params);
        case "coordinate_outreach":
          return await this.coordinateOutreach(params);
        case "measure_impact":
          return await this.measureImpact(params);
        default:
          return { success: false, error: `Unknown capability: ${capability}` };
      }
    } catch (error: any) {
      logger.error(`Error handling capability ${capability}: ${error.message}`);
      await this.sendEvent(
        "ERROR",
        `Error in ${capability}: ${error.message}`,
        "error"
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Capability 1: Monitor customer journey
   * Track browsing, cart, checkout behavior
   */
  private async monitorCustomerJourney(params: any): Promise<any> {
    const { sessionId, orderFormId, email } = params;

    if (!sessionId) {
      return { success: false, error: "sessionId required" };
    }

    try {
      let session = this.activeSessions.get(sessionId);

      if (!session) {
        // Create new session
        session = {
          sessionId,
          orderFormId,
          email,
          cartValue: 0,
          itemsCount: 0,
          lastActivity: new Date(),
          createdAt: new Date(),
          status: "browsing",
          interventions: [],
        };
        this.activeSessions.set(sessionId, session);
        await this.sendEvent(
          "INFO",
          `New customer session started: ${sessionId}`,
          "info",
          { sessionId }
        );
      } else {
        // Update existing session
        session.lastActivity = new Date();
        if (orderFormId) session.orderFormId = orderFormId;
        if (email) session.email = email;
      }

      // Get order form details if available
      if (session.orderFormId) {
        try {
          const orderForm = await this.vtex.getOrderForm(session.orderFormId);
          session.cartValue = orderForm.value || 0;
          session.itemsCount = orderForm.items?.length || 0;

          // Update status based on order form
          if (orderForm.items && orderForm.items.length > 0) {
            session.status = "cart";
          }
          if (orderForm.paymentData) {
            session.status = "checkout";
          }
        } catch (error: any) {
          logger.warn(`Could not fetch order form: ${error.message}`);
        }
      }

      await this.sendEvent(
        "INFO",
        `Customer journey monitored: ${sessionId}`,
        "info",
        {
          sessionId,
          status: session.status,
          cartValue: session.cartValue,
          itemsCount: session.itemsCount,
        }
      );

      return {
        success: true,
        session: {
          sessionId: session.sessionId,
          status: session.status,
          cartValue: session.cartValue,
          itemsCount: session.itemsCount,
          lastActivity: session.lastActivity.toISOString(),
        },
      };
    } catch (error: any) {
      logger.error(`Error monitoring customer journey: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Capability 2: Detect friction points
   * Identify issues (slow checkout, cart abandonment)
   */
  private async detectFrictionPoints(params: any): Promise<any> {
    const { sessionId } = params;

    if (!sessionId) {
      return { success: false, error: "sessionId required" };
    }

    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const frictionPoints: string[] = [];
    const now = new Date();
    const timeSinceLastActivity =
      now.getTime() - session.lastActivity.getTime();
    const timeSinceCreated = now.getTime() - session.createdAt.getTime();

    // Detect cart abandonment
    if (
      session.status === "cart" &&
      timeSinceLastActivity > this.CART_ABANDONMENT_TIME_MS
    ) {
      frictionPoints.push("cart_abandonment");
      await this.sendEvent(
        "WARNING",
        `Cart abandonment detected: ${sessionId}`,
        "warning",
        {
          sessionId,
          timeInCart: timeSinceLastActivity,
        }
      );
    }

    // Detect slow checkout
    if (
      session.status === "checkout" &&
      timeSinceLastActivity > this.CHECKOUT_TIMEOUT_MS
    ) {
      frictionPoints.push("slow_checkout");
      await this.sendEvent(
        "WARNING",
        `Slow checkout detected: ${sessionId}`,
        "warning",
        {
          sessionId,
          timeInCheckout: timeSinceLastActivity,
        }
      );
    }

    // Detect high-value cart without checkout
    if (
      session.cartValue > this.HIGH_VALUE_THRESHOLD &&
      session.status !== "checkout" &&
      session.status !== "completed"
    ) {
      frictionPoints.push("high_value_cart_not_checking_out");
      await this.sendEvent(
        "INFO",
        `High-value cart detected: ${sessionId}`,
        "info",
        {
          sessionId,
          cartValue: session.cartValue,
        }
      );
    }

    return {
      success: true,
      frictionPoints,
      sessionId,
      details: {
        status: session.status,
        cartValue: session.cartValue,
        timeSinceLastActivity: timeSinceLastActivity,
        timeSinceCreated: timeSinceCreated,
      },
    };
  }

  /**
   * Capability 3: Decide intervention
   * Choose action: discount, help offer, chat
   */
  private async decideIntervention(params: any): Promise<any> {
    const { sessionId } = params;

    if (!sessionId) {
      return { success: false, error: "sessionId required" };
    }

    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    // First detect friction points
    const frictionResult = await this.detectFrictionPoints({ sessionId });
    const frictionPoints = frictionResult.frictionPoints || [];

    if (frictionPoints.length === 0) {
      return {
        success: true,
        intervention: null,
        message: "No friction points detected, no intervention needed",
      };
    }

    // Get customer profile for personalization
    let customerProfile: CustomerProfile | null = null;
    if (session.email) {
      try {
        customerProfile = await this.vtex.getCustomerProfile(session.email);
      } catch (error: any) {
        logger.warn(`Could not fetch customer profile: ${error.message}`);
      }
    }

    // Decision logic
    let intervention: { type: string; details: Record<string, any> } | null =
      null;

    if (frictionPoints.includes("cart_abandonment")) {
      if (customerProfile?.isFirstTime) {
        // First-time customer: Offer discount + free shipping
        intervention = {
          type: "discount_and_free_shipping",
          details: {
            discountPercent: 10,
            freeShipping: true,
            message: "Welcome! Get 10% off + free shipping on your first order",
          },
        };
      } else if (session.cartValue > this.HIGH_VALUE_THRESHOLD) {
        // High-value cart: Priority customer service
        intervention = {
          type: "priority_customer_service",
          details: {
            message:
              "We noticed you have a high-value cart. Need help? Our team is ready to assist!",
          },
        };
      } else {
        // Returning customer: Chat offer
        intervention = {
          type: "chat_offer",
          details: {
            message: "Need help completing your purchase? Chat with us!",
          },
        };
      }
    } else if (frictionPoints.includes("slow_checkout")) {
      intervention = {
        type: "checkout_assistance",
        details: {
          message: "Having trouble at checkout? We can help!",
        },
      };
    } else if (frictionPoints.includes("high_value_cart_not_checking_out")) {
      intervention = {
        type: "high_value_offer",
        details: {
          discountPercent: 5,
          message: "Complete your purchase and save 5%!",
        },
      };
    }

    if (intervention) {
      // Record intervention
      session.interventions.push({
        type: intervention.type as any,
        timestamp: new Date(),
        success: false, // Will be updated later
        details: intervention.details,
      });

      await this.sendEvent(
        "INFO",
        `Intervention decided: ${intervention.type}`,
        "info",
        {
          sessionId,
          intervention: intervention.type,
          frictionPoints,
        }
      );
    }

    return {
      success: true,
      intervention,
      sessionId,
      frictionPoints,
      customerProfile: customerProfile
        ? {
            isFirstTime: customerProfile.isFirstTime,
            totalOrders: customerProfile.totalOrders,
          }
        : null,
    };
  }

  /**
   * Capability 4: Personalize approach
   * Adapt based on customer history
   */
  private async personalizeApproach(params: any): Promise<any> {
    const { sessionId, email } = params;

    if (!sessionId && !email) {
      return { success: false, error: "sessionId or email required" };
    }

    try {
      let customerProfile: CustomerProfile | null = null;

      if (email) {
        customerProfile = await this.vtex.getCustomerProfile(email);
      } else if (sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (session?.email) {
          customerProfile = await this.vtex.getCustomerProfile(session.email);
        }
      }

      if (!customerProfile) {
        return {
          success: true,
          personalized: false,
          message: "No customer profile found, using default approach",
        };
      }

      const personalization = {
        isFirstTime: customerProfile.isFirstTime,
        totalOrders: customerProfile.totalOrders,
        recommendedIntervention: customerProfile.isFirstTime
          ? "discount_and_free_shipping"
          : "chat_offer",
        message: customerProfile.isFirstTime
          ? "Welcome! We have a special offer for first-time customers."
          : "Thank you for being a valued customer!",
      };

      await this.sendEvent(
        "INFO",
        `Personalized approach for customer`,
        "info",
        {
          email: customerProfile.email,
          personalization,
        }
      );

      return {
        success: true,
        personalized: true,
        customerProfile,
        personalization,
      };
    } catch (error: any) {
      logger.error(`Error personalizing approach: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Capability 5: Coordinate outreach
   * Work with notification/chat agents
   */
  private async coordinateOutreach(params: any): Promise<any> {
    const { sessionId, intervention } = params;

    if (!sessionId) {
      return { success: false, error: "sessionId required" };
    }

    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    if (!session.email) {
      return {
        success: false,
        error: "Customer email not available for outreach",
      };
    }

    try {
      const interventionData =
        intervention || session.interventions[session.interventions.length - 1];

      if (!interventionData) {
        return { success: false, error: "No intervention data available" };
      }

      let outreachResult: any = {};

      // Send notification via A2A Bridge
      if (
        interventionData.type === "discount_and_free_shipping" ||
        interventionData.type === "high_value_offer"
      ) {
        // Send email notification
        const emailSubject =
          interventionData.details.message || "Special Offer for You!";
        const emailBody = `
          Hi there!
          
          ${interventionData.details.message || "We noticed you have items in your cart."}
          
          ${interventionData.details.discountPercent ? `Use code SAVE${interventionData.details.discountPercent} for ${interventionData.details.discountPercent}% off!` : ""}
          ${interventionData.details.freeShipping ? "Plus, enjoy FREE shipping on this order!" : ""}
          
          Complete your purchase now!
        `;

        await this.sendA2AMessage(
          "notification_agent",
          "send_email",
          {
            user_email: session.email,
            subject: emailSubject,
            body: emailBody,
            user_id: session.sessionId,
            sku_id: "N/A",
          },
          MessagePriority.HIGH
        );

        outreachResult.emailSent = true;
        await this.sendEvent(
          "INFO",
          `Email sent to customer: ${session.email}`,
          "info",
          {
            sessionId,
            intervention: interventionData.type,
          }
        );
      }

      if (
        interventionData.type === "chat_offer" ||
        interventionData.type === "priority_customer_service"
      ) {
        // Offer chat assistance
        await this.sendA2AMessage(
          "chat_agent",
          "offer_assistance",
          {
            user_email: session.email,
            session_id: sessionId,
            message: interventionData.details.message || "We're here to help!",
            priority:
              session.cartValue > this.HIGH_VALUE_THRESHOLD
                ? MessagePriority.HIGH
                : MessagePriority.NORMAL,
          },
          MessagePriority.HIGH
        );

        outreachResult.chatOffered = true;
        await this.sendEvent(
          "INFO",
          `Chat assistance offered to customer: ${session.email}`,
          "info",
          {
            sessionId,
            intervention: interventionData.type,
          }
        );
      }

      return {
        success: true,
        sessionId,
        outreach: outreachResult,
        intervention: interventionData.type,
      };
    } catch (error: any) {
      logger.error(`Error coordinating outreach: ${error.message}`);
      await this.sendEvent(
        "ERROR",
        `Failed to coordinate outreach: ${error.message}`,
        "error"
      );
      return { success: false, error: error.message };
    }
  }

  /**
   * Capability 6: Measure impact
   * Track if intervention worked
   */
  private async measureImpact(params: any): Promise<any> {
    const { sessionId } = params;

    if (!sessionId) {
      // Measure overall impact
      return this.measureOverallImpact();
    }

    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const now = new Date();
    const timeSinceLastIntervention =
      session.interventions.length > 0
        ? now.getTime() -
          session.interventions[
            session.interventions.length - 1
          ].timestamp.getTime()
        : null;

    // Check if customer completed purchase (simplified - in production, check order status)
    const completed = session.status === "completed";
    const converted = completed && session.interventions.length > 0;

    // Update intervention success status
    if (converted && session.interventions.length > 0) {
      session.interventions[session.interventions.length - 1].success = true;
    }

    const impact = {
      sessionId,
      interventionsCount: session.interventions.length,
      converted,
      completed,
      timeSinceLastIntervention: timeSinceLastIntervention
        ? Math.floor(timeSinceLastIntervention / 1000)
        : null,
      finalStatus: session.status,
      cartValue: session.cartValue,
    };

    await this.sendEvent(
      "INFO",
      `Impact measured for session: ${sessionId}`,
      "info",
      impact
    );

    return {
      success: true,
      impact,
    };
  }

  private async measureOverallImpact(): Promise<any> {
    let totalSessions = this.activeSessions.size;
    let sessionsWithInterventions = 0;
    let convertedSessions = 0;
    let totalInterventions = 0;

    for (const session of this.activeSessions.values()) {
      if (session.interventions.length > 0) {
        sessionsWithInterventions++;
        totalInterventions += session.interventions.length;
      }
      if (session.status === "completed" && session.interventions.length > 0) {
        convertedSessions++;
      }
    }

    const conversionRate =
      sessionsWithInterventions > 0
        ? (convertedSessions / sessionsWithInterventions) * 100
        : 0;

    return {
      success: true,
      overallImpact: {
        totalSessions,
        sessionsWithInterventions,
        convertedSessions,
        totalInterventions,
        conversionRate: conversionRate.toFixed(2) + "%",
        averageInterventionsPerSession:
          sessionsWithInterventions > 0
            ? (totalInterventions / sessionsWithInterventions).toFixed(2)
            : "0",
      },
    };
  }

  /**
   * Handle incoming NOTIFY messages
   */
  private async handleNotification(message: A2AMessage): Promise<void> {
    const notificationType = message.data.type;
    logger.info(`📬 Received notification: ${notificationType}`);

    // Handle different notification types
    if (notificationType === "order_completed") {
      const { sessionId } = message.data;
      if (sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (session) {
          session.status = "completed";
          await this.measureImpact({ sessionId });
        }
      }
    }
  }

  /**
   * Background task: Monitor active sessions and detect friction points
   * Runs every ${this._MONITORING_INTERVAL_MS / 1000} seconds (via BaseAgent)
   */
  async backgroundTask(): Promise<void> {
    try {
      // Send heartbeat
      const health = this.getHealth();
      await this.logagent.updateStatus(this.agentId, health.status, {
        uptimeSeconds: health.uptimeSeconds,
        messagesProcessed: health.totalMessagesProcessed,
        messagesSent: health.totalMessagesSent,
        errorCount: health.errorCount,
        activeSessions: this.activeSessions.size,
      });

      // Monitor active sessions
      const now = new Date();
      const sessionsToCheck: string[] = [];

      for (const [sessionId, session] of this.activeSessions.entries()) {
        // Remove old abandoned sessions (older than 1 hour)
        const age = now.getTime() - session.createdAt.getTime();
        if (age > 60 * 60 * 1000 && session.status !== "completed") {
          session.status = "abandoned";
          this.activeSessions.delete(sessionId);
          continue;
        }

        // Check for friction points
        const timeSinceLastActivity =
          now.getTime() - session.lastActivity.getTime();
        if (
          timeSinceLastActivity > this.CART_ABANDONMENT_TIME_MS &&
          session.status === "cart"
        ) {
          sessionsToCheck.push(sessionId);
        }
      }

      // Process sessions with friction points
      for (const sessionId of sessionsToCheck) {
        try {
          // Detect friction points
          const frictionResult = await this.detectFrictionPoints({ sessionId });

          if (
            frictionResult.frictionPoints &&
            frictionResult.frictionPoints.length > 0
          ) {
            // Decide intervention
            const interventionResult = await this.decideIntervention({
              sessionId,
            });

            if (interventionResult.intervention) {
              // Coordinate outreach
              await this.coordinateOutreach({
                sessionId,
                intervention: interventionResult.intervention,
              });
            }
          }
        } catch (error: any) {
          logger.error(
            `Error processing session ${sessionId}: ${error.message}`
          );
        }
      }

      if (sessionsToCheck.length > 0) {
        logger.info(
          `🔍 Monitored ${this.activeSessions.size} active sessions, processed ${sessionsToCheck.length} with friction points`
        );
      }
    } catch (error: any) {
      logger.error(`Error in background task: ${error.message}`);
    }
  }

  /**
   * Helper: Send event to LogAgent
   */
  async sendEvent(
    eventType: string,
    message: string,
    severity: "info" | "warning" | "error" = "info",
    metadata?: any
  ): Promise<void> {
    try {
      await this.logagent.sendEvent(this.agentId, eventType, {
        message,
        severity,
        ...metadata,
      });
    } catch (error: any) {
      logger.error(`Failed to send event: ${error.message}`);
    }
  }

  /**
   * Helper: Send A2A message via bridge
   */
  async sendA2AMessage(
    targetAgent: string,
    action: string,
    payload: any,
    priority: MessagePriority = MessagePriority.NORMAL
  ): Promise<void> {
    try {
      await this.logagent.sendA2AMessage({
        agentId: this.agentId,
        targetAgent,
        action,
        payload,
        priority,
      });
      logger.info(`📨 A2A message sent to ${targetAgent}: ${action}`);
    } catch (error: any) {
      logger.error(`Failed to send A2A message: ${error.message}`);
      throw error;
    }
  }
}

export { CustomerExperienceOrchestratorAgent };
