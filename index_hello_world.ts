/**
 * Hello World Agent - Hackathon Demo (Node.js/TypeScript)
 * 
 * This is a simple example agent to demonstrate:
 * 1. How to create an agent
 * 2. How to register with LogAgent
 * 3. How to handle capabilities
 * 4. How to send events
 * 5. How to test with /message API
 */

import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const AGENT_ID = process.env.AGENT_ID || 'hello_world_agent';
const AGENT_NAME = process.env.AGENT_NAME || 'Hello World Agent';
const PORT = parseInt(process.env.PORT || '8080');
const LOG_AGENT_URL = process.env.LOG_AGENT_URL || 'http://192.168.15.48:8000';

// A2A Message Interface
interface A2AMessage {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    action: 'REQUEST' | 'NOTIFY' | 'QUERY';
    data: {
        capability: string;
        params: any;
    };
    priority: 'high' | 'normal' | 'low';
}

// Simple Logger
class Logger {
    info(message: string, ...args: any[]) {
        console.log(`[INFO] ${message}`, ...args);
    }
    
    error(message: string, ...args: any[]) {
        console.error(`[ERROR] ${message}`, ...args);
    }
}

const logger = new Logger();

// Hello World Agent Class
class HelloWorldAgent {
    private app: express.Application;
    private agentId: string;
    private agentName: string;
    private port: number;
    private logAgentUrl: string;

    constructor() {
        this.app = express();
        this.agentId = AGENT_ID;
        this.agentName = AGENT_NAME;
        this.port = PORT;
        this.logAgentUrl = LOG_AGENT_URL;

        // Middleware
        this.app.use(express.json());

        // Setup routes
        this.setupRoutes();
    }

    private setupRoutes() {
        // Health check
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ status: 'healthy', agent: this.agentId });
        });

        // Message endpoint (for A2A communication and testing)
        this.app.post('/message', async (req: Request, res: Response) => {
            try {
                const message: A2AMessage = req.body;
                logger.info(`📨 Received message:`, message);

                const capability = message.data.capability;
                const params = message.data.params;

                let result: any;

                // Handle different capabilities
                switch (capability) {
                    case 'greet':
                        result = this.greet(params);
                        break;
                    
                    case 'calculate':
                        result = this.calculate(params);
                        break;
                    
                    default:
                        throw new Error(`Unknown capability: ${capability}`);
                }

                // Send success event to LogAgent
                await this.sendEvent('INFO', `Capability '${capability}' executed successfully`);

                res.json({
                    success: true,
                    capability: capability,
                    result: result
                });

            } catch (error: any) {
                logger.error('❌ Error handling message:', error.message);
                
                // Send error event to LogAgent
                await this.sendEvent('ERROR', `Failed to execute capability: ${error.message}`);

                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
    }

    // Capability 1: Greet
    private greet(params: any): string {
        const name = params.name || 'World';
        const greeting = `Hello, ${name}! Welcome to the Agentic Commerce Hackathon! 🚀`;
        logger.info(`👋 ${greeting}`);
        return greeting;
    }

    // Capability 2: Calculate
    private calculate(params: any): number {
        const a = params.a || 0;
        const b = params.b || 0;
        const operation = params.operation || 'add';

        let result: number;

        switch (operation) {
            case 'add':
                result = a + b;
                break;
            case 'subtract':
                result = a - b;
                break;
            case 'multiply':
                result = a * b;
                break;
            case 'divide':
                result = b !== 0 ? a / b : 0;
                break;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }

        logger.info(`🔢 Calculate: ${a} ${operation} ${b} = ${result}`);
        return result;
    }

    // Register with LogAgent
    private async registerWithLogAgent() {
        try {
            const response = await axios.post(
                `${this.logAgentUrl}/api/v1/agents/register`,
                {
                    agentId: this.agentId,
                    agentName: this.agentName,
                    agentType: 'demo',
                    version: '1.0.0',
                    capabilities: ['greet', 'calculate'],
                    endpoint: `http://localhost:${this.port}`,
                    healthCheckUrl: `http://localhost:${this.port}/health`,
                    metadata: {
                        description: 'Hello World demo agent for hackathon',
                        author: 'Hackathon Participant',
                        platform: 'Node.js',
                        language: 'TypeScript'
                    }
                },
                {
                    headers: {
                        'Authorization': 'Bearer logixal-agent-api-key-2024',
                        'Content-Type': 'application/json'
                    }
                }
            );

            logger.info('✅ Registered with LogAgent:', response.data);
            
            // Send startup event
            await this.sendEvent('STARTUP', 'Hello World Agent started successfully');

        } catch (error: any) {
            if (error.response?.status === 409) {
                logger.info('ℹ️ Agent already registered, continuing...');
            } else {
                logger.error('❌ Failed to register with LogAgent:', error.message);
            }
        }
    }

    // Send event to LogAgent
    private async sendEvent(eventType: string, message: string) {
        try {
            await axios.post(
                `${this.logAgentUrl}/api/v1/events`,
                {
                    agentId: this.agentId,
                    eventType: eventType,
                    data: {
                        message: message,
                        timestamp: new Date().toISOString()
                    },
                    timestamp: new Date().toISOString()
                },
                {
                    headers: {
                        'Authorization': 'Bearer logixal-agent-api-key-2024',
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error: any) {
            logger.error('❌ Failed to send event:', error.message);
        }
    }

    // Start the agent
    public async start() {
        // Register with LogAgent
        await this.registerWithLogAgent();

        // Start HTTP server
        this.app.listen(this.port, () => {
            console.log('============================================================');
            console.log('🤖 Hello World Agent - Hackathon Demo');
            console.log('============================================================');
            console.log();
            console.log(`📋 Agent ID: ${this.agentId}`);
            console.log(`📋 Agent Name: ${this.agentName}`);
            console.log(`🔗 Listening on: http://localhost:${this.port}`);
            console.log();
            console.log('📋 Capabilities:');
            console.log('  • greet - Say hello to someone');
            console.log('  • calculate - Perform basic math operations');
            console.log();
            console.log('🔗 Test your agent:');
            console.log(`  curl -X POST 'http://localhost:${this.port}/message' \\`);
            console.log(`    -H 'Content-Type: application/json' \\`);
            console.log(`    -d '{`);
            console.log(`      "message_id": "test_001",`);
            console.log(`      "sender_id": "test_client",`);
            console.log(`      "receiver_id": "${this.agentId}",`);
            console.log(`      "action": "REQUEST",`);
            console.log(`      "data": {`);
            console.log(`        "capability": "greet",`);
            console.log(`        "params": {"name": "Hackathon Team"}`);
            console.log(`      },`);
            console.log(`      "priority": "normal"`);
            console.log(`    }'`);
            console.log();
            console.log('============================================================');
        });
    }
}

// Main execution
async function main() {
    const agent = new HelloWorldAgent();
    await agent.start();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Hello World Agent...');
    process.exit(0);
});

// Start the agent
main().catch((error) => {
    console.error('❌ Failed to start agent:', error);
    process.exit(1);
});

