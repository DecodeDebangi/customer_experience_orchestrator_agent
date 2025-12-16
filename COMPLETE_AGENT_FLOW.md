# 🚀 Complete Agent AI Hackathon Flow - Step by Step

## 📋 Table of Contents
1. [Setup & Configuration](#setup--configuration)
2. [Agent Registration](#1-agent-registration)
3. [**Test Your Agent's Business Logic (/message API)**](#2-test-your-agents-business-logic-message-api) ⭐ **NEW**
4. [Send Events (Logging)](#3-send-events-logging)
5. [Update Agent Metadata](#4-update-agent-metadata)
6. [Agent-to-Agent (A2A) Communication](#5-agent-to-agent-a2a-communication)
7. [Check Logs](#6-check-logs)
8. [Monitor Dashboard](#7-monitor-dashboard)
9. [Complete Test Flow](#8-complete-test-flow)

---

## Setup & Configuration

### Environment Variables
```bash
export BASE_URL="http://192.168.15.48:8000"
export API_KEY="logixal-agent-api-key-2024"
export AGENT_ID="hackathon_agent_001"
```

### Dashboard URL
```
http://192.168.15.48:8888/agentic-dashboard.html
```

---

## 1. Agent Registration

### Register Your Agent
```bash
curl -X POST "$BASE_URL/api/v1/agents/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "agentName": "Hackathon Demo Agent",
    "agentType": "demo",
    "version": "1.0.0",
    "capabilities": ["product_search", "recommendation", "chat"],
    "endpoint": "http://192.168.15.48:9000",
    "healthCheckUrl": "http://192.168.15.48:9000/health",
    "metadata": {
      "description": "AI agent for conversational commerce",
      "author": "Team Alpha",
      "platform": "Cloud-Native",
      "team": "Hackathon Team Alpha",
      "github": "https://github.com/team-alpha/agent"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "agentId": "hackathon_agent_001",
  "message": "Agent registered successfully",
  "registeredAt": "2025-11-25T11:00:51.699362",
  "dashboardUrl": "http://192.168.15.48:8888/agentic-dashboard.html"
}
```

### Verify Registration
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
  -H "Authorization: Bearer $API_KEY"
```

---

## 2. Test Your Agent's Business Logic (/message API) ⭐

### **IMPORTANT: This is how you trigger your agent to DO things!**

The `/message` endpoint is YOUR agent's API for executing business logic. This is different from Send Events (which is just logging).

### **What is the /message API?**

- **Endpoint:** `http://localhost:{YOUR_AGENT_PORT}/message`
- **Purpose:** Trigger your agent's capabilities (business logic)
- **Provided by:** YOUR agent (BaseAgent class)
- **Port:** Your agent's port (e.g., 8080, 12001, etc.)

### **Generic Template**

```bash
curl -X POST "http://localhost:8080/message" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REQUEST",
    "from": "test_client",
    "to": "your_agent_id",
    "data": {
      "capability": "your_capability_name",
      "params": {
        "param1": "value1",
        "param2": "value2"
      }
    }
  }'
```

### **PowerShell Version**

```powershell
curl.exe -X POST "http://localhost:8080/message" `
  -H "Content-Type: application/json" `
  -d '{\"action\":\"REQUEST\",\"from\":\"test_client\",\"to\":\"your_agent_id\",\"data\":{\"capability\":\"your_capability_name\",\"params\":{\"param1\":\"value1\"}}}'
```

### **Example: Trigger capability1**

```bash
curl -X POST "http://localhost:8080/message" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REQUEST",
    "from": "test_client",
    "to": "my_nodejs_agent",
    "data": {
      "capability": "capability1",
      "params": {
        "test": "data"
      }
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "result": {
    "message": "Capability 1 executed",
    "params": {"test": "data"}
  }
}
```

### **Example: Trigger capability2**

```bash
curl -X POST "http://localhost:8080/message" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REQUEST",
    "from": "test_client",
    "to": "my_nodejs_agent",
    "data": {
      "capability": "capability2",
      "params": {
        "query": "laptop"
      }
    }
  }'
```

### **Check Agent Health**

```bash
curl -X GET "http://localhost:8080/health"
```

**Response:**
```json
{
  "status": "healthy",
  "agent_id": "my_nodejs_agent",
  "uptime_seconds": 3600,
  "total_messages_processed": 10,
  "total_messages_sent": 5,
  "error_count": 0
}
```

### **Key Points:**

- ✅ Replace `8080` with YOUR agent's port
- ✅ Replace `your_capability_name` with your actual capability
- ✅ This is how you test what your agent DOES
- ✅ Different from Send Events (which is just logging)

---

## 3. Send Events (Logging)

### Startup Event
```bash
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "eventType": "STARTUP",
    "data": {
      "message": "Agent started successfully",
      "status": "initialized",
      "startup_time": "'$(date -Iseconds)'"
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
```

### Info Event (Processing Request)
```bash
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "eventType": "INFO",
    "data": {
      "message": "Processing user request for product search",
      "action": "product_search",
      "query": "laptop",
      "results_count": 25
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
```

### Success Event
```bash
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "eventType": "SUCCESS",
    "data": {
      "message": "Successfully processed user request",
      "action": "product_search",
      "duration_ms": 245,
      "results_returned": 25
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
```

### Error Event
```bash
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "eventType": "ERROR",
    "data": {
      "message": "Failed to connect to external API",
      "error_code": "CONNECTION_TIMEOUT",
      "error_details": "Timeout after 30 seconds",
      "retry_count": 3
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
```

### Warning Event
```bash
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "eventType": "WARNING",
    "data": {
      "message": "High memory usage detected",
      "memory_usage_percent": 85,
      "threshold": 80
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
```

---

## 4. Update Agent Metadata

### Update Capabilities
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "capabilities": [
      "product_search",
      "recommendation",
      "chat",
      "sentiment_analysis",
      "ml_processing"
    ]
  }'
```

### Update Agent Name & Description
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentName": "Advanced AI Commerce Agent",
    "metadata": {
      "description": "Enterprise-grade AI agent for conversational commerce with ML capabilities",
      "author": "Team Alpha",
      "platform": "Cloud-Native (Kubernetes)",
      "version": "2.0.0",
      "team": "Hackathon Team Alpha",
      "github": "https://github.com/team-alpha/agent",
      "documentation": "https://docs.team-alpha.com"
    }
  }'
```

### Update Everything
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentName": "Super Commerce AI Agent",
    "agentType": "ml_agent",
    "version": "3.0.0",
    "capabilities": [
      "natural_language_processing",
      "sentiment_analysis",
      "recommendation_engine",
      "real_time_chat",
      "data_visualization",
      "predictive_analytics"
    ],
    "metadata": {
      "description": "Next-gen AI agent with advanced ML and NLP capabilities",
      "author": "Team Alpha - Lead: John Doe",
      "platform": "Cloud-Native (Kubernetes + Docker)",
      "version": "3.0.0",
      "license": "MIT",
      "team": "Hackathon Team Alpha",
      "github": "https://github.com/team-alpha/agent",
      "documentation": "https://docs.team-alpha.com",
      "contact": "team-alpha@example.com",
      "max_concurrent_requests": 1000,
      "supported_languages": ["en", "es", "fr", "de", "pt"]
    }
  }'
```

### Update Status (Heartbeat)
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "status": "healthy",
    "metadata": {
      "uptimeSeconds": 7200,
      "messagesProcessed": 150,
      "messagesSent": 45,
      "errorCount": 2,
      "cpu_usage": 45.2,
      "memory_usage_mb": 512,
      "active_tasks": 8
    }
  }'
```

---

## 5. Agent-to-Agent (A2A) Communication

### 🔥 NEW: Send A2A Message via Bridge (Actually Sends Email!)
```bash
curl -X POST "$BASE_URL/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "notification_agent",
    "action": "send_email",
    "payload": {
      "user_email": "customer@example.com",
      "subject": "Product Back in Stock!",
      "body": "Great news! The laptop you were waiting for is now available.",
      "user_id": "customer_123",
      "sku_id": "LAPTOP-001"
    },
    "priority": "high"
  }'
```

**⚠️ Important:** Use `/api/v1/a2a/send` to **actually trigger** built-in agents and send emails!

### Log A2A Event Only (Dashboard Only - No Email Sent)
```bash
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "eventType": "A2A",
    "data": {
      "message": "This only logs to dashboard, does not send email",
      "target_agent": "notification_agent",
      "action": "send_email"
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
```

**Note:** This only logs the event. Use `/api/v1/a2a/send` to actually send emails.

### Request Inventory Check (A2A via Bridge)
```bash
curl -X POST "$BASE_URL/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "inventory_agent",
    "action": "check_inventory",
    "payload": {
      "sku_id": "175",
      "quantity_threshold": 10
    },
    "priority": "normal"
  }'
```

### Broadcast Message to All Agents (A2A via Bridge)
```bash
curl -X POST "$BASE_URL/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "all",
    "action": "broadcast",
    "payload": {
      "type": "maintenance_alert",
      "message": "System maintenance scheduled in 30 minutes",
      "scheduled_time": "'$(date -d '+30 minutes' -Iseconds)'",
      "duration_minutes": 15
    },
    "priority": "high"
  }'
```

### Request Data from Analytics Agent (A2A via Bridge)
```bash
curl -X POST "$BASE_URL/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "analytics_agent",
    "action": "query_data",
    "payload": {
      "query_type": "user_behavior",
      "user_id": "user_12345",
      "date_range": "last_7_days"
    },
    "priority": "normal"
  }'
```

### Simplified Email Sending
```bash
curl -X POST "$BASE_URL/api/v1/a2a/email?agentId=hackathon_agent_001&to=customer@example.com&subject=Test&body=Hello&priority=high" \
  -H "Authorization: Bearer $API_KEY"
```

---

## 6. Check Logs

### Get All Logs (Last 50)
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=50" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
```

### Get Only ERROR Logs
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=ERROR&limit=20" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
```

### Get Only INFO Logs
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=INFO&limit=20" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
```

### Get Only A2A Communication Logs
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=A2A&limit=20" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
```

### Get Log Summary
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
```

**Expected Response:**
```json
{
  "success": true,
  "agentId": "hackathon_agent_001",
  "summary": {
    "totalLogs": 25,
    "logsLast24Hours": 25,
    "eventTypeCounts": {
      "INFO": 15,
      "ERROR": 3,
      "A2A": 5,
      "STARTUP": 1,
      "WARNING": 1
    },
    "latestEventType": "INFO",
    "latestTimestamp": "2025-11-25T16:45:30+05:30"
  }
}
```

### Get Logs by Date Range
```bash
START_DATE=$(date -d '7 days ago' +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)

curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=$START_DATE&end_date=$END_DATE&limit=100" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
```

### Get Logs for Specific Date
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=2025-11-25&end_date=2025-11-25&limit=100" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
```

---

## 7. Monitor Dashboard

### Get System Overview
```bash
curl -X GET "$BASE_URL/api/dashboard/overview" | python -m json.tool
```

### Get All Agents
```bash
curl -X GET "$BASE_URL/api/dashboard/agents" | python -m json.tool
```

### Get Recent Events (Dashboard View)
```bash
curl -X GET "$BASE_URL/api/dashboard/events?limit=50" | python -m json.tool
```

### Get Business Metrics
```bash
# Today's metrics
curl -X GET "$BASE_URL/api/dashboard/business-metrics?days=0" | python -m json.tool

# Last 7 days
curl -X GET "$BASE_URL/api/dashboard/business-metrics?days=7" | python -m json.tool

# Last 30 days
curl -X GET "$BASE_URL/api/dashboard/business-metrics?days=30" | python -m json.tool
```

---

## 8. Complete Test Flow

### Full Agent Lifecycle Test Script

```bash
#!/bin/bash

# Configuration
BASE_URL="http://192.168.15.48:8000"
API_KEY="logixal-agent-api-key-2024"
AGENT_ID="hackathon_test_$(date +%s)"

echo "============================================"
echo "🚀 Complete Agent AI Test Flow"
echo "============================================"
echo ""

# STEP 1: Register Agent
echo "📝 STEP 1: Registering agent..."
curl -X POST "$BASE_URL/api/v1/agents/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "agentName": "Test Agent",
    "agentType": "test",
    "version": "1.0.0",
    "capabilities": ["test_capability"],
    "endpoint": "http://192.168.15.48:9000",
    "healthCheckUrl": "http://192.168.15.48:9000/health",
    "metadata": {
      "description": "Test agent for complete flow",
      "author": "Test User",
      "platform": "Linux"
    }
  }'
echo -e "\n"
sleep 2

# STEP 2: Send Startup Event
echo "📝 STEP 2: Sending startup event..."
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "eventType": "STARTUP",
    "data": {
      "message": "Agent started successfully",
      "status": "initialized"
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
echo -e "\n"
sleep 1

# STEP 3: Send Processing Events
echo "📝 STEP 3: Sending processing events..."
for i in {1..5}; do
  curl -X POST "$BASE_URL/api/v1/events" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    -d '{
      "agentId": "'$AGENT_ID'",
      "eventType": "INFO",
      "data": {
        "message": "Processing request #'$i'",
        "action": "process_data",
        "request_id": "req_'$i'"
      },
      "timestamp": "'$(date -Iseconds)'"
    }'
  echo ""
  sleep 1
done

# STEP 4: Send A2A Message
echo "📝 STEP 4: Sending A2A message..."
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "eventType": "A2A",
    "data": {
      "message": "Requesting notification_agent to send alert",
      "target_agent": "notification_agent",
      "action": "send_notification",
      "payload": {
        "type": "test_alert",
        "priority": "normal"
      }
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
echo -e "\n"
sleep 1

# STEP 5: Send Error Event
echo "📝 STEP 5: Sending error event..."
curl -X POST "$BASE_URL/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "eventType": "ERROR",
    "data": {
      "message": "Test error for demonstration",
      "error_code": "TEST_ERROR",
      "error_details": "This is a test error"
    },
    "timestamp": "'$(date -Iseconds)'"
  }'
echo -e "\n"
sleep 1

# STEP 6: Update Agent Capabilities
echo "📝 STEP 6: Updating agent capabilities..."
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentName": "Updated Test Agent",
    "capabilities": ["test_capability", "new_feature", "ml_processing"],
    "metadata": {
      "description": "Updated test agent with new capabilities",
      "author": "Test User",
      "platform": "Linux",
      "version": "2.0.0"
    }
  }'
echo -e "\n"
sleep 1

# STEP 7: Get Agent Info
echo "📝 STEP 7: Getting agent info..."
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
echo -e "\n"
sleep 1

# STEP 8: Get Logs
echo "📝 STEP 8: Getting agent logs..."
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=20" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
echo -e "\n"
sleep 1

# STEP 9: Get Log Summary
echo "📝 STEP 9: Getting log summary..."
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" \
  -H "Authorization: Bearer $API_KEY" | python -m json.tool
echo -e "\n"

echo "============================================"
echo "✅ Test Flow Complete!"
echo "============================================"
echo ""
echo "📊 Dashboard URL: http://192.168.15.48:8888/agentic-dashboard.html"
echo "🔍 Agent ID: $AGENT_ID"
echo ""
echo "To delete this test agent, run:"
echo "curl -X DELETE \"$BASE_URL/api/v1/agents/$AGENT_ID\" -H \"Authorization: Bearer $API_KEY\""
```

### Save and Run
```bash
# Save the script
nano complete_test_flow.sh

# Make it executable
chmod +x complete_test_flow.sh

# Run it
./complete_test_flow.sh
```

---

## 8. Cleanup (Optional)

### Deregister Agent
```bash
curl -X DELETE "$BASE_URL/api/v1/agents/$AGENT_ID" \
  -H "Authorization: Bearer $API_KEY"
```

---

## 📚 API Reference Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/agents/register` | POST | Register new agent |
| `/api/v1/agents/{agentId}` | GET | Get agent info |
| `/api/v1/agents/{agentId}` | PUT | Update agent metadata |
| `/api/v1/agents/{agentId}` | DELETE | Deregister agent |
| `/api/v1/agents/{agentId}/status` | PUT | Update agent status (heartbeat) |
| `/api/v1/agents` | GET | List all agents |
| `/api/v1/events` | POST | Send event/log |
| `/api/v1/agents/{agentId}/logs` | GET | Get agent logs |
| `/api/v1/agents/{agentId}/logs/summary` | GET | Get log summary |
| `/api/v1/agents/{agentId}/logs/range` | GET | Get logs by date range |
| `/api/dashboard/overview` | GET | System overview |
| `/api/dashboard/agents` | GET | List all agents (dashboard) |
| `/api/dashboard/events` | GET | Recent events (dashboard) |

---

## 🎯 Quick Tips

1. **Always include the Authorization header** with your API key
2. **Use `date -Iseconds`** for automatic timestamp generation
3. **Check the dashboard** after each operation to see real-time updates
4. **Use `python -m json.tool`** to format JSON responses
5. **Save your AGENT_ID** - you'll need it for all operations
6. **Send events frequently** - they auto-increment the Requests counter
7. **Use A2A events** to demonstrate agent communication
8. **Check logs regularly** to debug issues

---

## 🆘 Troubleshooting

### Issue: "Invalid or missing API key"
**Solution:** Make sure you're using the correct API key: `logixal-agent-api-key-2024`

### Issue: "Agent not found"
**Solution:** Verify your agent is registered using `GET /api/v1/agents/{agentId}`

### Issue: Events not showing in dashboard
**Solution:** 
1. Check if events are being stored: `GET /api/v1/agents/{agentId}/logs`
2. Refresh the dashboard browser page
3. Check server logs for errors

### Issue: Requests counter not increasing
**Solution:** Send more events - each event increments the counter automatically

---

## 📞 Support

For issues or questions during the hackathon, contact:
- **Email:** support@logixal.com
- **Dashboard:** http://192.168.15.48:8888/agentic-dashboard.html
- **API Base URL:** http://192.168.15.48:8000

---

**Good luck with your hackathon! 🚀**

