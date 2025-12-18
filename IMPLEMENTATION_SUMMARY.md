# Customer Experience Orchestrator Agent - Implementation Summary

## ✅ Implementation Complete

This document summarizes what has been implemented for the **Customer Experience Orchestrator Agent** (Use Case #5).

## 📋 What Was Implemented

### 1. **Extended VTEX Client** (`src/tools.ts`)

Added new methods to `VTEXClient`:

- `getCheckoutSession(orderFormId)` - Get checkout session details
- `getOrderForm(orderFormId)` - Get order form information
- `getActiveOrderForms()` - Get list of active order forms
- `getSession(sessionId)` - Get session information
- `getCustomerOrders(email, limit)` - Get customer order history
- `getCustomerProfile(email)` - Get customer profile (first-time vs returning)

### 2. **Customer Experience Orchestrator Agent** (`src/CustomerExperienceOrchestratorAgent.ts`)

Complete implementation with all 6 required capabilities:

#### Capability 1: `monitor_customer_journey`

- Tracks customer browsing, cart, and checkout behavior
- Maintains active session state
- Updates session status based on order form data
- Tracks cart value and item count

#### Capability 2: `detect_friction_points`

- Detects cart abandonment (10+ minutes in cart)
- Detects slow checkout (15+ minutes in checkout)
- Detects high-value carts not checking out
- Returns detailed friction point information

#### Capability 3: `decide_intervention`

- Autonomous decision-making based on:
  - Customer type (first-time vs returning)
  - Cart value
  - Friction points detected
- Intervention types:
  - Discount + Free Shipping (first-time customers)
  - Chat Offer (returning customers)
  - Priority Customer Service (high-value carts)
  - Checkout Assistance (slow checkout)

#### Capability 4: `personalize_approach`

- Fetches customer profile from VTEX
- Determines if customer is first-time or returning
- Provides personalized recommendations
- Adapts intervention strategy based on customer history

#### Capability 5: `coordinate_outreach`

- Sends emails via `notification_agent` (A2A Bridge)
- Offers chat assistance via `chat_agent` (A2A Bridge)
- Coordinates with multiple agents for complex workflows
- Tracks outreach activities

#### Capability 6: `measure_impact`

- Tracks intervention success rates
- Measures conversion rates
- Calculates overall impact metrics
- Updates intervention success status

### 3. **Real-Time Monitoring** (Background Task)

- Runs every 30 seconds (inherited from BaseAgent)
- Monitors all active customer sessions
- Automatically detects friction points
- Triggers interventions when needed
- Cleans up old abandoned sessions (1+ hour old)

### 4. **A2A Communication**

- Integrated with A2A Bridge for sending emails
- Integrated with notification_agent for customer outreach
- Integrated with chat_agent for assistance offers
- All A2A messages logged to dashboard

### 5. **Event Logging**

- Comprehensive event logging to LogAgent
- Events for: STARTUP, INFO, WARNING, ERROR, A2A
- Tracks all customer journey milestones
- Logs intervention decisions and outcomes

## 🔧 Configuration

### Environment Variables Required

Create a `.env` file with:

```bash
# Agent Configuration
AGENT_ID=customer_experience_orchestrator_agent
AGENT_NAME=Customer Experience Orchestrator Agent
AGENT_TYPE=customer_experience
AGENT_VERSION=1.0.0
HOST=0.0.0.0
PORT=8080
LOG_LEVEL=info

# LogAgent Configuration
LOGAGENT_URL=http://192.168.15.48:8000
LOGAGENT_API_KEY=logixal-agent-api-key-2024

# VTEX Configuration
VTEX_STORE_URL=https://yourstore.vtexcommercestable.com.br
VTEX_APP_KEY=your-vtex-app-key
VTEX_APP_TOKEN=your-vtex-app-token

# Optional
AGENT_AUTHOR=Your Name
```

### Configurable Thresholds

The agent uses these thresholds (can be modified in code):

- **Cart Abandonment Time**: 10 minutes
- **High-Value Cart Threshold**: ₹50,000
- **Checkout Timeout**: 15 minutes
- **Session Cleanup Age**: 1 hour

## 🚀 How to Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy and edit .env file
cp .env.example .env
# Edit .env with your VTEX credentials
```

### 3. Build TypeScript

```bash
npm run build
```

### 4. Start the Agent

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## 📡 API Usage Examples

### Monitor Customer Journey

```bash
curl -X POST http://localhost:8080/message \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REQUEST",
    "from": "test_client",
    "to": "customer_experience_orchestrator_agent",
    "data": {
      "capability": "monitor_customer_journey",
      "params": {
        "sessionId": "session_123",
        "orderFormId": "orderform_456",
        "email": "customer@example.com"
      }
    }
  }'
