/**
 * Main Entry Point - LRA Agent for HR (TEST VERSION - NO DATABASE)
 * Sends email notifications with hardcoded test data
 */

import dotenv from 'dotenv';
import { BaseAgent } from './Agent';
import { MessageAction, A2AMessage } from './A2AProtocol';
import { LogAgentClient } from './tools';
import { logger } from './utils';

// Load environment variables
dotenv.config();

class LRAAgent extends BaseAgent {
  private logagent: LogAgentClient;

  constructor() {
    super({
      agentId: process.env.AGENT_ID || 'lra_hr_agent',
      agentName: process.env.AGENT_NAME || 'LRA HR Agent',
      agentType: process.env.AGENT_TYPE || 'hr',
      version: process.env.AGENT_VERSION || '1.0.0',
      description: 'HR Agent for monitoring employee LRA expiry and sending notifications',
      capabilities: ['LRAEXPIRY', 'check_lra_status', 'send_lra_notifications'],
      host: process.env.HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '12000'),
      logLevel: process.env.LOG_LEVEL || 'info',
    });

    logger.info(`🚀 Initializing LogAgentClient (TEST MODE - NO DATABASE)`);
    
    // Initialize LogAgent client
    this.logagent = new LogAgentClient({
      baseUrl: process.env.LOGAGENT_URL || 'http://192.168.15.48:8000',
      apiKey: process.env.LOGAGENT_API_KEY || 'logixal-agent-api-key-2024',
    });

