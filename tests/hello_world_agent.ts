#!/usr/bin/env ts-node
/**
 * Hello World Agent - Reference Implementation (TypeScript/Node.js)
 * ==================================================================
 * 
 * This is a minimal but complete agent implementation that demonstrates:
 * 1. Agent registration with LogAgent
 * 2. Health check endpoint
 * 3. Periodic heartbeat/status updates
 * 4. Event logging
 * 5. Graceful shutdown
 * 
 * Use this as a starting point for building your own agents for the hackathon.
 * 
 * @author Logixal GenAI Team
 * @version 1.0.0
 */

import express, { Request, Response, Application } from 'express';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// CONFIGURATION
// ============================================================================

interface AgentConfig {
    agentId: string;
    agentName: string;
    agentType: string;
    agentVersion: string;
    agentHost: string;
    agentPort: number;
    logAgentUrl: string;
    logAgentApiKey: string;
    heartbeatInterval: number;
}

const config: AgentConfig = {
    agentId: process.env.AGENT_ID || 'hello_world_agent_ts',
    agentName: process.env.AGENT_NAME || 'Hello World Agent (TypeScript)',
    agentType: process.env.AGENT_TYPE || 'demo',
    agentVersion: process.env.AGENT_VERSION || '1.0.0',
    agentHost: process.env.AGENT_HOST || '0.0.0.0',
    agentPort: parseInt(process.env.AGENT_PORT || '9001'),
    logAgentUrl: process.env.LOGAGENT_URL || 'http://192.168.15.48:8000',
    logAgentApiKey: process.env.LOGAGENT_API_KEY || 'hackathon_key_2025',
    heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL || '30') * 1000, // Convert to milliseconds
};

// ============================================================================
// TYPES
// ============================================================================

interface AgentMetrics {
    startTime: number | null;
    requestsReceived: number;
    messagesSent: number;
    errors: number;
}

interface AgentRegistration {
    agentId: string;
    agentName: string;
    agentType: string;
    version: string;
    capabilities: string[];
    endpoint: string;
    healthCheckUrl: string;
    metadata: Record<string, any>;
}

interface StatusUpdate {
    status: string;
    metrics: {
        uptimeSeconds: number;
        messagesProcessed: number;
        messagesSent: number;
        errorCount: number;
    };
}

interface EventLog {
    agentId: string;
    eventType: string;
    data: Record<string, any>;
    timestamp: string;
}

// ============================================================================
// GLOBAL STATE
// ============================================================================

const app: Application = express();
app.use(express.json());

// Agent metrics
const metrics: AgentMetrics = {
    startTime: null,
    requestsReceived: 0,
    messagesSent: 0,
    errors: 0,
};

// Heartbeat interval reference
let heartbeatTimer: NodeJS.Timeout | null = null;

// ============================================================================
// LOGAGENT API INTEGRATION
// ============================================================================

/**
 * Get HTTP headers for LogAgent API calls
 */
function getHeaders(): Record<string, string> {
    return {
        'Authorization': `Bearer ${config.logAgentApiKey}`,
        'Content-Type': 'application/json',
    };
}

/**
 * Register this agent with LogAgent
 * @returns Promise<boolean> - True if successful, false otherwise
 */
async function registerAgent(): Promise<boolean> {
    const url = `${config.logAgentUrl}/api/v1/agents/register`;
    
    // Build public endpoint URL (use external IP)
    const agentEndpoint = `http://192.168.15.48:${config.agentPort}`;
    
    const data: AgentRegistration = {
        agentId: config.agentId,
        agentName: config.agentName,
        agentType: config.agentType,
        version: config.agentVersion,
        capabilities: ['hello', 'demo', 'greet', 'typescript'],
        endpoint: agentEndpoint,
        healthCheckUrl: `${agentEndpoint}/health`,
        metadata: {
            description: 'A simple Hello World agent demonstrating basic agent lifecycle in TypeScript',
            author: 'Hackathon Participant',
            language: 'TypeScript',
            framework: 'Express.js',
            runtime: 'Node.js',
        },
    };
    
    try {
        console.log(`📝 Registering agent with LogAgent at ${config.logAgentUrl}...`);
        const response: AxiosResponse = await axios.post(url, data, { headers: getHeaders(), timeout: 10000 });
        
        if (response.status === 200) {
            const result = response.data;
            console.log('✅ Agent registered successfully!');
            console.log(`   Agent ID: ${result.agentId}`);
            console.log(`   Registered at: ${result.registeredAt}`);
            console.log(`   Dashboard: ${result.dashboardUrl}`);
            return true;
        } else {
            console.log(`❌ Registration failed: ${response.status}`);
            console.log(`   Response: ${JSON.stringify(response.data)}`);
            return false;
        }
    } catch (error: any) {
        console.log(`❌ Error registering agent: ${error.message}`);
        return false;
    }
}

