# 👋 Hello World Agent (TypeScript/Node.js) - Quick Start Guide

A simple but complete reference implementation demonstrating agent lifecycle, registration, heartbeat, and event logging in TypeScript.

---

## 🎯 What This Agent Does

This Hello World agent demonstrates all essential agent features using TypeScript and Express.js:

✅ **Agent Registration** - Automatically registers with LogAgent on startup  
✅ **Health Checks** - Provides `/health` endpoint for monitoring  
✅ **Heartbeat/Status Updates** - Sends periodic status updates every 30 seconds  
✅ **Event Logging** - Logs events (greetings, startup, shutdown) to LogAgent  
✅ **Metrics Tracking** - Tracks requests, messages sent, errors, uptime, memory  
✅ **Graceful Shutdown** - Proper cleanup when stopping  
✅ **Type Safety** - Full TypeScript support with interfaces and types  

---

## 📋 Prerequisites

**Node.js:** v16.0.0 or higher  
**npm:** v8.0.0 or higher

Check your versions:
```bash
node --version
npm --version
```

---

## 🚀 Quick Start

### **Option 1: Run with npm (Recommended)**

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run the agent
npm start
```

### **Option 2: Run with ts-node (Development)**

```bash
# Install dependencies
npm install

# Run directly without building
npm run dev
```

### **Option 3: Run with auto-reload (Development)**

```bash
# Install dependencies
npm install

# Run with auto-reload on file changes
npm run dev:watch
```

---

## 📦 Installation Steps

### **Step 1: Create project directory**
```bash
mkdir hello-world-agent-ts
cd hello-world-agent-ts
```

### **Step 2: Copy files**
```bash
# Copy these files to your directory:
# - hello_world_agent.ts
# - package.json (rename from hello_world_agent_package.json)
# - tsconfig.json (rename from hello_world_agent_tsconfig.json)

cp hello_world_agent.ts .
cp hello_world_agent_package.json package.json
cp hello_world_agent_tsconfig.json tsconfig.json
```

### **Step 3: Install dependencies**
```bash
npm install
```

### **Step 4: Configure (Optional)**
```bash
# Create .env file or set environment variables
export AGENT_ID="my_ts_agent"
export AGENT_NAME="My TypeScript Agent"
export AGENT_PORT="9001"
export LOGAGENT_URL="http://192.168.15.48:8000"
export LOGAGENT_API_KEY="hackathon_key_2025"
```

### **Step 5: Build and run**
```bash
npm run build
npm start
```

---

## 🧪 Test the Agent

### **1. Check if Agent is Running**
```bash
curl http://localhost:9001
```

**Expected Response:**
```json
{
  "agent": "Hello World Agent (TypeScript)",
  "agent_id": "hello_world_agent_ts",
  "version": "1.0.0",
  "status": "healthy",
  "message": "Hello World! This TypeScript agent is running successfully.",
  "uptime_seconds": 45,
  "capabilities": ["hello", "demo", "greet", "typescript"],
  "runtime": {
    "language": "TypeScript",
    "framework": "Express.js",
    "nodeVersion": "v18.17.0"
  }
}
```

### **2. Health Check**
```bash
curl http://localhost:9001/health
```

**Expected:**
```json
{
  "status": "healthy",
  "agent": "Hello World Agent (TypeScript)",
  "agent_id": "hello_world_agent_ts",
  "timestamp": "2025-11-20T10:30:00.000Z"
}
```

### **3. Test Greeting (with Event Logging)**
```bash
curl http://localhost:9001/hello/Alice
```

**Expected:**
```json
{
  "message": "Hello, Alice!",
  "agent": "Hello World Agent (TypeScript)",
  "timestamp": "2025-11-20T10:30:00.000Z"
}
```

### **4. Check Metrics**
```bash
curl http://localhost:9001/metrics
```

**Expected:**
```json
{
  "agent_id": "hello_world_agent_ts",
  "uptime_seconds": 120,
  "requests_received": 5,
  "messages_sent": 2,
  "errors": 0,
  "start_time": 1732104600000,
  "memory_usage": {
    "rss": 45678592,
    "heapTotal": 18874368,
    "heapUsed": 12345678,
    "external": 1234567
  }
}
```

### **5. View in Dashboard**

Open: `http://192.168.15.48:8888/agentic-dashboard.html`