    // Register message handlers
    logger.info(`🚀 Registering message handlers with capabilities:`, this.config?.capabilities);
    this.registerHandler(MessageAction.REQUEST, this.handleRequest.bind(this));
    this.registerHandler(MessageAction.NOTIFY, this.handleNotification.bind(this));
  }

  async onStart(): Promise<void> {
    logger.info(`🚀 ${this.config.agentName} is starting... (TEST MODE)`);

    // Register with LogAgent
    try {
      await this.registerWithLogAgent();
      logger.info('✅ Registered with LogAgent successfully');
      
      // Send startup event
      await this.logagent.sendEvent(
        this.agentId,
        'STARTUP',
        {
          message: `${this.config.agentName} started successfully (TEST MODE - NO DATABASE)`,
          status: 'initialized',
          capabilities: this.config.capabilities,
          testMode: true
        }
      );
    } catch (error: any) {
      logger.error(`❌ Failed to register with LogAgent: ${error.message}`);
      throw error;
    }
  }

  private async registerWithLogAgent(): Promise<void> {
    const logresult: any = await this.logagent.registerAgent({
      agentId: this.agentId,
      agentName: this.config.agentName || '',
      agentType: this.config.agentType || '',
      version: this.config.version!,
      capabilities: this.config.capabilities!,
      endpoint: `http://${this.config.host}:${this.config.port}`,
      healthCheckUrl: `http://${this.config.host}:${this.config.port}/health`,
      metadata: {
        description: this.config.description,
        author: 'Sachin',
        platform: 'Node.js',
        runtime: 'Node.js 18+',
        team: 'HR Team',
        testMode: true
      },
    });
    logger.info('✅ Registration response:', logresult);
  }

  /**
   * Handle incoming REQUEST messages
   */
  private handleRequest = async (message: A2AMessage): Promise<any> => {
    logger.info(`🔧 Processing request: ${message.action}`, message.data);
    
    const { capability, params } = message.data;

    try {
      // Implement your capabilities here
      if (capability === 'LRAEXPIRY' || capability === 'check_lra_status') {
        logger.info(`🔧 Processing LRA expiry check (TEST MODE)`);
        const result = await this.doEmpExpiry(params);
        
        // Send event to dashboard
        await this.logagent.sendEvent(
          this.agentId,
          'INFO',
          {
            message: `LRA expiry check completed (TEST MODE)`,
            action: 'lra_check',
            result: result.success ? 'success' : 'failed',
            testMode: true
          }
        );
        
        return { success: true, result };
      } else if (capability === 'send_lra_notifications') {
        // Send test notifications
        const result = await this.sendTestNotifications();
        return { success: true, result };
      } else {
        logger.warn(`⚠️ Unknown capability requested: ${capability}`);
        return { success: false, error: `Unknown capability: ${capability}` };
      }
    } catch (error: any) {
      logger.error(`❌ Error handling request: ${error.message}`, error);
      
      // Send error event to dashboard
      await this.logagent.sendEvent(
        this.agentId,
        'ERROR',
        {
          message: `Error processing request for capability ${capability}`,
          error: error.message,
          params
        }
      );
      
      return { success: false, error: error.message };
    }
  };

  /**
   * Handle incoming NOTIFY messages
   */
  private async handleNotification(message: A2AMessage): Promise<any> {
    const notificationType = message.data.type;
    logger.info(`📬 Received notification: ${notificationType}`);
    return null;
  }

  /**
   * Check LRA expiry - TEST VERSION with hardcoded data
   */
  private async doEmpExpiry(params: any): Promise<any> {
    try {
      const empcode = params.empcode || params.employeeCode || '50068';
      
      logger.info(`📬 Checking LRA expiry for employee: ${empcode} (TEST MODE - HARDCODED DATA)`);
      
      // HARDCODED TEST DATA - Replace with your actual test data
      const testUsers = [
        {
          empcode: '50068',
          empname: 'John Doe',
          empemail: 'arvind.hariharan@logixal.com', // Your test email
          designationname: 'Senior Developer',
          ismanager: 'N',
          reportingmanager: 'MANAGER-001',
          allocationenddate: '2025-12-25', // 29 days from now (adjust as needed)
          allocationstartdate: '2025-01-01',
          projectcode: 'PROJ-LRA-001',
          projectgroupcode: 'GROUP-HR'
        },
        {
          empcode: '50068',
          empname: 'John Doe',
          empemail: 'arvind.hariharan@logixal.com',
          designationname: 'Senior Developer',
          ismanager: 'N',
          reportingmanager: 'MANAGER-001',
          allocationenddate: '2025-12-15', // 19 days from now
          allocationstartdate: '2025-01-01',
          projectcode: 'PROJ-LRA-002',
          projectgroupcode: 'GROUP-HR'
        }
      ];

      // Filter by empcode if provided
      const users = testUsers.filter(u => u.empcode === empcode);

      logger.info(`✅ Found ${users.length} test allocation records for ${empcode}`);

      // Send email notification for each allocation
      const notificationsSent: any[] = [];
      if (users.length > 0) {
        for (const user of users) {
          // Calculate days until expiry
          const endDate = new Date(user.allocationenddate);
          const daysUntilExpiry = Math.ceil(
            (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          logger.info(`⚠️ TEST: Allocation expiring in ${daysUntilExpiry} days for ${user.empname} - ${user.projectcode}`);
          
          // Send A2A email notification
          await this.sendA2AEmail({
            user_email: user.empemail,
            subject: `⚠️ [TEST] LRA Expiry Alert - Project ${user.projectcode}`,
            body: `[THIS IS A TEST EMAIL]\n\nDear ${user.empname},\n\nYour allocation to project ${user.projectcode} is expiring in ${daysUntilExpiry} days (${endDate.toLocaleDateString()}).\n\nProject: ${user.projectcode}\nProject Group: ${user.projectgroupcode}\nExpiry Date: ${endDate.toLocaleDateString()}\nDesignation: ${user.designationname}\n\nPlease contact your manager (${user.reportingmanager}) for renewal if needed.\n\n---\nThis is a TEST notification from the LRA HR Agent.\n\nBest regards,\nHR Team (Test Mode)`,
            user_id: user.empcode,
            metadata: {
              empcode: user.empcode,
              empname: user.empname,
              projectcode: user.projectcode,
              projectgroupcode: user.projectgroupcode,
              allocationenddate: user.allocationenddate,
              daysUntilExpiry,
              notificationType: 'lra_expiry_warning',
              testMode: true
            }
          });
          
          notificationsSent.push({
            empcode: user.empcode,
            empname: user.empname,
            projectcode: user.projectcode,
            daysUntilExpiry,
            emailSent: user.empemail
          });
        }
      }

      return { 
        success: true,
        message: 'TEST: Employee LRA data retrieved and notifications sent', 
        data: users,
        count: users.length,
        notificationsSent: notificationsSent.length,
        notifications: notificationsSent,
        testMode: true
      };
    } catch (error: any) {
      logger.error(`❌ Error in doEmpExpiry: ${error.message}`, error);
      return { 
        success: false, 
        error: error.message,
        count: 0
      };
    }
  }

  /**
   * Send test notifications for multiple employees
   */
  private async sendTestNotifications(): Promise<any> {
    try {
      logger.info(`📬 Sending test notifications for multiple employees (TEST MODE)`);
      
      // HARDCODED TEST DATA for multiple employees
      const testAllocations = [
        {
          empcode: '50068',
          empname: 'John Doe',
          empemail: 'arvind.hariharan@logixal.com',
          projectcode: 'PROJ-001',
          projectgroupcode: 'GROUP-A',
          allocationenddate: '2025-12-25',
          reportingmanager: 'MANAGER-001'
        },
        {
          empcode: '50069',
          empname: 'Jane Smith',
          empemail: 'arvind.hariharan@logixal.com', // Same email for testing
          projectcode: 'PROJ-002',
          projectgroupcode: 'GROUP-B',
          allocationenddate: '2025-12-20',
          reportingmanager: 'MANAGER-002'
        }
      ];

      logger.info(`✅ Found ${testAllocations.length} test expiring allocations`);

      // Send notifications for each allocation
      const notificationsSent: any[] = [];
      for (const user of testAllocations) {
        const endDate = new Date(user.allocationenddate);
        const daysUntilExpiry = Math.ceil(
          (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        await this.sendA2AEmail({
          user_email: user.empemail,
          subject: `⚠️ [TEST] LRA Expiry Alert - Project ${user.projectcode}`,
          body: `[THIS IS A TEST EMAIL]\n\nDear ${user.empname},\n\nYour allocation to project ${user.projectcode} is expiring in ${daysUntilExpiry} days (${endDate.toLocaleDateString()}).\n\nProject: ${user.projectcode}\nProject Group: ${user.projectgroupcode}\nExpiry Date: ${endDate.toLocaleDateString()}\n\nPlease contact your manager (${user.reportingmanager}) for renewal if needed.\n\n---\nThis is a TEST notification from the LRA HR Agent.\n\nBest regards,\nHR Team (Test Mode)`,
          user_id: user.empcode,
          metadata: {
            empcode: user.empcode,
            empname: user.empname,
            projectcode: user.projectcode,
            daysUntilExpiry,
            testMode: true
          }
        });
        
        notificationsSent.push({
          empcode: user.empcode,
          empname: user.empname,
          projectcode: user.projectcode,
          daysUntilExpiry,
          emailSent: user.empemail
        });
      }

      return {
        success: true,
        message: 'TEST: All expiring LRAs checked and notifications sent',
        totalAllocations: testAllocations.length,
        notificationsSent: notificationsSent.length,
        notifications: notificationsSent,
        testMode: true
      };
    } catch (error: any) {
      logger.error(`❌ Error in sendTestNotifications: ${error.message}`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Helper method to send A2A emails via notification agent
   */
  private async sendA2AEmail(emailData: any): Promise<void> {
    try {
      // Use the A2A bridge endpoint directly
      const axios = require('axios');
      await axios.post(
        `${process.env.LOGAGENT_URL || 'http://192.168.15.48:8000'}/api/v1/a2a/send`,
        {
          agentId: this.agentId,
          targetAgent: 'notification_agent',
          action: 'send_email',
          payload: emailData,
          priority: 'high'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LOGAGENT_API_KEY || 'logixal-agent-api-key-2024'}`
          }
        }
      );
      logger.info(`📧 TEST: Email notification sent to ${emailData.user_email}`);
    } catch (error: any) {
      logger.error(`❌ Failed to send email to ${emailData.user_email}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Background task that runs continuously
   */
  async backgroundTask(): Promise<void> {
    try {
      // Send heartbeat to LogAgent
      const health = this.getHealth();
      await this.logagent.updateStatus(this.agentId, health.status, {
        uptimeSeconds: health.uptimeSeconds,
        messagesProcessed: health.totalMessagesProcessed,
        messagesSent: health.totalMessagesSent,
        errorCount: health.errorCount,
      });
    } catch (error: any) {
      logger.error(`❌ Error in background task: ${error.message}`);
    }
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('🤖 Logixal Agent AI - LRA HR Agent (TEST MODE)');
  console.log('='.repeat(60));
  console.log('⚠️  TEST MODE: Using hardcoded data, no database required');
  console.log('='.repeat(60));
  console.log();

  const agent = new LRAAgent();

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

export { LRAAgent };