/**
 * Send status update (heartbeat) to LogAgent
 * @returns Promise<boolean> - True if successful, false otherwise
 */
async function sendHeartbeat(): Promise<boolean> {
    const url = `${config.logAgentUrl}/api/v1/agents/${config.agentId}/status`;
    
    const uptimeSeconds = metrics.startTime 
        ? Math.floor((Date.now() - metrics.startTime) / 1000) 
        : 0;
    
    const data: StatusUpdate = {
        status: 'healthy',
        metrics: {
            uptimeSeconds,
            messagesProcessed: metrics.requestsReceived,
            messagesSent: metrics.messagesSent,
            errorCount: metrics.errors,
        },
    };
    
    try {
        const response: AxiosResponse = await axios.put(url, data, { headers: getHeaders(), timeout: 10000 });
        if (response.status === 200) {
            console.log(`💓 Heartbeat sent (uptime: ${uptimeSeconds}s, requests: ${metrics.requestsReceived})`);
            return true;
        } else {
            console.log(`⚠️ Heartbeat failed: ${response.status}`);
            return false;
        }
    } catch (error: any) {
        console.log(`⚠️ Error sending heartbeat: ${error.message}`);
        return false;
    }
}

/**
 * Log an event to LogAgent
 * @param eventType - Type of event
 * @param data - Event data
 * @returns Promise<boolean> - True if successful, false otherwise
 */
async function logEvent(eventType: string, data: Record<string, any>): Promise<boolean> {
    const url = `${config.logAgentUrl}/api/v1/events`;
    
    const eventData: EventLog = {
        agentId: config.agentId,
        eventType,
        data,
        timestamp: new Date().toISOString(),
    };
    
    try {
        const response: AxiosResponse = await axios.post(url, eventData, { headers: getHeaders(), timeout: 10000 });
        if (response.status === 200) {
            const result = response.data;
            console.log(`📊 Event logged: ${eventType} (ID: ${result.eventId || 'N/A'})`);
            return true;
        } else {
            console.log(`⚠️ Event logging failed: ${response.status}`);
            return false;
        }
    } catch (error: any) {
        console.log(`⚠️ Error logging event: ${error.message}`);
        return false;
    }
}

// ============================================================================
// AGENT ENDPOINTS
// ============================================================================

/**
 * Root endpoint - basic info about the agent
 */
app.get('/', (req: Request, res: Response) => {
    metrics.requestsReceived++;
    
    const uptimeSeconds = metrics.startTime 
        ? Math.floor((Date.now() - metrics.startTime) / 1000) 
        : 0;
    
    res.json({
        agent: config.agentName,
        agent_id: config.agentId,
        version: config.agentVersion,
        status: 'healthy',
        message: 'Hello World! This TypeScript agent is running successfully.',
        uptime_seconds: uptimeSeconds,
        capabilities: ['hello', 'demo', 'greet', 'typescript'],
        runtime: {
            language: 'TypeScript',
            framework: 'Express.js',
            nodeVersion: process.version,
        },
    });
});

/**
 * Health check endpoint - required for LogAgent monitoring
 */
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        agent: config.agentName,
        agent_id: config.agentId,
        timestamp: new Date().toISOString(),
    });
});

/**
 * Demo endpoint - greets the user and logs an event
 * 
 * Example: GET /hello/John
 * Returns: {"message": "Hello, John!", ...}
 */
app.get('/hello/:name', async (req: Request, res: Response) => {
    metrics.requestsReceived++;
    metrics.messagesSent++;
    
    const name = req.params.name;
    
    // Log this greeting as an event
    await logEvent('greeting_sent', {
        recipient: name,
        greeting: `Hello, ${name}!`,
        timestamp: new Date().toISOString(),
    });
    
    res.json({
        message: `Hello, ${name}!`,
        agent: config.agentName,
        timestamp: new Date().toISOString(),
    });
});

/**
 * Get current agent metrics
 */
app.get('/metrics', (req: Request, res: Response) => {
    metrics.requestsReceived++;
    
    const uptimeSeconds = metrics.startTime 
        ? Math.floor((Date.now() - metrics.startTime) / 1000) 
        : 0;
    
    res.json({
        agent_id: config.agentId,
        uptime_seconds: uptimeSeconds,
        requests_received: metrics.requestsReceived,
        messages_sent: metrics.messagesSent,
        errors: metrics.errors,
        start_time: metrics.startTime,
        memory_usage: process.memoryUsage(),
    });
});

/**
 * Graceful shutdown endpoint
 */
