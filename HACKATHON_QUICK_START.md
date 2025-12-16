# 🚀 Logixal Agent AI Hackathon - Quick Start Guide

## Welcome to the Logixal Agent AI Hackathon! 🎉

This guide will help you build, deploy, and register your first intelligent commerce agents.

---

## 📋 Prerequisites

### Required
- **Python 3.9+** OR **Node.js 18+**
- **Git**
- **Code editor** (VS Code recommended)
- **Postman** (optional, for API testing)

### Platform Access (Choose ONE)
- VTEX store credentials (app key + token)
- CommerceTools project credentials
- ATG system access
- HR system API access

---

## 🎯 Step 1: Choose Your Use Case (5 minutes)

1. Review the [30 Use Cases](./HACKATHON_30_USE_CASES.md)
2. Choose ONE use case based on:
   - Your skill level (🟢 Easy, 🟡 Medium, 🔴 Hard)
   - Platform access
   - Business impact
   - Personal interest

**Example:** Let's build **Use Case #9: Product Availability Notifier Agent** 🟢

---

## 🛠️ Step 2: Clone the Template (5 minutes)

### Option A: Python Template

```bash
# Clone the repository
git clone https://github.com/logixal-genai/agent-ai-python-template.git my-agent
cd my-agent

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
```

### Option B: Node.js/TypeScript Template

```bash
# Clone the repository
git clone https://github.com/logixal-genai/agent-ai-nodejs-template.git my-agent
cd my-agent

# Install dependencies
npm install

# Build TypeScript
npm run build

# Copy environment variables
cp .env.example .env
```

---

## ⚙️ Step 3: Configure Your Agent (10 minutes)

### Edit `.env` file:

```bash
# Agent Configuration
AGENT_ID=product_availability_agent
AGENT_NAME="Product Availability Notifier"
AGENT_TYPE=inventory
AGENT_VERSION=1.0.0
HOST=0.0.0.0
PORT=8080

# LogAgent Registry
LOGAGENT_URL=http://192.168.15.48:8000
LOGAGENT_API_KEY=hackathon_key_2025  # Request from organizers

# Platform Credentials (VTEX example)
VTEX_STORE_URL=https://yourstore.vtexcommercestable.com.br
VTEX_APP_KEY=your-vtex-app-key
VTEX_APP_TOKEN=your-vtex-app-token
```

### Update Agent Metadata:

**Python:** Edit `src/index.py` (or `main.py`)

```python
class ProductAvailabilityAgent(BaseAgent):
    def __init__(self):
        super().__init__(AgentConfig(
            agent_id="product_availability_agent",
            agent_name="Product Availability Notifier",
            agent_type="inventory",
            version="1.0.0",
            description="Notifies customers when wishlist items are available",
            capabilities=[
                "track_wishlist",
                "notify_available",
                "subscribe_alerts"
            ]
        ))
```

**TypeScript:** Edit `src/index.ts`

```typescript
class ProductAvailabilityAgent extends BaseAgent {
  constructor() {
    super({
      agentId: "product_availability_agent",
      agentName: "Product Availability Notifier",
      agentType: "inventory",
      version: "1.0.0",
      description: "Notifies customers when wishlist items are available",
      capabilities: [
        "track_wishlist",
        "notify_available",
        "subscribe_alerts"
      ]
    });
  }
}
```

---

## 💻 Step 4: Implement Your Agent Logic (60-90 minutes)

### A. Implement Capabilities

**Python Example:**

```python
async def handle_request(self, message: A2AMessage) -> dict:
    """Handle incoming REQUEST messages"""
    capability = message.data.get('capability')
    params = message.data.get('params', {})
    
    if capability == 'track_wishlist':
        return await self.track_wishlist(params)
    elif capability == 'notify_available':
        return await self.notify_available(params)
    elif capability == 'subscribe_alerts':
        return await self.subscribe_alerts(params)
    else:
        return {'success': False, 'error': f'Unknown capability: {capability}'}

async def track_wishlist(self, params: dict) -> dict:
    """Check if wishlist items are in stock"""
    user_id = params.get('userId')
    sku_id = params.get('skuId')
    
    # Call VTEX API to check inventory
    inventory = await self.vtex.get_inventory(sku_id)
    in_stock = inventory['totalQuantity'] > 0
    
    if in_stock:
        # Notify user via A2A
        await self.notify(
            'notification_agent',
            'product_available',
            {
                'userId': user_id,
                'skuId': sku_id,
                'quantity': inventory['totalQuantity']
            },
            priority=MessagePriority.HIGH
        )
    
    return {
        'success': True,
        'skuId': sku_id,
        'inStock': in_stock,
        'quantity': inventory['totalQuantity']
    }
```

