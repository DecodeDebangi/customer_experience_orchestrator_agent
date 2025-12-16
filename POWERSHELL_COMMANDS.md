# 🚀 PowerShell Commands - Copy & Paste One by One

## ⚙️ Setup Variables (Run This First)

```powershell
$BASE_URL = "http://192.168.15.48:8000"
$API_KEY = "logixal-agent-api-key-2024"
$AGENT_ID = "my_nodejs_agent"
$MY_EMAIL = "arvind.hariharan@logixal.com"
```

---

## 📝 STEP 1: Register Agent

```powershell
$body = @{
    agentId = $AGENT_ID
    agentName = "My Node.js Agent"
    agentType = "nodejs"
    version = "1.0.0"
    capabilities = @("product_search", "recommendation", "chat")
    endpoint = "http://192.168.15.48:8000"
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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/register" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 📤 STEP 2: Send Startup Event

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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 🔍 STEP 3: Get Agent Info

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 💓 STEP 4: Update Agent Status (Heartbeat)

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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/status" -Method PUT -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 📊 STEP 5: Send Processing Event

```powershell
$body = @{
    agentId = $AGENT_ID
    eventType = "INFO"
    data = @{
        message = "Processing user query for product recommendations"
        action = "product_recommendation"
        user_query = "Show me laptops under 1000 dollars"
        processing_time_ms = 150
    }
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 🔄 STEP 6: Update Agent Capabilities

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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" -Method PUT -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 📢 STEP 7: Send Update Event

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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 📧 STEP 8: Send A2A Email (via Bridge)

```powershell
$body = @{
    agentId = $AGENT_ID
    targetAgent = "notification_agent"
    action = "send_email"
    payload = @{
        user_email = $MY_EMAIL
        subject = "Test Email from Node.js Agent via A2A Bridge"
        body = "Hello! This email was sent by my Node.js agent using the A2A Bridge. The integration is working perfectly!"
        user_id = "test_user_nodejs"
        metadata = @{
            agent_type = "nodejs"
            test_type = "a2a_bridge"
            timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.ffffffzzz")
        }
    }
    priority = "high"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$BASE_URL/api/v1/a2a/send" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 🔗 STEP 9: Send A2A Event (Log Only)

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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## ❌ STEP 10: Send Error Event

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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## ✅ STEP 11: Send Recovery Event

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

Invoke-RestMethod -Uri "$BASE_URL/api/v1/events" -Method POST -Headers @{"Content-Type"="application/json";"Authorization"="Bearer $API_KEY"} -Body $body
```

---

## 📋 STEP 12: Get All Agent Logs

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=50" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 🔴 STEP 13: Get Only ERROR Logs

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=ERROR&limit=20" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 🔗 STEP 14: Get Only A2A Logs

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=A2A&limit=20" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 📊 STEP 15: Get Log Summary

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 📅 STEP 16: Get Logs by Date Range

```powershell
$startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
$endDate = (Get-Date).ToString("yyyy-MM-dd")
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=$startDate&end_date=$endDate&limit=100" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 📜 STEP 17: List All Agents

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents?limit=50&offset=0" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 🔍 STEP 18: Get Updated Agent Info

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" -Method GET -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 🗑️ STEP 19: Delete Agent (Optional - Cleanup)

```powershell
Invoke-RestMethod -Uri "$BASE_URL/api/v1/agents/$AGENT_ID" -Method DELETE -Headers @{"Authorization"="Bearer $API_KEY"}
```

---

## 🎯 Quick Verification Commands

### Check Dashboard
```powershell
Start-Process "http://192.168.15.48:8888/agentic-dashboard.html"
```

### Get Dashboard Overview
```powershell
Invoke-RestMethod -Uri "http://192.168.15.48:8000/api/dashboard/overview" -Method GET
```

### Get Dashboard Events
```powershell
Invoke-RestMethod -Uri "http://192.168.15.48:8000/api/dashboard/events?limit=20" -Method GET
```

### Get Dashboard Agents
```powershell
Invoke-RestMethod -Uri "http://192.168.15.48:8000/api/dashboard/agents" -Method GET
```

---

## 📝 Notes

1. **Run the Setup Variables first** before running any other commands
2. **Change `$AGENT_ID`** to make it unique (e.g., `my_nodejs_agent_v2`)
3. **Change `$MY_EMAIL`** to your actual email address
4. **Copy each command** one by one and paste into PowerShell
5. **Check the response** after each command to ensure success
6. **Check the dashboard** after sending events to see them appear in real-time

---

## ✅ Success Indicators

After running all commands, you should see:

- ✅ Agent registered and visible in dashboard
- ✅ 10+ events sent and visible in dashboard timeline
- ✅ Agent capabilities updated
- ✅ Email received in your inbox
- ✅ Logs retrieved successfully via API
- ✅ Request counter incrementing with each event
- ✅ No errors in responses

---

## 🆘 Troubleshooting

### If you get "Agent already registered" error:
```powershell
# Change the agent ID
$AGENT_ID = "my_nodejs_agent_v2"
```

### If you get "Invalid API key" error:
```powershell
# Verify the API key
$API_KEY = "logixal-agent-api-key-2024"
```

### To see formatted JSON responses:
```powershell
# Add this to any command
Invoke-RestMethod ... | ConvertTo-Json -Depth 10
```

---

## 🎉 You're Ready!

Copy and paste these commands one by one to test your Node.js agent integration!