app.post('/shutdown', (req: Request, res: Response) => {
    console.log('🛑 Shutdown requested via API');
    res.json({ message: 'Agent shutting down...' });
    
    // Delay shutdown to allow response to be sent
    setTimeout(() => {
        cleanup().then(() => {
            process.exit(0);
        });
    }, 500);
});

// ============================================================================
// BACKGROUND TASKS
// ============================================================================

/**
 * Start periodic heartbeat
 */
function startHeartbeat(): void {
    console.log(`💓 Heartbeat started (interval: ${config.heartbeatInterval / 1000}s)`);
    
    heartbeatTimer = setInterval(async () => {
        await sendHeartbeat();
    }, config.heartbeatInterval);
}

/**
 * Stop heartbeat
 */
function stopHeartbeat(): void {
    if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
        console.log('💓 Heartbeat stopped');
    }
}

// ============================================================================
// LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Agent startup logic
 */
async function startup(): Promise<void> {
    console.log('='.repeat(70));
    console.log(`🚀 Starting ${config.agentName}`);
    console.log('='.repeat(70));
    console.log(`   Agent ID: ${config.agentId}`);
    console.log(`   Type: ${config.agentType}`);
    console.log(`   Version: ${config.agentVersion}`);
    console.log(`   Host: ${config.agentHost}:${config.agentPort}`);
    console.log(`   LogAgent URL: ${config.logAgentUrl}`);
    console.log(`   Node Version: ${process.version}`);
    console.log('='.repeat(70));
    
    // Record start time
    metrics.startTime = Date.now();
    
    // Register with LogAgent
    const registered = await registerAgent();
    if (registered) {
        console.log('✅ Agent is ready to receive requests');
        
        // Log startup event
        await logEvent('agent_started', {
            agent_id: config.agentId,
            version: config.agentVersion,
            start_time: new Date().toISOString(),
            node_version: process.version,
        });
        
        // Start heartbeat
        startHeartbeat();
    } else {
        console.log('⚠️ Agent started but registration failed - will retry on next heartbeat');
    }
}

/**
 * Cleanup logic before shutdown
 */
async function cleanup(): Promise<void> {
    console.log('🧹 Cleaning up...');
    
    // Stop heartbeat
    stopHeartbeat();
    
    // Log shutdown event
    await logEvent('agent_stopped', {
        agent_id: config.agentId,
        stop_time: new Date().toISOString(),
        total_requests: metrics.requestsReceived,
        total_messages_sent: metrics.messagesSent,
    });
    
    // Final status update
    await sendHeartbeat();
    
    console.log('✅ Cleanup complete');
}

/**
 * Handle shutdown signals
 */
function setupShutdownHandlers(): void {
    const shutdownHandler = async (signal: string) => {
        console.log(`\n🛑 ${signal} signal received`);
        await cleanup();
        console.log(`\n👋 ${config.agentName} stopped`);
        process.exit(0);
    };
    
    process.on('SIGINT', () => shutdownHandler('SIGINT'));
    process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', async (error: Error) => {
        console.error('❌ Uncaught exception:', error);
        metrics.errors++;
        await cleanup();
        process.exit(1);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason: any) => {
        console.error('❌ Unhandled rejection:', reason);
        metrics.errors++;
        await cleanup();
        process.exit(1);
    });
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

async function main(): Promise<void> {
    try {
        // Setup shutdown handlers
        setupShutdownHandlers();
        
        // Run startup logic
        await startup();
        
        // Start Express server
        const server = app.listen(config.agentPort, config.agentHost, () => {
            console.log(`\n🌐 Agent API running at http://${config.agentHost}:${config.agentPort}`);
            console.log(`📖 Test endpoints:`);
            console.log(`   - GET  http://localhost:${config.agentPort}/`);
            console.log(`   - GET  http://localhost:${config.agentPort}/health`);
            console.log(`   - GET  http://localhost:${config.agentPort}/hello/YourName`);
            console.log(`   - GET  http://localhost:${config.agentPort}/metrics`);
            console.log(`📊 Dashboard at http://192.168.15.48:8888/agentic-dashboard.html`);
            console.log('\nPress Ctrl+C to stop the agent\n');
        });
        
        // Handle server errors
        server.on('error', (error: Error) => {
            console.error('❌ Server error:', error);
            metrics.errors++;
        });
        
    } catch (error: any) {
        console.error('❌ Fatal error:', error);
        metrics.errors++;
        await cleanup();
        process.exit(1);
    }
}

// Start the agent
if (require.main === module) {
    main().catch((error) => {
        console.error('❌ Failed to start agent:', error);
        process.exit(1);
    });
}

export { app, config, metrics, registerAgent, sendHeartbeat, logEvent };