You should see your agent listed with:
- ✅ Status: Healthy
- 📊 Metrics updating every 30 seconds
- 📝 Events logged in the events panel

---

## 🔧 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Agent info and status |
| `/health` | GET | Health check (required by LogAgent) |
| `/hello/:name` | GET | Greet a user and log event |
| `/metrics` | GET | Get current agent metrics (includes memory) |
| `/shutdown` | POST | Gracefully shutdown the agent |

---

## 📊 Project Structure

```
hello-world-agent-ts/
├── hello_world_agent.ts      # Main agent implementation
├── package.json               # Node.js dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── dist/                      # Compiled JavaScript (after build)
│   └── hello_world_agent.js
└── node_modules/              # Dependencies (after npm install)
```

---

## 🛠️ NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run build` | `tsc` | Compile TypeScript to JavaScript |
| `npm start` | `node dist/hello_world_agent.js` | Run compiled agent |
| `npm run dev` | `ts-node hello_world_agent.ts` | Run directly with ts-node |
| `npm run dev:watch` | `nodemon --exec ts-node` | Auto-reload on changes |
| `npm run clean` | `rm -rf dist` | Remove compiled files |

---

## 🎓 TypeScript Features Used

### **1. Interfaces and Types**
```typescript
interface AgentConfig {
    agentId: string;
    agentName: string;
    agentType: string;
    // ...
}

interface AgentMetrics {
    startTime: number | null;
    requestsReceived: number;
    // ...
}
```

### **2. Type-Safe HTTP Requests**
```typescript
const response: AxiosResponse = await axios.post(url, data, {
    headers: getHeaders(),
    timeout: 10000
});
```

### **3. Async/Await**
```typescript
async function registerAgent(): Promise<boolean> {
    try {
        const response = await axios.post(url, data);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}
```

### **4. Express Type Annotations**
```typescript
app.get('/hello/:name', async (req: Request, res: Response) => {
    const name = req.params.name;
    // ...
});
```

---

## 🔧 Customization Guide

### **Add New Endpoints**

```typescript
/**
 * Custom endpoint example
 */
app.get('/custom-endpoint', async (req: Request, res: Response) => {
    metrics.requestsReceived++;
    
    // Your logic here
    const result = {
        status: 'success',
        data: 'Your custom data'
    };
    
    // Log event
    await logEvent('custom_event', result);
    
    res.json(result);
});
```

### **Add Custom Configuration**

```typescript
// Add to AgentConfig interface
interface AgentConfig {
    // ... existing fields
    customSetting: string;
}

// Add to config object
const config: AgentConfig = {
    // ... existing config
    customSetting: process.env.CUSTOM_SETTING || 'default_value',
};
```

### **Add Custom Metrics**

```typescript
// Add to AgentMetrics interface
interface AgentMetrics {
    // ... existing fields
    customCounter: number;
}

// Initialize in metrics object
const metrics: AgentMetrics = {
    // ... existing metrics
    customCounter: 0,
};

// Use in your endpoints
app.get('/custom', (req: Request, res: Response) => {
    metrics.customCounter++;
    // ...
});
```

---

## 🐛 Troubleshooting

### **Issue: Module not found**

**Solution:**
```bash
npm install
npm run build
```

### **Issue: Port already in use**

**Solution:**
```bash
export AGENT_PORT=9002
npm start
```

Or kill the process using the port:
```bash
# Find process using port 9001
lsof -i :9001

# Kill it
kill -9 <PID>
```

### **Issue: TypeScript compilation errors**

**Solution:**
```bash
# Clean and rebuild
npm run clean
npm run build
```

### **Issue: Agent not appearing in dashboard**

**Check 1:** Is agent running?
```bash
curl http://localhost:9001/health
```

**Check 2:** Check logs for registration success
Look for `✅ Agent registered successfully!`

**Check 3:** Verify LogAgent URL
```bash
echo $LOGAGENT_URL
# Should be: http://192.168.15.48:8000
```

---

## 📦 Running in Docker

### **Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY hello_world_agent.ts ./