```

### Detect Friction Points

```bash
curl -X POST http://localhost:8080/message \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REQUEST",
    "from": "test_client",
    "to": "customer_experience_orchestrator_agent",
    "data": {
      "capability": "detect_friction_points",
      "params": {
        "sessionId": "session_123"
      }
    }
  }'
```

### Decide Intervention

```bash
curl -X POST http://localhost:8080/message \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REQUEST",
    "from": "test_client",
    "to": "customer_experience_orchestrator_agent",
    "data": {
      "capability": "decide_intervention",
      "params": {
        "sessionId": "session_123"
      }
    }
  }'
```

### Measure Impact

```bash
curl -X POST http://localhost:8080/message \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REQUEST",
    "from": "test_client",
    "to": "customer_experience_orchestrator_agent",
    "data": {
      "capability": "measure_impact",
      "params": {
        "sessionId": "session_123"
      }
    }
  }'
```

## 🎯 Key Features

### ✅ Autonomous Decision Making

- Agent automatically detects friction points
- Makes context-aware intervention decisions
- Adapts strategy based on customer profile

### ✅ Real-Time Monitoring

- Continuous background monitoring of active sessions
- Automatic friction point detection
- Proactive intervention triggering

### ✅ Personalization

- First-time vs returning customer detection
- Cart value-based prioritization
- Customized intervention messages

### ✅ Multi-Agent Coordination

- Seamless A2A communication
- Email notifications via notification_agent
- Chat assistance via chat_agent

### ✅ Impact Measurement

- Tracks intervention success rates
- Measures conversion improvements
- Provides detailed analytics

## 📊 Dashboard Integration

The agent automatically:

- Registers with LogAgent on startup
- Sends heartbeat every 30 seconds
- Logs all events to dashboard
- Tracks metrics (active sessions, interventions, conversions)

View your agent at: `http://192.168.15.48:8888/agentic-dashboard.html`

## 🔍 Testing Checklist

- [ ] Agent starts successfully
- [ ] Agent registers with LogAgent
- [ ] All 6 capabilities respond correctly
- [ ] Background monitoring works
- [ ] Friction points are detected
- [ ] Interventions are decided correctly
- [ ] A2A messages are sent successfully
- [ ] Events appear in dashboard
- [ ] Impact measurement works

## 📝 Next Steps

1. **Configure VTEX Credentials**: Add your VTEX store credentials to `.env`
2. **Test with Real Data**: Test with actual customer sessions
3. **Tune Thresholds**: Adjust abandonment times and thresholds as needed
4. **Customize Interventions**: Modify intervention messages and strategies
5. **Add More Metrics**: Extend impact measurement with additional KPIs

## 🐛 Troubleshooting

### Agent won't start

- Check `.env` file is configured
- Verify Node.js version (18+)
- Check port 8080 is not in use

### Registration fails

- Verify `LOGAGENT_URL` and `LOGAGENT_API_KEY` are correct
- Check network connectivity to LogAgent server

### VTEX API errors

- Verify VTEX credentials are correct
- Check VTEX store URL format
- Ensure API keys have proper permissions

### A2A messages not working

- Verify `notification_agent` and `chat_agent` are running
- Check A2A Bridge endpoint is accessible
- Review logs for error messages

## 📚 Related Files

- `src/CustomerExperienceOrchestratorAgent.ts` - Main agent implementation
- `src/tools.ts` - VTEX client with extended methods
- `src/index.ts` - Entry point
- `HACKATHON_30_USE_CASES.md` - Use case specification

---

**Implementation Date**: 2025-01-XX  
**Use Case**: #5 - Customer Experience Orchestrator Agent  
**Platform**: VTEX  
**Status**: ✅ Complete and Ready for Testing
