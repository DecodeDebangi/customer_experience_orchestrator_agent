#!/bin/bash
# ============================================================================
# Bash Commands - Copy & Paste One by One
# ============================================================================

# ⚙️ Setup Variables (Run This First)
export BASE_URL="http://192.168.15.48:8000"
export API_KEY="logixal-agent-api-key-2024"
export AGENT_ID="my_nodejs_agent"
export MY_EMAIL="arvind.hariharan@logixal.com"

echo "✅ Variables set:"
echo "   BASE_URL: $BASE_URL"
echo "   AGENT_ID: $AGENT_ID"
echo "   MY_EMAIL: $MY_EMAIL"

# ============================================================================
# STEP 1: Register Agent
# ============================================================================
echo -e "\n📝 STEP 1: Register Agent"
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

# ============================================================================
# STEP 2: Send Startup Event
# ============================================================================
echo -e "\n\n📤 STEP 2: Send Startup Event"
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

# ============================================================================
# STEP 3: Get Agent Info
# ============================================================================
echo -e "\n\n🔍 STEP 3: Get Agent Info"
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 4: Update Agent Status (Heartbeat)
# ============================================================================
echo -e "\n\n💓 STEP 4: Update Agent Status (Heartbeat)"
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

# ============================================================================
# STEP 5: Send Processing Event
# ============================================================================
echo -e "\n\n📊 STEP 5: Send Processing Event"
curl -X POST "$BASE_URL/api/v1/events" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "eventType": "INFO",
  "data": {
    "message": "Processing user query for product recommendations",
    "action": "product_recommendation",
    "user_query": "Show me laptops under 1000 dollars",
    "processing_time_ms": 150
  },
  "timestamp": "'$(date -Iseconds)'"
}'

# ============================================================================
# STEP 6: Update Agent Capabilities
# ============================================================================
echo -e "\n\n🔄 STEP 6: Update Agent Capabilities"
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

# ============================================================================
# STEP 7: Send Update Event
# ============================================================================
echo -e "\n\n📢 STEP 7: Send Update Event"
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

# ============================================================================
# STEP 8: Send A2A Email (via Bridge)
# ============================================================================
echo -e "\n\n📧 STEP 8: Send A2A Email (via Bridge)"
curl -X POST "$BASE_URL/api/v1/a2a/send" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $API_KEY" \
-d '{
  "agentId": "'$AGENT_ID'",
  "targetAgent": "notification_agent",
  "action": "send_email",
  "payload": {
    "user_email": "'$MY_EMAIL'",
    "subject": "Test Email from Node.js Agent via A2A Bridge",
    "body": "Hello! This email was sent by my Node.js agent using the A2A Bridge. The integration is working perfectly!",
    "user_id": "test_user_nodejs",
    "metadata": {
      "agent_type": "nodejs",
      "test_type": "a2a_bridge",
      "timestamp": "'$(date -Iseconds)'"
    }
  },
  "priority": "high"
}'

echo -e "\n📧 Check your email at: $MY_EMAIL"

# ============================================================================
# STEP 9: Send A2A Event (Log Only)
# ============================================================================
echo -e "\n\n🔗 STEP 9: Send A2A Event (Log Only)"
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

# ============================================================================
# STEP 10: Send Error Event
# ============================================================================
echo -e "\n\n❌ STEP 10: Send Error Event"
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

# ============================================================================
# STEP 11: Send Recovery Event
# ============================================================================
echo -e "\n\n✅ STEP 11: Send Recovery Event"
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

# ============================================================================
# STEP 12: Get All Agent Logs
# ============================================================================
echo -e "\n\n📋 STEP 12: Get All Agent Logs"
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?limit=50" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 13: Get Only ERROR Logs
# ============================================================================
echo -e "\n\n🔴 STEP 13: Get Only ERROR Logs"
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=ERROR&limit=20" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 14: Get Only A2A Logs
# ============================================================================
echo -e "\n\n🔗 STEP 14: Get Only A2A Logs"
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs?event_type=A2A&limit=20" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 15: Get Log Summary
# ============================================================================
echo -e "\n\n📊 STEP 15: Get Log Summary"
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/summary" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 16: Get Logs by Date Range
# ============================================================================
echo -e "\n\n📅 STEP 16: Get Logs by Date Range"
START_DATE=$(date -d '7 days ago' +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID/logs/range?start_date=$START_DATE&end_date=$END_DATE&limit=100" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 17: List All Agents
# ============================================================================
echo -e "\n\n📜 STEP 17: List All Agents"
curl -X GET "$BASE_URL/api/v1/agents?limit=50&offset=0" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 18: Get Updated Agent Info
# ============================================================================
echo -e "\n\n🔍 STEP 18: Get Updated Agent Info"
curl -X GET "$BASE_URL/api/v1/agents/$AGENT_ID" \
-H "Authorization: Bearer $API_KEY"

# ============================================================================
# STEP 19: Delete Agent (Optional - Cleanup)
# ============================================================================
echo -e "\n\n🗑️ STEP 19: Delete Agent (Optional - Uncomment to run)"
# curl -X DELETE "$BASE_URL/api/v1/agents/$AGENT_ID" \
# -H "Authorization: Bearer $API_KEY"

# ============================================================================
# Summary
# ============================================================================
echo -e "\n\n============================================================================"
echo "✅ TEST FLOW COMPLETE!"
echo "============================================================================"
echo "Agent ID: $AGENT_ID"
echo ""
echo "Next Steps:"
echo "1. Check dashboard: http://192.168.15.48:8888/agentic-dashboard.html"
echo "2. Check your email: $MY_EMAIL"
echo "3. Verify all events are visible in the dashboard"
echo "4. Check that request counter is incrementing"
echo ""
echo "To delete the test agent, run:"
echo "curl -X DELETE \"$BASE_URL/api/v1/agents/$AGENT_ID\" -H \"Authorization: Bearer $API_KEY\""
echo "============================================================================"

