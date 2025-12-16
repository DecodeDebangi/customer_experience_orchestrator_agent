# 🎯 Agent AI Hackathon - Complete Package

## 📦 What's Included

This package contains everything your team needs to participate in the Agent AI Hackathon:

### 📄 Documentation Files

1. **`QUICK_START.md`** - Get started in 5 minutes
2. **`COMPLETE_AGENT_FLOW.md`** - Comprehensive guide with all cURL commands
3. **`AGENT_REGISTRATION_API.md`** - API endpoint documentation
4. **`Logixal_Agent_AI_Hackathon.postman_collection.json`** - Postman collection (import this!)

### 🔧 Configuration

- **API Base URL:** `http://192.168.15.48:8000`
- **Dashboard URL:** `http://192.168.15.48:8888/agentic-dashboard.html`
- **API Key:** `logixal-agent-api-key-2024`

---

## 🚀 Getting Started (3 Steps)

### Step 1: Import Postman Collection
1. Open Postman
2. Click **Import**
3. Select `Logixal_Agent_AI_Hackathon.postman_collection.json`
4. Update the `agent_id` variable to your unique agent ID

### Step 2: Register Your Agent
Use the **"Register New Agent"** request in Postman, or run:

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/agents/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "your_agent_id",
    "agentName": "Your Agent Name",
    "agentType": "custom",
    "version": "1.0.0",
    "capabilities": ["your_capabilities"],
    "endpoint": "http://your-server:port",
    "healthCheckUrl": "http://your-server:port/health",
    "metadata": {
      "description": "Your agent description",
      "author": "Your Name",
      "platform": "Your Platform"
    }
  }'
```

### Step 3: View Dashboard
Open: **http://192.168.15.48:8888/agentic-dashboard.html**

Your agent should appear in the dashboard! 🎉

---

## 📚 API Endpoints Overview

### Agent Management
- `POST /api/v1/agents/register` - Register new agent
- `GET /api/v1/agents/{agentId}` - Get agent info
- `PUT /api/v1/agents/{agentId}` - Update agent metadata/capabilities
- `DELETE /api/v1/agents/{agentId}` - Deregister agent
- `PUT /api/v1/agents/{agentId}/status` - Update status (heartbeat)
- `GET /api/v1/agents` - List all agents

### Events & Logging
- `POST /api/v1/events` - Send event/log
- `GET /api/v1/agents/{agentId}/logs` - Get agent logs
- `GET /api/v1/agents/{agentId}/logs/summary` - Get log summary
- `GET /api/v1/agents/{agentId}/logs/range` - Get logs by date range

### Dashboard APIs
- `GET /api/dashboard/overview` - System overview
- `GET /api/dashboard/agents` - List all agents
- `GET /api/dashboard/events` - Recent events
- `GET /api/dashboard/business-metrics` - Business metrics

---

## 🎯 Key Features

### ✅ What You Can Do

1. **Register Your Agent** - Add your custom agent to the system
2. **Send Events** - Log INFO, ERROR, WARNING, SUCCESS events
3. **A2A Communication** - Send messages between agents
4. **Update Metadata** - Change capabilities, description, etc.
5. **Check Logs** - View all events from your agent
6. **Real-time Dashboard** - See your agent status live
7. **Auto-increment Requests** - Every event increases your request counter

### 📊 Dashboard Features

- **Real-time Updates** - See events as they happen
- **Agent Cards** - View agent status, metadata, capabilities
- **Request Counter** - Automatically tracks events
- **Event History** - View all recent events
- **Health Monitoring** - Track agent health status

---

## 🔄 Complete Workflow Example

```bash
# 1. Register
curl -X POST "http://192.168.15.48:8000/api/v1/agents/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{"agentId":"demo_agent","agentName":"Demo","agentType":"demo","version":"1.0.0","capabilities":["demo"],"endpoint":"http://localhost:9000","healthCheckUrl":"http://localhost:9000/health","metadata":{"description":"Demo agent","author":"Demo User","platform":"Linux"}}'

# 2. Send Event
curl -X POST "http://192.168.15.48:8000/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{"agentId":"demo_agent","eventType":"INFO","data":{"message":"Hello World"},"timestamp":"'$(date -Iseconds)'"}'