**TypeScript Example:**

```typescript
private async handleRequest(message: A2AMessage): Promise<any> {
  const { capability, params } = message.data;
  
  if (capability === 'track_wishlist') {
    return await this.trackWishlist(params);
  } else if (capability === 'notify_available') {
    return await this.notifyAvailable(params);
  } else if (capability === 'subscribe_alerts') {
    return await this.subscribeAlerts(params);
  } else {
    return { success: false, error: `Unknown capability: ${capability}` };
  }
}

private async trackWishlist(params: any): Promise<any> {
  const userId = params.userId;
  const skuId = params.skuId;
  
  // Call VTEX API to check inventory
  const inventory = await this.vtex.getInventory(skuId);
  const inStock = (inventory.totalQuantity || 0) > 0;
  
  if (inStock) {
    // Notify user via A2A
    await this.notify(
      'notification_agent',
      'product_available',
      {
        userId,
        skuId,
        quantity: inventory.totalQuantity
      },
      MessagePriority.HIGH
    );
  }
  
  return {
    success: true,
    skuId,
    inStock,
    quantity: inventory.totalQuantity
  };
}
```

### B. Implement Background Task (Optional)

This runs periodically to check for updates:

**Python:**

```python
async def background_task(self):
    """Runs every 30 seconds"""
    # Check all tracked wishlists
    for user_id, sku_ids in self.tracked_wishlists.items():
        for sku_id in sku_ids:
            await self.track_wishlist({'userId': user_id, 'skuId': sku_id})
```

**TypeScript:**

```typescript
async backgroundTask(): Promise<void> {
  // Check all tracked wishlists
  for (const [userId, skuIds] of this.trackedWishlists) {
    for (const skuId of skuIds) {
      await this.trackWishlist({ userId, skuId });
    }
  }
}
```

---

## 🧪 Step 5: Test Locally (15 minutes)

### Start your agent:

**Python:**
```bash
python src/index.py
# Or: python main.py
```

**TypeScript:**
```bash
npm run dev  # Development mode with auto-reload
# Or: npm start (for production)
```

### Test endpoints with curl:

```bash
# Health check
curl http://localhost:8080/health

# Status
curl http://localhost:8080/status

# Capabilities
curl http://localhost:8080/capabilities

# Test A2A message
curl -X POST http://localhost:8080/message \
  -H "Content-Type: application/json" \
  -d '{
    "messageId": "test_001",
    "senderId": "test_client",
    "receiverId": "product_availability_agent",
    "action": "REQUEST",
    "data": {
      "capability": "track_wishlist",
      "params": {
        "userId": "user123",
        "skuId": "175"
      }
    },
    "priority": "normal",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

### Import Postman Collection:

1. Open Postman
2. Import `Logixal_Agent_AI_Hackathon.postman_collection.json`
3. Update environment variables
4. Test all endpoints

---

## 📡 Step 6: Register with LogAgent (10 minutes)

### Method 1: Automatic Registration (Recommended)

Your agent should auto-register on startup using the code in the template:

**Python:**
```python
async def on_start(self):
    await self.logagent.register_agent({
        'agent_id': self.agent_id,
        'agent_name': self.config.agent_name,
        'agent_type': self.config.agent_type,
        'version': self.config.version,
        'capabilities': self.config.capabilities,
        'endpoint': f'http://{self.config.host}:{self.config.port}',
        'health_check_url': f'http://{self.config.host}:{self.config.port}/health',
        'metadata': {
            'description': self.config.description,
            'author': 'Your Name'
        }
    })
```

### Method 2: Manual Registration via API

```bash
curl -X POST http://192.168.15.48:8000/api/v1/agents/register \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "product_availability_agent",
    "agentName": "Product Availability Notifier",
    "agentType": "inventory",
    "version": "1.0.0",
    "capabilities": ["track_wishlist", "notify_available", "subscribe_alerts"],
    "endpoint": "http://your-server:8080",
    "healthCheckUrl": "http://your-server:8080/health",
    "metadata": {
      "description": "Notifies customers when wishlist items are available",
      "author": "Your Name",
      "platform": "VTEX"
    }
  }'
