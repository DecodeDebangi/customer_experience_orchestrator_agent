# 🤖 Logixal Agent AI - Node.js Template

> Template for building intelligent agents using Logixal's Agentic Commerce Framework

## 📋 Overview

This template provides a complete foundation for building AI agents in Node.js that integrate with Logixal's commerce platforms (VTEX, CommerceTools, ATG) and participate in the Agent-to-Agent (A2A) communication protocol hackathon

## 🚀 Quick Start

```bash
# 1. Navigate to the template folder
cd agent-ai-nodejs-template

# 2. Install dependencies
npm install

# 3. Configure your agent
cp .env.example .env
# Edit .env with your configuration

# 4. Build TypeScript to JavaScript (REQUIRED!)
npm run build

# 5. Run your agent
npm start
```

### ⚠️ IMPORTANT: Build Before Run!

This template uses **TypeScript**. You MUST run `npm run build` before `npm start`:

```bash
# Always run these commands in order:
npm install        # Install dependencies
npm run build      # Compile TypeScript → JavaScript
npm start          # Run the compiled agent
```

If you see `Error: Cannot find module 'dist/index.js'`, it means you forgot to build!

## 📁 Project Structure

```
agent-ai-nodejs-template/
├── README.md                    # This file
├── package.json                 # Node.js dependencies
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Docker containerization
├── index.js                    # Entry point
├── src/
│   ├── Agent.js                # Main agent class
│   ├── A2AProtocol.js          # A2A communication handler
│   ├── tools.js                # Commerce platform integrations
│   └── utils.js                # Utility functions
├── examples/
│   ├── helloWorldAgent.js      # Simple example
│   ├── orderStatusAgent.js     # Order tracking example
│   └── inventoryAgent.js       # Inventory monitoring
├── tests/
│   ├── agent.test.js           # Agent tests
│   └── a2a.test.js             # A2A protocol tests
└── docs/
    ├── QUICKSTART.md           # Quick start guide
    ├── A2A_PROTOCOL.md         # A2A protocol documentation
    └── DEPLOYMENT.md           # Deployment guide
```

## 🎯 Features

### ✅ Built-in A2A Protocol
- Request/Response patterns
- Event publishing/subscribing
- Message prioritization
- Async/await support
- WebSocket & HTTP support

### ✅ Pre-integrated with Logixal Systems
- **VTEX**: Product catalog, orders, inventory
- **CommerceTools**: Cart, checkout, customers
- **ATG**: Legacy system integration
- **LogAgent**: Centralized agent registry

### ✅ Production-Ready
- Health checks & metrics
- Error handling & retries
- Structured logging (Winston)
- Express.js REST API
- Docker support
- PM2 process management

### ✅ Developer-Friendly
- TypeScript definitions
- Comprehensive tests (Jest)
- Example use cases
- API documentation
- ESLint configuration

## 🔧 Configuration

### Environment Variables

```bash
# Agent Configuration
AGENT_ID=my_agent
AGENT_NAME="My Custom Agent"
AGENT_TYPE=custom
AGENT_VERSION=1.0.0
HOST=0.0.0.0
PORT=8080
LOG_LEVEL=info

# LogAgent Registry
LOGAGENT_URL=http://192.168.15.48:8000
LOGAGENT_API_KEY=hackathon_key_2025

# VTEX (if using)
VTEX_STORE_URL=https://yourstore.vtexcommercestable.com.br
VTEX_APP_KEY=your-vtex-key
VTEX_APP_TOKEN=your-vtex-token

# CommerceTools (if using)
CT_PROJECT_KEY=your-project
CT_CLIENT_ID=your-client-id
CT_CLIENT_SECRET=your-secret
CT_API_URL=https://api.commercetools.com
CT_AUTH_URL=https://auth.commercetools.com
```

## 📝 Usage Examples

### Example 1: Hello World Agent

```javascript
const { BaseAgent } = require('./src/Agent');
const { MessageAction, MessagePriority } = require('./src/A2AProtocol');

class HelloWorldAgent extends BaseAgent {
  constructor() {
    super({
      agentId: 'hello_world_agent',
      agentName: 'Hello World Agent',
      agentType: 'example',
      version: '1.0.0',
      description: 'A simple hello world agent',
      capabilities: ['greet', 'echo']
    });
    
    this.registerHandler(MessageAction.REQUEST, this.handleRequest.bind(this));
  }
  
  async handleRequest(message) {
    const { capability, params } = message.data;
    
    if (capability === 'greet') {
      const name = params.name || 'World';
      return { message: `Hello, ${name}!` };
    }
    
    return { error: 'Unknown capability' };
  }
}

const agent = new HelloWorldAgent();
agent.start();
```