# Build TypeScript
RUN npm run build

# Set environment variables
ENV AGENT_HOST=0.0.0.0
ENV AGENT_PORT=9001
ENV NODE_ENV=production

EXPOSE 9001

# Run the agent
CMD ["npm", "start"]
```

### **Build and Run**

```bash
# Build image
docker build -t hello-world-agent-ts .

# Run container
docker run -p 9001:9001 \
  -e LOGAGENT_URL=http://192.168.15.48:8000 \
  -e LOGAGENT_API_KEY=hackathon_key_2025 \
  hello-world-agent-ts
```

---

## 🚀 Production Deployment

### **Using PM2 (Process Manager)**

```bash
# Install PM2
npm install -g pm2

# Build the agent
npm run build

# Start with PM2
pm2 start dist/hello_world_agent.js --name "hello-world-agent-ts"

# View logs
pm2 logs hello-world-agent-ts

# Monitor
pm2 monit

# Stop
pm2 stop hello-world-agent-ts

# Restart
pm2 restart hello-world-agent-ts
```

### **PM2 Ecosystem File**

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'hello-world-agent-ts',
    script: './dist/hello_world_agent.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      AGENT_ID: 'hello_world_agent_ts',
      AGENT_PORT: '9001',
      LOGAGENT_URL: 'http://192.168.15.48:8000',
      LOGAGENT_API_KEY: 'hackathon_key_2025'
    }
  }]
};
```

Start with:
```bash
pm2 start ecosystem.config.js
```

---

## ✅ Success Checklist

After running the agent, verify:

- [ ] Agent starts without errors
- [ ] Console shows `✅ Agent registered successfully!`
- [ ] Health endpoint responds: `curl http://localhost:9001/health`
- [ ] Agent appears in dashboard: `http://192.168.15.48:8888/agentic-dashboard.html`
- [ ] Greeting works: `curl http://localhost:9001/hello/YourName`
- [ ] Events logged in dashboard
- [ ] Metrics updating every 30 seconds
- [ ] Graceful shutdown with Ctrl+C
- [ ] TypeScript compilation succeeds
- [ ] No TypeScript errors in IDE

---

## 📊 Comparison: Python vs TypeScript

| Feature | Python Version | TypeScript Version |
|---------|---------------|-------------------|
| **Framework** | FastAPI | Express.js |
| **Type Safety** | Pydantic models | TypeScript interfaces |
| **Async** | asyncio | async/await |
| **Package Manager** | pip | npm |
| **Build Step** | No | Yes (tsc) |
| **Runtime** | Python 3.9+ | Node.js 16+ |
| **Memory Metrics** | Basic | Detailed (heap) |
| **Auto-docs** | Yes (/docs) | No (manual) |
| **Port Default** | 9000 | 9001 |

Both are equally valid - choose based on your team's expertise!

---

## 🎯 Next Steps

Now that you understand the TypeScript implementation:

1. **Compare with Python version** - see how concepts translate
2. **Customize for your use case** - add business logic
3. **Integrate with APIs** - VTEX, CommerceTools, etc.
4. **Add authentication** if needed
5. **Implement retry logic** for external API calls
6. **Add request validation** using Zod or Joi
7. **Add logging** using Winston or Pino

**Good luck with your hackathon project!** 🚀

---

## 📚 Additional Resources

- **Python Version:** `hello_world_agent.py`
- **API Documentation:** `AGENT_REGISTRATION_API.md`
- **Quick Start Guide:** `HACKATHON_QUICK_START.md`
- **Use Cases:** `HACKATHON_30_USE_CASES.md`
- **TypeScript Template:** `agent-ai-nodejs-template/`
- **Postman Collection:** `Logixal_Agent_AI_Hackathon.postman_collection.json`

---

## 💡 TypeScript Tips

1. **Use `strict` mode** - catches more errors at compile time
2. **Define interfaces** for all API requests/responses
3. **Use `async/await`** instead of callbacks
4. **Enable source maps** for easier debugging
5. **Use `nodemon`** in development for auto-reload
6. **Run `npm audit`** to check for security vulnerabilities
7. **Use ESLint** for code quality
8. **Add unit tests** with Jest or Mocha

Happy coding! 🎉