```

---

## 📊 Step 7: Verify in Dashboard (5 minutes)

1. Open dashboard: `http://dashboard-url/agentic-dashboard.html`
2. Your agent should appear in the "Agents" section
3. Check:
   - ✅ Status is "healthy"
   - ✅ Capabilities are listed
   - ✅ Uptime is tracking
   - ✅ Agent card shows correct info

---

## 🐳 Step 8: Deploy with Docker (Optional, 20 minutes)

### Build Docker image:

```bash
docker build -t my-agent:latest .
```

### Run container:

```bash
docker run -d \
  --name my-agent \
  --env-file .env \
  -p 8080:8080 \
  my-agent:latest
```

### Check logs:

```bash
docker logs -f my-agent
```

---

## 📚 Step 9: Document Your Agent (10 minutes)

Update `README.md` with:

```markdown
# Product Availability Notifier Agent

## Overview
Tracks customer wishlists and sends notifications when items become available.

## Use Case
Use Case #9 from Logixal Agent AI Hackathon

## Capabilities
- `track_wishlist`: Monitor wishlist items for availability
- `notify_available`: Send notifications when items are in stock
- `subscribe_alerts`: Subscribe users to availability alerts

## Platform
VTEX

## Installation
See HACKATHON_QUICK_START.md

## API Examples
[Your API examples here]

## Demo Video
[Link to demo video]
```

---

## ✅ Step 10: Submit Your Agent (5 minutes)

### Submission Checklist:

- [ ] Agent is running and healthy
- [ ] Registered with LogAgent
- [ ] Visible in dashboard
- [ ] All capabilities implemented
- [ ] README updated
- [ ] Basic tests included
- [ ] Demo video recorded (optional but recommended)

### Submit via:

1. **GitHub:** Push to your repository and share the link
2. **Dashboard:** Your agent is auto-tracked once registered
3. **Slack/Email:** Share your agent ID and description

---

## 🎓 Tips for Success

### 1. **Start Simple**
- Implement ONE capability first
- Get it working end-to-end
- Then add more features

### 2. **Use Logging**
```python
logger.info("Processing request...")
logger.error(f"Error: {e}")
```

### 3. **Handle Errors Gracefully**
```python
try:
    result = await self.vtex.get_inventory(sku_id)
except Exception as e:
    logger.error(f"Error fetching inventory: {e}")
    return {'success': False, 'error': str(e)}
```

### 4. **Test Incrementally**
- Test each capability as you build it
- Use Postman for quick API testing
- Check logs frequently

### 5. **Ask for Help**
- Join Slack channel: `#agent-ai-hackathon`
- Check documentation
- Review examples in `examples/` folder

---

## 📖 Additional Resources

- **[30 Use Cases](./HACKATHON_30_USE_CASES.md)** - Choose your use case
- **[Python Template README](./agent-ai-python-template/README.md)** - Python docs
- **[Node.js Template README](./agent-ai-nodejs-template/README.md)** - TypeScript docs
- **[Postman Collection](./Logixal_Agent_AI_Hackathon.postman_collection.json)** - API testing
- **[Agent Registration API](./AGENT_REGISTRATION_API.md)** - API reference

---

## 🏆 Judging Criteria

Agents will be evaluated on:

1. **Functionality** (40%) - Does it work as intended?
2. **Code Quality** (20%) - Clean, documented, maintainable?
3. **Business Impact** (20%) - Solves a real problem?
4. **Innovation** (10%) - Creative approach?
5. **Presentation** (10%) - Clear documentation and demo?

---

## 🚨 Troubleshooting

### Agent won't start
- Check `.env` file is configured
- Verify Python/Node.js version
- Check port 8080 is not in use

### Registration fails
- Verify API key is correct
- Check `LOGAGENT_URL` is set
- Ensure agent is reachable

### Dashboard doesn't show agent
- Confirm registration was successful
- Check agent is sending heartbeats
- Verify health endpoint returns 200

### A2A messages not working
- Check receiver agent ID is correct
- Verify both agents are registered
- Check message format matches schema

---

## 🎉 Ready to Build?

You have everything you need! Pick your use case, clone the template, and start building your intelligent commerce agent.

**Good luck, and happy hacking! 🚀**

---

**Questions?** Reach out on Slack: `#agent-ai-hackathon`