### Example 2: Order Status Agent

```javascript
const { BaseAgent } = require('./src/Agent');
const { VTEXClient } = require('./src/tools');

class OrderStatusAgent extends BaseAgent {
  constructor() {
    super({
      agentId: 'order_status_agent',
      agentName: 'Order Status Agent',
      agentType: 'order',
      capabilities: ['track_order', 'get_status']
    });
    
    this.vtex = new VTEXClient({
      storeUrl: process.env.VTEX_STORE_URL,
      appKey: process.env.VTEX_APP_KEY,
      appToken: process.env.VTEX_APP_TOKEN
    });
    
    this.registerHandler(MessageAction.REQUEST, this.handleRequest.bind(this));
  }
  
  async handleRequest(message) {
    const { capability, params } = message.data;
    
    if (capability === 'track_order') {
      const order = await this.vtex.getOrder(params.orderId);
      
      // Notify customer via notification agent
      if (order.status === 'shipped') {
        await this.notify(
          'notification_agent',
          'order_shipped',
          { 
            orderId: params.orderId,
            customerEmail: order.email,
            trackingNumber: order.tracking
          },
          MessagePriority.HIGH
        );
      }
      
      return { success: true, order };
    }
  }
}
```

## 🔌 Agent Registration

Register your agent with LogAgent:

```bash
# Using curl
curl -X POST http://192.168.15.48:8000/api/v1/agents/register \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "my_agent",
    "agent_name": "My Custom Agent",
    "agent_type": "custom",
    "version": "1.0.0",
    "capabilities": ["capability1", "capability2"],
    "endpoint": "https://my-agent.logixal.com",
    "health_check_url": "https://my-agent.logixal.com/health"
  }'
```

Or use the SDK:

```javascript
const { LogAgentClient } = require('./src/tools');

const client = new LogAgentClient({
  baseUrl: process.env.LOGAGENT_URL,
  apiKey: process.env.LOGAGENT_API_KEY
});

await client.registerAgent({
  agentId: 'my_agent',
  agentName: 'My Custom Agent',
  agentType: 'custom',
  version: '1.0.0',
  capabilities: ['capability1', 'capability2']
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- agent.test.js

# Watch mode
npm run test:watch
```

## 📦 Deployment

### Docker

```bash
# Build image
docker build -t my-agent:1.0.0 .

# Run container
docker run -d \
  --name my-agent \
  --env-file .env \
  -p 8080:8080 \
  my-agent:1.0.0
```

### PM2 (Production)

```bash
# Install PM2
npm install -g pm2

# Start agent
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs my-agent
```

### Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## 📊 Monitoring

Your agent automatically exposes:
- `/health` - Health check endpoint
- `/metrics` - Prometheus metrics  
- `/status` - Agent status and statistics

View in LogAgent Dashboard: http://192.168.15.48:8888/agentic-dashboard.html

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build TypeScript (REQUIRED before running!)
npm run build

# Run the agent
npm start

# Or run all in one line:
npm install && npm run build && npm start
```

## 📚 API Documentation

### Agent Endpoints

- `GET /health` - Health check
- `GET /status` - Detailed status
- `GET /capabilities` - List capabilities
- `POST /message` - Receive A2A message

### A2A Protocol

```javascript
// Send a message
await agent.sendMessage(
  'receiver_agent_id',
  MessageAction.REQUEST,
  { capability: 'do_something', params: {} }
);

// Request and wait for response
const response = await agent.request(
  'receiver_agent_id',
  'capability_name',
  { param1: 'value' },
  5000 // timeout ms
);

// Send notification
await agent.notify(
  'receiver_agent_id',
  'notification_type',
  { data: 'value' },
  MessagePriority.HIGH
);
```

## 🤝 Contributing

1. Fork the template
2. Create your feature branch
3. Implement your agent
4. Add tests
5. Submit for registration

## 📚 Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [A2A Protocol Reference](docs/A2A_PROTOCOL.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

---

**Ready to build your agent? Start coding! 🚀**