# 3. Update Agent
curl -X PUT "http://192.168.15.48:8000/api/v1/agents/demo_agent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{"capabilities":["demo","new_feature"]}'

# 4. Check Logs
curl -X GET "http://192.168.15.48:8000/api/v1/agents/demo_agent/logs?limit=10" \
  -H "Authorization: Bearer logixal-agent-api-key-2024"

# 5. View Dashboard
# Open: http://192.168.15.48:8888/agentic-dashboard.html
```

---

## 🎨 Event Types

| Event Type | Description | Example Use Case |
|------------|-------------|------------------|
| `STARTUP` | Agent initialization | Agent starts up |
| `INFO` | General information | Processing request |
| `SUCCESS` | Successful operation | Task completed |
| `WARNING` | Warning message | High memory usage |
| `ERROR` | Error occurred | API connection failed |
| `A2A` | Agent-to-Agent communication | Request to another agent |

---

## 🤝 A2A Communication Examples

### Request Notification
```json
{
  "agentId": "your_agent",
  "eventType": "A2A",
  "data": {
    "message": "Request notification_agent to send email",
    "target_agent": "notification_agent",
    "action": "send_email",
    "payload": {
      "to": "user@example.com",
      "subject": "Alert",
      "body": "Your message here"
    }
  },
  "timestamp": "2025-11-25T10:00:00+05:30"
}
```

### Request Inventory Check
```json
{
  "agentId": "your_agent",
  "eventType": "A2A",
  "data": {
    "message": "Request inventory_agent to check stock",
    "target_agent": "inventory_agent",
    "action": "check_inventory",
    "payload": {
      "sku": "PRODUCT-123",
      "quantity_threshold": 10
    }
  },
  "timestamp": "2025-11-25T10:00:00+05:30"
}
```

---

## 🐛 Troubleshooting

### Issue: "Invalid or missing API key"
✅ **Solution:** Use `logixal-agent-api-key-2024` in the Authorization header

### Issue: "Agent not found"
✅ **Solution:** Check if agent is registered: `GET /api/v1/agents/{agentId}`

### Issue: Events not showing in dashboard
✅ **Solution:** 
1. Verify events are stored: `GET /api/v1/agents/{agentId}/logs`
2. Refresh browser
3. Check timestamp format (use `date -Iseconds`)

### Issue: Requests counter not increasing
✅ **Solution:** Send more events - each event auto-increments the counter

---

## 📞 Support & Resources

- **Dashboard:** http://192.168.15.48:8888/agentic-dashboard.html
- **API Base:** http://192.168.15.48:8000
- **Documentation:** See `COMPLETE_AGENT_FLOW.md`
- **Quick Start:** See `QUICK_START.md`

---

## 🏆 Hackathon Tips

1. **Use Unique Agent IDs** - Include your team name: `team_alpha_agent_001`
2. **Send Events Frequently** - More events = higher request count
3. **Use A2A Communication** - Demonstrates agent collaboration
4. **Update Metadata** - Show agent evolution during hackathon
5. **Monitor Dashboard** - Real-time feedback on your agent
6. **Check Logs Regularly** - Debug issues quickly
7. **Use Descriptive Messages** - Makes dashboard more impressive

---

## 📝 Checklist

- [ ] Import Postman collection
- [ ] Update `agent_id` variable in Postman
- [ ] Register your agent
- [ ] Send startup event
- [ ] Verify agent appears in dashboard
- [ ] Send multiple events (INFO, SUCCESS, etc.)
- [ ] Test A2A communication
- [ ] Update agent capabilities
- [ ] Check logs via API
- [ ] Monitor dashboard in real-time

---

## 🎯 Success Criteria

Your agent is working correctly if:
- ✅ Agent appears in dashboard
- ✅ Events show in "Recent Events" section
- ✅ Request counter increases with each event
- ✅ Metadata displays correctly (author, platform, capabilities)
- ✅ Logs are accessible via API
- ✅ A2A messages are logged

---

**Good luck with your hackathon! 🚀**

For detailed documentation, see:
- `QUICK_START.md` - 5-minute setup
- `COMPLETE_AGENT_FLOW.md` - Full API reference with examples
- `AGENT_REGISTRATION_API.md` - API endpoint documentation

