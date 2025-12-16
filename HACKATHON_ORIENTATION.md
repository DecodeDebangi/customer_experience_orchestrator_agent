# 🚀 Agentic Commerce Framework - Hackathon Orientation

---

## 📌 Executive Summary

**What:** Build intelligent, autonomous agents using the Logixal Agentic Commerce Framework  
**When:** Dec 2-11, 2025  
**Who:** Banking & Commerce teams (Bangalore & Mumbai)  
**Why:** Solve real-world challenges with agent-driven automation  

**Key Highlights:**
- ✅ Pre-built templates in Python & Node.js
- ✅ Complete API infrastructure & dashboard
- ✅ Agent-to-Agent communication built-in
- ✅ Real-time monitoring & logging
- ✅ 5 use case themes to choose from
- ✅ Full documentation & Postman collections

**What You'll Build in 10 Days:**
A working agent that autonomously performs tasks, collaborates with other agents, and solves a real business problem.

**Prize Categories:**
- 🥇 Most Innovative Solution
- 🥈 Best Technical Implementation
- 🥉 Highest Business Impact
- 🏆 Best Agent Collaboration

---

## 📋 Table of Contents
1. [Welcome & Overview](#welcome--overview)
2. [What is Agentic Commerce?](#what-is-agentic-commerce)
3. [Framework Architecture](#framework-architecture)
4. [Use Case Themes](#use-case-themes)
5. [Getting Started](#getting-started)
6. [Hello World Demo](#hello-world-demo)
7. [Development Workflow](#development-workflow)
8. [Evaluation Criteria](#evaluation-criteria)
9. [Timeline & Deliverables](#timeline--deliverables)

---

## 🎯 Welcome & Overview

### Hackathon Objective
Build **intelligent, autonomous agents** that solve real-world banking and commerce challenges using the **Logixal Agentic Commerce Framework**.

### Why Agentic Commerce?
- **Autonomous Decision Making** - Agents that think and act independently
- **Multi-Step Task Execution** - Complex workflows automated end-to-end
- **Agent-to-Agent Collaboration** - Agents working together seamlessly
- **Real-Time Intelligence** - Context-aware, adaptive responses

### What You'll Build
- Custom agents with specific capabilities
- Integration with banking/commerce platforms (VTEX, CommerceTools)
- Agent-to-Agent communication for complex workflows
- Real-time monitoring via centralized dashboard

---

## 🤖 What is Agentic Commerce?

### Traditional vs Agentic Approach

| Traditional Automation | Agentic Commerce |
|------------------------|------------------|
| Rule-based, rigid | Context-aware, adaptive |
| Single-step tasks | Multi-step workflows |
| Isolated systems | Collaborative agents |
| Manual orchestration | Autonomous coordination |

### Key Concepts

**1. Agents**
- Autonomous software entities with specific capabilities
- Can perceive, decide, and act independently
- Examples: HR Agent, Inventory Agent, Notification Agent

**2. Capabilities**
- Specific tasks an agent can perform
- Examples: `check_lra_expiry`, `send_email`, `process_order`

**3. Agent-to-Agent (A2A) Communication**
- Agents collaborate to solve complex problems
- Example: Inventory Agent → Notification Agent → Email to customer

**4. Event-Driven Architecture**
- Agents react to events in real-time
- All actions logged to centralized dashboard

---

## 🏗️ Framework Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Agentic Dashboard                         │
│         (Real-time monitoring & visualization)               │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Events & Logs
                            │
┌─────────────────────────────────────────────────────────────┐
│                  LogAgent Registry & API                     │
│    • Agent Registration    • Event Logging                   │
│    • A2A Bridge           • Status Monitoring                │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ A2A Messages
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼───────┐  ┌───────▼────────┐
│  Your Custom   │  │  Built-in    │  │  Other Custom  │
│     Agent      │◄─┤   Agents     │─►│     Agents     │
│                │  │              │  │                │
│ • capability1  │  │ • Inventory  │  │ • capability3  │
│ • capability2  │  │ • Notification│ │ • capability4  │
└────────────────┘  └──────────────┘  └────────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  Commerce Platforms & Databases       │
        │  • VTEX    • CommerceTools            │
        │  • PostgreSQL  • REST APIs            │
        └───────────────────────────────────────┘
```

### Core Components

**1. Agent Templates** (Python & Node.js)
- Pre-built base classes with all framework integration
- Helper methods for common tasks
- Production-ready error handling

**2. LogAgent Registry**
- Central registry for all agents
- API for registration, status updates, event logging
- A2A message routing

**3. A2A Bridge**
- Routes messages between external and built-in agents
- Enables email notifications, inventory checks, etc.

**4. Dashboard**
- Real-time agent monitoring
- Event stream visualization
- Performance metrics

---

## 🎨 Use Case Themes

### 1. **HR & Employee Management**
- Logixal Resource Allocation (LRA) monitoring
- Employee onboarding automation
- Performance review workflows
- Training recommendation systems

**Example Agent:** LRA Agent
- Monitors employee allocations expiring in 30 days
- Sends automated email notifications
- Integrates with HR database

### 2. **Banking & Finance**
- Fraud detection and alerting
- Loan approval workflows
- Transaction monitoring
- Customer credit scoring

**Example Agent:** Fraud Detection Agent
- Analyzes transaction patterns
- Flags suspicious activities
- Notifies compliance team

### 3. **E-Commerce & Retail**
- Inventory management and restocking
- Order fulfillment automation
- Customer service chatbots
- Personalized recommendations

**Example Agent:** Inventory Agent
- Monitors stock levels
- Triggers reorder workflows
- Sends out-of-stock notifications

### 4. **Customer Experience**
- Proactive customer support
- Personalized marketing campaigns
- Feedback collection and analysis
- Loyalty program management

**Example Agent:** Customer Engagement Agent
- Analyzes customer behavior
- Sends personalized offers
- Manages loyalty points

### 5. **Integration & Orchestration**
- Multi-system data synchronization
- Workflow automation across platforms
- API gateway management
- Event-driven integrations

**Example Agent:** Integration Agent
- Syncs data between systems
- Orchestrates complex workflows
- Handles API rate limiting

---

## 🚀 Getting Started

### Prerequisites

**For Python Developers:**
```bash
- Python 3.8+
- pip (Python package manager)
- Basic knowledge of async/await
```

**For Node.js Developers:**
```bash
- Node.js 18+
- npm (Node package manager)
- Basic knowledge of TypeScript
```

### Quick Setup

**1. Get Your Template**
```bash
# Python Template
cd agent-ai-python-template

# OR Node.js Template
cd agent-ai-nodejs-template
```

**2. Install Dependencies**
```bash
# Python
pip install -r requirements.txt

# Node.js
npm install
```

**3. Configure Environment**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your details
AGENT_ID=my_hackathon_agent
AGENT_NAME=My Hackathon Agent
PORT=8080
LOGAGENT_URL=http://192.168.15.48:8000
LOGAGENT_API_KEY=logixal-agent-api-key-2024
```

**4. Run Your Agent**
```bash
# Python
python main.py

# Node.js
npm start
```

---

## 👋 Hello World Demo

### Step 1: Create Your First Agent

**Python (`main.py`):**
```python
class MyHackathonAgent(BaseAgent):
    def __init__(self):
        config = AgentConfig(
            agent_id="hello_world_agent",
            agent_name="Hello World Agent",
            agent_type="demo",
            version="1.0.0",
            capabilities=["greet", "calculate"],
            port=8080
        )
        super().__init__(config)
        
        self.logagent = LogAgentClient(
            base_url="http://192.168.15.48:8000",
            api_key="logixal-agent-api-key-2024"
        )
        
        self.a2a.register_handler(MessageAction.REQUEST, self.handle_request)
    
    async def handle_request(self, message: A2AMessage):
        capability = message.data.get("capability")
        params = message.data.get("params", {})
        
        if capability == "greet":
            name = params.get("name", "World")
            return {"success": True, "message": f"Hello, {name}!"}
        
        elif capability == "calculate":
            a = params.get("a", 0)
            b = params.get("b", 0)
            return {"success": True, "result": a + b}
        
        return {"success": False, "error": "Unknown capability"}
```

**Node.js (`src/index.ts`):**
```typescript
class MyHackathonAgent extends BaseAgent {
  private logagent: LogAgentClient;

  constructor() {
    super({
      agentId: 'hello_world_agent',
      agentName: 'Hello World Agent',
      agentType: 'demo',
      version: '1.0.0',
      capabilities: ['greet', 'calculate'],
      port: 8080
    });

    this.logagent = new LogAgentClient({
      baseUrl: 'http://192.168.15.48:8000',
      apiKey: 'logixal-agent-api-key-2024'
    });

    this.registerHandler(MessageAction.REQUEST, this.handleRequest.bind(this));
  }

  private async handleRequest(message: A2AMessage): Promise<any> {
    const { capability, params } = message.data;

    if (capability === 'greet') {
      const name = params.name || 'World';
      return { success: true, message: `Hello, ${name}!` };
    } else if (capability === 'calculate') {
      const result = (params.a || 0) + (params.b || 0);
      return { success: true, result };
    }

    return { success: false, error: 'Unknown capability' };
  }
}
```

### Step 2: Register Your Agent

**Using Postman or cURL:**
```bash
curl -X POST "http://192.168.15.48:8000/api/v1/agents/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hello_world_agent",
    "agentName": "Hello World Agent",
    "agentType": "demo",
    "version": "1.0.0",
    "capabilities": ["greet", "calculate"],
    "endpoint": "http://localhost:8080",
    "healthCheckUrl": "http://localhost:8080/health",
    "metadata": {
      "description": "My first hackathon agent",
      "author": "Your Name",
      "team": "Team Alpha"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "agentId": "hello_world_agent",
  "message": "Agent registered successfully",
  "dashboardUrl": "http://192.168.15.48:8888/agentic-dashboard.html"
}
```

### Step 3: Test Your Agent's Capabilities

**Test "greet" capability:**
```bash
curl -X POST "http://localhost:8080/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "test_001",
    "sender_id": "test_client",
    "receiver_id": "hello_world_agent",
    "action": "REQUEST",
    "data": {
      "capability": "greet",
      "params": {
        "name": "Hackathon Team"
      }
    },
    "priority": "normal"
  }'
```

**Response:**
```json
{
  "success": true,
  "response": {
    "success": true,
    "message": "Hello, Hackathon Team!"
  }
}
```

**Test "calculate" capability:**
```bash
curl -X POST "http://localhost:8080/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "test_002",
    "sender_id": "test_client",
    "receiver_id": "hello_world_agent",
    "action": "REQUEST",
    "data": {
      "capability": "calculate",
      "params": {
        "a": 10,
        "b": 25
      }
    },
    "priority": "normal"
  }'
```

**Response:**
```json
{
  "success": true,
  "response": {
    "success": true,
    "result": 35
  }
}
```

### Step 4: Send Events to Dashboard

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hello_world_agent",
    "eventType": "INFO",
    "data": {
      "message": "Successfully processed greeting request",
      "capability": "greet",
      "user": "Hackathon Team"
    },
    "timestamp": "2025-12-02T15:30:00Z"
  }'
```

### Step 5: View in Dashboard

Open: **http://192.168.15.48:8888/agentic-dashboard.html**

You'll see:
- ✅ Your agent listed with status "healthy"
- ✅ Request counter incrementing
- ✅ Events appearing in real-time
- ✅ Agent metadata and capabilities

---

## 🔄 Development Workflow

### 1. **Design Your Agent**
- Define use case and capabilities
- Identify required integrations (DB, APIs, etc.)
- Plan A2A communication needs

### 2. **Implement Capabilities**
```python
async def handle_request(self, message: A2AMessage):
    capability = message.data.get("capability")
    
    if capability == "your_capability":
        # Your business logic here
        result = await self.do_something(params)
        return {"success": True, "result": result}
```

### 3. **Test Locally**
- Use Postman collection provided
- Test each capability independently
- Verify error handling

### 4. **Register with LogAgent**
```bash
POST /api/v1/agents/register
```

### 5. **Monitor in Dashboard**
- Check agent status
- View events in real-time
- Monitor performance metrics

### 6. **Implement A2A Communication**
```python
# Send email via notification agent
await self.send_a2a_message(
    target_agent="notification_agent",
    action="send_email",
    payload={
        "user_email": "customer@example.com",
        "subject": "Your Order is Ready",
        "body": "Thank you for your order!"
    }
)
```

### 7. **Iterate & Enhance**
- Add more capabilities
- Improve error handling
- Optimize performance

---

## 📊 Evaluation Criteria

### 1. **Innovation & Creativity** (25%)
- Uniqueness of the solution
- Creative use of agent capabilities
- Novel approach to problem-solving

### 2. **Technical Implementation** (30%)
- Code quality and organization
- Proper use of framework features
- Error handling and resilience
- Performance optimization

### 3. **Business Impact** (25%)
- Solves real-world problem
- Measurable value proposition
- Scalability potential
- User experience

### 4. **Agent Collaboration** (10%)
- Effective use of A2A communication
- Multi-agent workflows
- Integration with built-in agents

### 5. **Presentation & Documentation** (10%)
- Clear demonstration
- Well-documented code
- Comprehensive README
- Use case explanation

---

## 📅 Timeline & Deliverables

### **Phase 1: Orientation (Dec 2-3)**
- Framework overview
- Template walkthrough
- Q&A session

### **Phase 2: Development (Dec 4-9)**
- Build your agent
- Test and iterate
- Use dashboard for monitoring

### **Phase 3: Submission (Dec 10-11)**
**Deliverables:**
1. **Source Code**
   - Complete agent implementation
   - Configuration files
   - Dependencies list

2. **Documentation**
   - README with setup instructions
   - Use case description
   - API documentation
   - Architecture diagram

3. **Demo Video** (5 minutes)
   - Problem statement
   - Solution walkthrough
   - Live demonstration
   - Dashboard view

4. **Presentation Deck** (10 slides max)
   - Problem & Solution
   - Architecture
   - Key Features
   - Business Impact
   - Future Roadmap

### **Phase 4: Evaluation & Demo Day (Dec 11)**
- Live demonstrations
- Q&A
- Winner announcement

---

## 🛠️ Resources & Support

### **Documentation**
- **Quick Start Guide:** `QUICK_START.md`
- **Complete Agent Flow:** `COMPLETE_AGENT_FLOW.md`
- **A2A Communication:** `A2A_COMMUNICATION_GUIDE.md`
- **API Reference:** `AGENT_REGISTRATION_API.md`

### **Code Examples**
- **Hello World Agent:** `main.py` / `src/index.ts`
- **LRA Agent (with DB):** `main_dynamic_LRA.py` / `src/index_dynamic_LRA.ts`
- **Test Agent:** `main_test_LRA.py`

### **Tools Provided**
- ✅ Postman Collection (all APIs)
- ✅ Environment file template
- ✅ PowerShell test commands
- ✅ Bash test scripts

### **API Endpoints**

**Agent Registry:**
- `POST /api/v1/agents/register` - Register agent
- `GET /api/v1/agents/{agentId}` - Get agent info
- `PUT /api/v1/agents/{agentId}` - Update agent
- `DELETE /api/v1/agents/{agentId}` - Deregister agent

**Events & Logs:**
- `POST /api/v1/events` - Send event
- `GET /api/v1/agents/{agentId}/logs` - Get logs
- `GET /api/v1/agents/{agentId}/logs/summary` - Log summary

**A2A Communication:**
- `POST /api/v1/a2a/send` - Send A2A message
- `POST /api/v1/a2a/email` - Quick email send

**Dashboard:**
- `GET /api/dashboard/overview` - System overview
- `GET /api/dashboard/agents` - All agents
- `GET /api/dashboard/events` - Recent events

### **Support Channels**
- **Email:** support@logixal.com
- **Dashboard:** http://192.168.15.48:8888/agentic-dashboard.html
- **API Server:** http://192.168.15.48:8000

### **Helper Methods Available**

**Python:**
```python
await self.send_event(event_type, message, severity, metadata)
await self.send_a2a_message(target_agent, action, payload, priority)
await self.update_agent_metadata(agent_name, capabilities, metadata)
await self.get_my_logs(limit, event_type)
```

**Node.js:**
```typescript
await this.sendEvent(eventType, message, severity, metadata);
await this.sendA2AMessage(targetAgent, action, payload, priority);
await this.updateAgentMetadata(updates);
await this.getMyLogs(limit, eventType);
```

---

## 🎯 Tips for Success

### **DO:**
✅ Start simple, then add complexity
✅ Test each capability thoroughly
✅ Use the dashboard to monitor your agent
✅ Leverage A2A communication for complex workflows
✅ Document your code well
✅ Handle errors gracefully
✅ Think about real-world business impact

### **DON'T:**
❌ Try to build everything at once
❌ Ignore error handling
❌ Skip testing
❌ Forget to register your agent
❌ Hardcode credentials
❌ Neglect documentation

---

## 🏆 Hackaton Use Cases


## 📞 Questions?

**During Orientation:**
- Ask questions in the session
- Share your ideas
- Discuss use cases

**During Development:**
- Check documentation first
- Use Postman collection for testing
- Monitor dashboard for debugging
- Email support if stuck

---

## 🎉 Let's Build Something Amazing!

The Agentic Commerce Framework gives you the power to build intelligent, autonomous agents that solve real problems. We're excited to see what you create!

**Remember:**
- Innovation matters more than complexity
- Real-world impact is key
- Collaboration (A2A) makes agents powerful
- Have fun and experiment!

**Good luck, and happy coding! 🚀**

---

**Orientation Sessions:**
- **Bangalore:** Tuesday, Dec 2, 3:30-4:15 PM
- **Mumbai:** Wednesday, Dec 3, 3:30-4:15 PM

**Dashboard:** http://192.168.15.48:8888/agentic-dashboard.html
**API Server:** http://192.168.15.48:8000

---

## 📇 Quick Reference Card

### **Essential URLs**
```
Dashboard:    http://192.168.15.48:8888/agentic-dashboard.html
API Server:   http://192.168.15.48:8000
API Key:      logixal-agent-api-key-2024
```

### **Quick Start Commands**

**Python:**
```bash
pip install -r requirements.txt
python main.py
```

**Node.js:**
```bash
npm install
npm start
```

### **Must-Have API Calls**

**1. Register Agent:**
```bash
POST http://192.168.15.48:8000/api/v1/agents/register
Headers: Authorization: Bearer logixal-agent-api-key-2024
```

**2. Test Agent Capability:**
```bash
POST http://localhost:8080/message
Body: {
  "message_id": "test_001",
  "sender_id": "test_client",
  "receiver_id": "your_agent_id",
  "action": "REQUEST",
  "data": {
    "capability": "your_capability",
    "params": {}
  },
  "priority": "normal"
}
```

**3. Send Event:**
```bash
POST http://192.168.15.48:8000/api/v1/events
Headers: Authorization: Bearer logixal-agent-api-key-2024
Body: {
  "agentId": "your_agent_id",
  "eventType": "INFO",
  "data": {"message": "Something happened"}
}
```

**4. Send Email (A2A):**
```bash
POST http://192.168.15.48:8000/api/v1/a2a/send
Headers: Authorization: Bearer logixal-agent-api-key-2024
Body: {
  "agentId": "your_agent_id",
  "targetAgent": "notification_agent",
  "action": "send_email",
  "payload": {
    "user_email": "user@example.com",
    "subject": "Test",
    "body": "Hello!"
  }
}
```

### **File Structure**
```
agent-ai-python-template/
├── main.py                          # Your agent code
├── .env                             # Configuration
├── requirements.txt                 # Dependencies
├── Logixal_Agent_AI_Hackathon.postman_collection.json
└── HACKATHON_ORIENTATION.md         # This file

agent-ai-nodejs-template/
├── src/index.ts                     # Your agent code
├── .env                             # Configuration
├── package.json                     # Dependencies
├── Logixal_Agent_AI_Hackathon_Complete.postman_collection.json
└── HACKATHON_ORIENTATION.md         # This file
```

### **Helper Methods Available**

**Python:**
```python
await self.send_event(event_type, message, severity, metadata)
await self.send_a2a_message(target_agent, action, payload, priority)
await self.update_agent_metadata(agent_name, capabilities, metadata)
await self.get_my_logs(limit, event_type)
```

**Node.js:**
```typescript
await this.sendEvent(eventType, message, severity, metadata);
await this.sendA2AMessage(targetAgent, action, payload, priority);
await this.updateAgentMetadata(updates);
await this.getMyLogs(limit, eventType);
```

### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Agent not showing in dashboard | Check if registered correctly |
| 401 Unauthorized | Verify API key in .env |
| 404 Not Found | Check agent is running on correct port |
| Events not appearing | Ensure agentId matches registration |
| A2A not working | Use /api/v1/a2a/send endpoint |

### **Evaluation Checklist**

Before submission, ensure:
- ✅ Agent registers successfully
- ✅ All capabilities work
- ✅ Events appear in dashboard
- ✅ Error handling implemented
- ✅ README.md with setup instructions
- ✅ Demo video recorded
- ✅ Presentation deck prepared
- ✅ Code is well-documented


