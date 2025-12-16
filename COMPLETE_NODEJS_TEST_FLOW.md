# 🚀 Complete Node.js Agent Testing Flow

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Complete Test Flow](#complete-test-flow)
4. [PowerShell Commands](#powershell-commands)
5. [Bash/Linux Commands](#bashlinux-commands)
6. [Verification Steps](#verification-steps)

---

## Prerequisites

- **Server URL**: `http://192.168.15.48:8000`
- **Dashboard URL**: `http://192.168.15.48:8888/agentic-dashboard.html`
- **API Key**: `logixal-agent-api-key-2024`
- **Agent ID**: `my_nodejs_agent` (change this to make it unique)

---

## Environment Setup

### For Windows PowerShell Users

```powershell
# Set environment variables for easy reuse
$BASE_URL = "http://192.168.15.48:8000"
$API_KEY = "logixal-agent-api-key-2024"
$AGENT_ID = "my_nodejs_agent"
$MY_EMAIL = "your.email@example.com"  # Change this to your email
```

### For Bash/Linux Users

```bash
# Set environment variables for easy reuse
export BASE_URL="http://192.168.15.48:8000"
export API_KEY="logixal-agent-api-key-2024"
export AGENT_ID="my_nodejs_agent"
export MY_EMAIL="your.email@example.com"  # Change this to your email
```

---

## Complete Test Flow

### Step 1: Register Your Node.js Agent

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    agentName = "My Node.js Agent"
    agentType = "nodejs"
    version = "1.0.0"
    capabilities = @("product_search", "recommendation", "chat")
    endpoint = "http://192.168.15.48:9000"
    healthCheckUrl = "http://192.168.15.48:9000/health"
    metadata = @{
        description = "Node.js hackathon agent for conversational commerce"
        author = "Your Name"
        platform = "Node.js"
        runtime = "Node.js 18+"
        team = "Team Name"
        github = "https://github.com/yourteam/agent"
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/register" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/agents/register" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "agentName": "My Node.js Agent",
  "agentType": "nodejs",
  "version": "1.0.0",
  "capabilities": ["product_search", "recommendation", "chat"],
  "endpoint": "http://192.168.15.48:9000",
  "healthCheckUrl": "http://192.168.15.48:9000/health",
  "metadata": {
    "description": "Node.js hackathon agent for conversational commerce",
    "author": "Your Name",
    "platform": "Node.js",
    "runtime": "Node.js 18+",
    "team": "Team Name",
    "github": "https://github.com/yourteam/agent"
  }
}'
```

**Expected Response:**
```json
{
  "success": true,
  "agentId": "my_nodejs_agent",
  "message": "Agent registered successfully",
  "registeredAt": "2025-11-25T...",
  "dashboardUrl": "http://192.168.15.48:8888/agentic-dashboard.html"
}
```

---

### Step 2: Send Startup Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "STARTUP"
    data = @{
        message = "Node.js agent started successfully"
        status = "initialized"
        runtime = "Node.js 18.17.0"
        memory = "128MB"
    }
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "STARTUP",
  "data": {
    "message": "Node.js agent started successfully",
    "status": "initialized",
    "runtime": "Node.js 18.17.0",
    "memory": "128MB"
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 3: Get Agent Info

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 4: Update Agent Status (Heartbeat)

**PowerShell:**
```powershell
$body = @{
    status = "healthy"
    metadata = @{
        cpu_usage = 25.5
        memory_usage = 256
        active_connections = 5
        uptime_seconds = 120
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/status" `
    -Method PUT `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID/status" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "status": "healthy",
  "metadata": {
    "cpu_usage": 25.5,
    "memory_usage": 256,
    "active_connections": 5,
    "uptime_seconds": 120
  }
}'
```

---

### Step 5: Send Processing Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "INFO"
    data = @{
        message = "Processing user query for product recommendations"
        action = "product_recommendation"
        user_query = "Show me laptops under $1000"
        processing_time_ms = 150
    }
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "INFO",
  "data": {
    "message": "Processing user query for product recommendations",
    "action": "product_recommendation",
    "user_query": "Show me laptops under $1000",
    "processing_time_ms": 150
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 6: Update Agent Capabilities

**PowerShell:**
```powershell
$body = @{
    agentName = "My Enhanced Node.js Agent"
    capabilities = @("product_search", "recommendation", "chat", "sentiment_analysis", "order_tracking")
    metadata = @{
        description = "Enhanced Node.js agent with sentiment analysis"
        author = "Your Name"
        platform = "Node.js"
        runtime = "Node.js 18+"
        version = "2.0.0"
        team = "Team Name"
        features = @("AI-powered search", "Real-time recommendations", "Multi-language support")
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
    -Method PUT `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentName": "My Enhanced Node.js Agent",
  "capabilities": ["product_search", "recommendation", "chat", "sentiment_analysis", "order_tracking"],
  "metadata": {
    "description": "Enhanced Node.js agent with sentiment analysis",
    "author": "Your Name",
    "platform": "Node.js",
    "runtime": "Node.js 18+",
    "version": "2.0.0",
    "team": "Team Name",
    "features": ["AI-powered search", "Real-time recommendations", "Multi-language support"]
  }
}'
```

---

### Step 7: Send Update Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "INFO"
    data = @{
        message = "Agent upgraded to v2.0.0 with sentiment analysis"
        action = "capability_update"
        new_capabilities = @("sentiment_analysis", "order_tracking")
        version = "2.0.0"
    }
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "INFO",
  "data": {
    "message": "Agent upgraded to v2.0.0 with sentiment analysis",
    "action": "capability_update",
    "new_capabilities": ["sentiment_analysis", "order_tracking"],
    "version": "2.0.0"
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 8: Send A2A Message to Notification Agent (Email via Bridge)

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    targetAgent = "notification_agent"
    action = "send_email"
    payload = @{
        user_email = $MY_EMAIL
        subject = "🎉 Test Email from Node.js Agent via A2A Bridge"
        body = "Hello! This email was sent by my Node.js agent ($AGENT_ID) using the A2A Bridge. The integration is working perfectly!"
        user_id = "test_user_nodejs"
        metadata = @{
            agent_type = "nodejs"
            test_type = "a2a_bridge"
            timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
        }
    }
    priority = "high"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/a2a/send" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/a2a/send" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "targetAgent": "notification_agent",
  "action": "send_email",
  "payload": {
    "user_email": "'$MY_EMAIL'",
    "subject": "🎉 Test Email from Node.js Agent via A2A Bridge",
    "body": "Hello! This email was sent by my Node.js agent ('$AGENT_ID') using the A2A Bridge. The integration is working perfectly!",
    "user_id": "test_user_nodejs",
    "metadata": {
      "agent_type": "nodejs",
      "test_type": "a2a_bridge",
      "timestamp": "'$(date -Iseconds)'"
    }
  },
  "priority": "high"
}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "A2A message sent to notification_agent for action send_email",
  "messageId": "a2a_my_nodejs_agent_...",
  "status": "message_queued_for_processing"
}
```

---

### Step 9: Send Another A2A Event (Log Only - for Dashboard)

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "A2A"
    data = @{
        message = "Requesting inventory check from inventory_agent"
        target_agent = "inventory_agent"
        action = "check_inventory"
        payload = @{
            sku = "LAPTOP-DELL-XPS-15"
            quantity_threshold = 5
        }
    }
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "A2A",
  "data": {
    "message": "Requesting inventory check from inventory_agent",
    "target_agent": "inventory_agent",
    "action": "check_inventory",
    "payload": {
      "sku": "LAPTOP-DELL-XPS-15",
      "quantity_threshold": 5
    }
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 10: Send Error Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "ERROR"
    data = @{
        message = "Failed to fetch product data from external API"
        error_code = "API_TIMEOUT"
        error_details = "Request timeout after 30 seconds"
        retry_count = 2
        stack_trace = "Error at productService.js:45"
    }
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "ERROR",
  "data": {
    "message": "Failed to fetch product data from external API",
    "error_code": "API_TIMEOUT",
    "error_details": "Request timeout after 30 seconds",
    "retry_count": 2,
    "stack_trace": "Error at productService.js:45"
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 11: Send Recovery Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "INFO"
    data = @{
        message = "Connection restored, agent back to normal operation"
        action = "recovery"
        previous_error = "API_TIMEOUT"
        recovery_time_seconds = 45
    }
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "INFO",
  "data": {
    "message": "Connection restored, agent back to normal operation",
    "action": "recovery",
    "previous_error": "API_TIMEOUT",
    "recovery_time_seconds": 45
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 12: Get All Agent Logs

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=50" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=50" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 13: Get Only ERROR Logs

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=ERROR&limit=20" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=ERROR&limit=20" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 14: Get Only A2A Logs

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=A2A&limit=20" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=A2A&limit=20" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 15: Get Log Summary

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 16: Get Logs by Date Range

**PowerShell:**
```powershell
$startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
$endDate = (Get-Date).ToString("yyyy-MM-dd")

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=$startDate&end_date=$endDate&limit=100" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
START_DATE=$(date -d '7 days ago' +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)

curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=$START_DATE&end_date=$END_DATE&limit=100" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 17: List All Agents

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents?limit=50&offset=0" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents?limit=50&offset=0" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 18: Get Updated Agent Info

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 19: Delete Agent (Optional - Cleanup)

**PowerShell:**
```powershell
# Uncomment to delete
# Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
#     -Method DELETE `
#     -Headers @{
#         "Authorization" = "Bearer $API_KEY"
#     }
```

**Bash/Linux:**
```bash
# Uncomment to delete
# curl -X DELETE "$BASE_URL/api/v1/agents/$AGENT_ID" \
# -H "Authorization: Bearer $API_KEY"
```

---

## Verification Steps

### 1. Check Dashboard
Open the dashboard in your browser:
```
http://192.168.15.48:8888/agentic-dashboard.html
```

**What to verify:**
- ✅ Your agent (`my_nodejs_agent`) appears in the agents list
- ✅ Agent status shows as "healthy" (green)
- ✅ Request counter is incrementing with each event
- ✅ All events appear in the events timeline
- ✅ Agent metadata (author, platform, version, capabilities) is displayed

### 2. Check Email
- ✅ Check your email inbox for the test email sent in Step 8
- ✅ Subject: "🎉 Test Email from Node.js Agent via A2A Bridge"

### 3. Check Server Logs
**PowerShell:**
```powershell
# If you have SSH access
ssh root@192.168.15.48 "cd /home/oraclevm3/apps/genai/mcp-integrated-vpa/mcp-integrated-vpa && docker-compose logs --tail=100 -f"
```

**What to look for:**
- ✅ No timeout errors
- ✅ No database errors
- ✅ A2A messages being processed
- ✅ Events being logged

---

## 🎯 Success Criteria

After running all steps, you should have:

1. ✅ **Agent Registered** - Visible in dashboard
2. ✅ **10+ Events Sent** - All visible in dashboard timeline
3. ✅ **Agent Updated** - New capabilities and metadata visible
4. ✅ **Email Received** - Test email in your inbox
5. ✅ **Logs Retrieved** - All logs accessible via API
6. ✅ **No Errors** - Clean logs with no timeout or database errors
7. ✅ **Request Counter** - Increments with each event

---

## 📚 Additional Resources

- **Postman Collection**: `Logixal_Agent_AI_Hackathon_Complete.postman_collection.json`
- **Complete Flow Guide**: `COMPLETE_AGENT_FLOW.md`
- **A2A Communication Guide**: `A2A_COMMUNICATION_GUIDE.md`
- **Quick Start**: `QUICK_START.md`
- **Main README**: `HACKATHON_PACKAGE_README.md`

---

## 🆘 Troubleshooting

### Issue: "Invalid or missing API key"
**Solution:** Ensure you're using `logixal-agent-api-key-2024` in the Authorization header.

### Issue: "Agent ID already registered"
**Solution:** Change `$AGENT_ID` to a unique value (e.g., `my_nodejs_agent_v2`).

### Issue: Email not received
**Solution:** 
1. Check spam folder
2. Verify email address in `$MY_EMAIL`
3. Check server logs for email sending confirmation

### Issue: Events not showing in dashboard
**Solution:**
1. Refresh the dashboard page
2. Check that events are being sent successfully (check API responses)
3. Verify database connection on server

---

## 🎉 You're Ready for the Hackathon!

You now have a fully tested Node.js agent integrated with the Logixal Agent AI system. Use this as a foundation to build your hackathon project!

**Good luck! 🚀**


# 🚀 Complete Node.js Agent Testing Flow

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Complete Test Flow](#complete-test-flow)
4. [PowerShell Commands](#powershell-commands)
5. [Bash/Linux Commands](#bashlinux-commands)
6. [Verification Steps](#verification-steps)

---

## Prerequisites

- **Server URL**: `http://192.168.15.48:8000`
- **Dashboard URL**: `http://192.168.15.48:8888/agentic-dashboard.html`
- **API Key**: `logixal-agent-api-key-2024`
- **Agent ID**: `my_nodejs_agent` (change this to make it unique)

---

## Environment Setup

### For Windows PowerShell Users

```powershell
# Set environment variables for easy reuse
$BASE_URL = "http://192.168.15.48:8000"
$API_KEY = "logixal-agent-api-key-2024"
$AGENT_ID = "my_nodejs_agent"
$MY_EMAIL = "your.email@example.com"  # Change this to your email
```

### For Bash/Linux Users

```bash
# Set environment variables for easy reuse
export BASE_URL="http://192.168.15.48:8000"
export API_KEY="logixal-agent-api-key-2024"
export AGENT_ID="my_nodejs_agent"
export MY_EMAIL="your.email@example.com"  # Change this to your email
```

---

## Complete Test Flow

### Step 1: Register Your Node.js Agent

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    agentName = "My Node.js Agent"
    agentType = "nodejs"
    version = "1.0.0"
    capabilities = @("product_search", "recommendation", "chat")
    endpoint = "http://192.168.15.48:9000"
    healthCheckUrl = "http://192.168.15.48:9000/health"
    metadata = @{
        description = "Node.js hackathon agent for conversational commerce"
        author = "Your Name"
        platform = "Node.js"
        runtime = "Node.js 18+"
        team = "Team Name"
        github = "https://github.com/yourteam/agent"
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/register" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/agents/register" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "agentName": "My Node.js Agent",
  "agentType": "nodejs",
  "version": "1.0.0",
  "capabilities": ["product_search", "recommendation", "chat"],
  "endpoint": "http://192.168.15.48:9000",
  "healthCheckUrl": "http://192.168.15.48:9000/health",
  "metadata": {
    "description": "Node.js hackathon agent for conversational commerce",
    "author": "Your Name",
    "platform": "Node.js",
    "runtime": "Node.js 18+",
    "team": "Team Name",
    "github": "https://github.com/yourteam/agent"
  }
}'
```

**Expected Response:**
```json
{
  "success": true,
  "agentId": "my_nodejs_agent",
  "message": "Agent registered successfully",
  "registeredAt": "2025-11-25T...",
  "dashboardUrl": "http://192.168.15.48:8888/agentic-dashboard.html"
}
```

---

### Step 2: Send Startup Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "STARTUP"
    data = @{
        message = "Node.js agent started successfully"
        status = "initialized"
        runtime = "Node.js 18.17.0"
        memory = "128MB"
    }
    timestamp = (Get-Date -Format "o")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "STARTUP",
  "data": {
    "message": "Node.js agent started successfully",
    "status": "initialized",
    "runtime": "Node.js 18.17.0",
    "memory": "128MB"
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 3: Get Agent Info

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 4: Update Agent Status (Heartbeat)

**PowerShell:**
```powershell
$body = @{
    status = "healthy"
    metadata = @{
        cpu_usage = 25.5
        memory_usage = 256
        active_connections = 5
        uptime_seconds = 120
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/status" `
    -Method PUT `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID/status" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "status": "healthy",
  "metadata": {
    "cpu_usage": 25.5,
    "memory_usage": 256,
    "active_connections": 5,
    "uptime_seconds": 120
  }
}'
```

---

### Step 5: Send Processing Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "INFO"
    data = @{
        message = "Processing user query for product recommendations"
        action = "product_recommendation"
        user_query = "Show me laptops under $1000"
        processing_time_ms = 150
    }
    timestamp = (Get-Date -Format "o")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "INFO",
  "data": {
    "message": "Processing user query for product recommendations",
    "action": "product_recommendation",
    "user_query": "Show me laptops under $1000",
    "processing_time_ms": 150
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 6: Update Agent Capabilities

**PowerShell:**
```powershell
$body = @{
    agentName = "My Enhanced Node.js Agent"
    capabilities = @("product_search", "recommendation", "chat", "sentiment_analysis", "order_tracking")
    metadata = @{
        description = "Enhanced Node.js agent with sentiment analysis"
        author = "Your Name"
        platform = "Node.js"
        runtime = "Node.js 18+"
        version = "2.0.0"
        team = "Team Name"
        features = @("AI-powered search", "Real-time recommendations", "Multi-language support")
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
    -Method PUT `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X PUT "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentName": "My Enhanced Node.js Agent",
  "capabilities": ["product_search", "recommendation", "chat", "sentiment_analysis", "order_tracking"],
  "metadata": {
    "description": "Enhanced Node.js agent with sentiment analysis",
    "author": "Your Name",
    "platform": "Node.js",
    "runtime": "Node.js 18+",
    "version": "2.0.0",
    "team": "Team Name",
    "features": ["AI-powered search", "Real-time recommendations", "Multi-language support"]
  }
}'
```

---

### Step 7: Send Update Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "INFO"
    data = @{
        message = "Agent upgraded to v2.0.0 with sentiment analysis"
        action = "capability_update"
        new_capabilities = @("sentiment_analysis", "order_tracking")
        version = "2.0.0"
    }
    timestamp = (Get-Date -Format "o")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "INFO",
  "data": {
    "message": "Agent upgraded to v2.0.0 with sentiment analysis",
    "action": "capability_update",
    "new_capabilities": ["sentiment_analysis", "order_tracking"],
    "version": "2.0.0"
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 8: Send A2A Message to Notification Agent (Email via Bridge)

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    targetAgent = "notification_agent"
    action = "send_email"
    payload = @{
        user_email = $MY_EMAIL
        subject = "🎉 Test Email from Node.js Agent via A2A Bridge"
        body = "Hello! This email was sent by my Node.js agent ($AGENT_ID) using the A2A Bridge. The integration is working perfectly!"
        user_id = "test_user_nodejs"
        metadata = @{
            agent_type = "nodejs"
            test_type = "a2a_bridge"
            timestamp = (Get-Date -Format "o")
        }
    }
    priority = "high"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/a2a/send" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/a2a/send" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "targetAgent": "notification_agent",
  "action": "send_email",
  "payload": {
    "user_email": "'$MY_EMAIL'",
    "subject": "🎉 Test Email from Node.js Agent via A2A Bridge",
    "body": "Hello! This email was sent by my Node.js agent ('$AGENT_ID') using the A2A Bridge. The integration is working perfectly!",
    "user_id": "test_user_nodejs",
    "metadata": {
      "agent_type": "nodejs",
      "test_type": "a2a_bridge",
      "timestamp": "'$(date -Iseconds)'"
    }
  },
  "priority": "high"
}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "A2A message sent to notification_agent for action send_email",
  "messageId": "a2a_my_nodejs_agent_...",
  "status": "message_queued_for_processing"
}
```

---

### Step 9: Send Another A2A Event (Log Only - for Dashboard)

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "A2A"
    data = @{
        message = "Requesting inventory check from inventory_agent"
        target_agent = "inventory_agent"
        action = "check_inventory"
        payload = @{
            sku = "LAPTOP-DELL-XPS-15"
            quantity_threshold = 5
        }
    }
    timestamp = (Get-Date -Format "o")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "A2A",
  "data": {
    "message": "Requesting inventory check from inventory_agent",
    "target_agent": "inventory_agent",
    "action": "check_inventory",
    "payload": {
      "sku": "LAPTOP-DELL-XPS-15",
      "quantity_threshold": 5
    }
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 10: Send Error Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "ERROR"
    data = @{
        message = "Failed to fetch product data from external API"
        error_code = "API_TIMEOUT"
        error_details = "Request timeout after 30 seconds"
        retry_count = 2
        stack_trace = "Error at productService.js:45"
    }
    timestamp = (Get-Date -Format "o")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "ERROR",
  "data": {
    "message": "Failed to fetch product data from external API",
    "error_code": "API_TIMEOUT",
    "error_details": "Request timeout after 30 seconds",
    "retry_count": 2,
    "stack_trace": "Error at productService.js:45"
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 11: Send Recovery Event

**PowerShell:**
```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "INFO"
    data = @{
        message = "Connection restored, agent back to normal operation"
        action = "recovery"
        previous_error = "API_TIMEOUT"
        recovery_time_seconds = 45
    }
    timestamp = (Get-Date -Format "o")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $API_KEY"
    } `
    -Body $body
```

**Bash/Linux:**
```bash
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "INFO",
  "data": {
    "message": "Connection restored, agent back to normal operation",
    "action": "recovery",
    "previous_error": "API_TIMEOUT",
    "recovery_time_seconds": 45
  },
  "timestamp": "'$(date -Iseconds)'"
}'
```

---

### Step 12: Get All Agent Logs

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=50" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=50" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 13: Get Only ERROR Logs

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=ERROR&limit=20" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=ERROR&limit=20" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 14: Get Only A2A Logs

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=A2A&limit=20" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=A2A&limit=20" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 15: Get Log Summary

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 16: Get Logs by Date Range

**PowerShell:**
```powershell
$startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
$endDate = (Get-Date).ToString("yyyy-MM-dd")

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=$startDate&end_date=$endDate&limit=100" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
START_DATE=$(date -d '7 days ago' +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)

curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=$START_DATE&end_date=$END_DATE&limit=100" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 17: List All Agents

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents?limit=50&offset=0" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents?limit=50&offset=0" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 18: Get Updated Agent Info

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
    -Method GET `
    -Headers @{
        "Authorization" = "Bearer $API_KEY"
    }
```

**Bash/Linux:**
```bash
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Authorization: Bearer $API_KEY"
```

---

### Step 19: Delete Agent (Optional - Cleanup)

**PowerShell:**
```powershell
# Uncomment to delete
# Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" `
#     -Method DELETE `
#     -Headers @{
#         "Authorization" = "Bearer $API_KEY"
#     }
```

**Bash/Linux:**
```bash
# Uncomment to delete
# curl -X DELETE "$BASE_URL/api/v1/agents/$AGENT_ID" \
# -H "Authorization: Bearer $API_KEY"
```

---

## Verification Steps

### 1. Check Dashboard
Open the dashboard in your browser:
```
http://192.168.15.48:8888/agentic-dashboard.html
```

**What to verify:**
- ✅ Your agent (`my_nodejs_agent`) appears in the agents list
- ✅ Agent status shows as "healthy" (green)
- ✅ Request counter is incrementing with each event
- ✅ All events appear in the events timeline
- ✅ Agent metadata (author, platform, version, capabilities) is displayed

### 2. Check Email
- ✅ Check your email inbox for the test email sent in Step 8
- ✅ Subject: "🎉 Test Email from Node.js Agent via A2A Bridge"

### 3. Check Server Logs
**PowerShell:**
```powershell
# If you have SSH access
ssh root@192.168.15.48 "cd /home/oraclevm3/apps/genai/mcp-integrated-vpa/mcp-integrated-vpa && docker-compose logs --tail=100 -f"
```

**What to look for:**
- ✅ No timeout errors
- ✅ No database errors
- ✅ A2A messages being processed
- ✅ Events being logged

---

## 🎯 Success Criteria

After running all steps, you should have:

1. ✅ **Agent Registered** - Visible in dashboard
2. ✅ **10+ Events Sent** - All visible in dashboard timeline
3. ✅ **Agent Updated** - New capabilities and metadata visible
4. ✅ **Email Received** - Test email in your inbox
5. ✅ **Logs Retrieved** - All logs accessible via API
6. ✅ **No Errors** - Clean logs with no timeout or database errors
7. ✅ **Request Counter** - Increments with each event

---

## 📚 Additional Resources

- **Postman Collection**: `Logixal_Agent_AI_Hackathon_Complete.postman_collection.json`
- **Complete Flow Guide**: `COMPLETE_AGENT_FLOW.md`
- **A2A Communication Guide**: `A2A_COMMUNICATION_GUIDE.md`
- **Quick Start**: `QUICK_START.md`
- **Main README**: `HACKATHON_PACKAGE_README.md`

---

## 🆘 Troubleshooting

### Issue: "Invalid or missing API key"
**Solution:** Ensure you're using `logixal-agent-api-key-2024` in the Authorization header.

### Issue: "Agent ID already registered"
**Solution:** Change `$AGENT_ID` to a unique value (e.g., `my_nodejs_agent_v2`).

### Issue: Email not received
**Solution:** 
1. Check spam folder
2. Verify email address in `$MY_EMAIL`
3. Check server logs for email sending confirmation

### Issue: Events not showing in dashboard
**Solution:**
1. Refresh the dashboard page
2. Check that events are being sent successfully (check API responses)
3. Verify database connection on server

---

## 🎉 You're Ready for the Hackathon!

You now have a fully tested Node.js agent integrated with the Logixal Agent AI system. Use this as a foundation to build your hackathon project!

**Good luck! 🚀**

