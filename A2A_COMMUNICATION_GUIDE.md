# 🔄 A2A Communication Guide - Actually Send Emails!

## 📧 Problem: Why Emails Weren't Being Sent

When you send an A2A event via `POST /api/v1/events`, it only **logs the event** in the database. The notification agent doesn't automatically process these events because:

1. **External agents** send events to the database
2. **Built-in agents** (notification_agent, inventory_agent) use an internal message queue
3. There was **no bridge** between them

## ✅ Solution: A2A Bridge Endpoint

We've created a **new endpoint** that bridges external agents to built-in agents:

```
POST /api/v1/a2a/send
```

This endpoint:
- ✅ Receives A2A requests from external agents
- ✅ Translates them to internal A2A protocol
- ✅ Routes them to built-in agents (notification_agent, etc.)
- ✅ **Actually triggers email sending**
- ✅ Logs the event in the dashboard

---

## 🚀 How to Send Email via A2A (NEW!)

### Method 1: Using A2A Bridge (Recommended)

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "notification_agent",
    "action": "send_email",
    "payload": {
      "user_email": "arvind.hariharan@logixal.com",
      "subject": "Test Email from Hackathon Agent",
      "body": "This email was sent via A2A Bridge! 🎉",
      "user_id": "test_user",
      "sku_id": "N/A"
    },
    "priority": "high"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "A2A message sent to notification_agent",
  "agentId": "hackathon_agent_001",
  "targetAgent": "notification_agent",
  "action": "send_email",
  "response": {
    "status": "sent",
    "channel": "email",
    "notification_id": "notif_123456"
  },
  "timestamp": "2025-11-25T17:00:00+05:30"
}
```

### Method 2: Simplified Email Endpoint

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/a2a/email?agentId=hackathon_agent_001&to=arvind.hariharan@logixal.com&subject=Test&body=Hello" \
  -H "Authorization: Bearer logixal-agent-api-key-2024"
```

---

## 📋 Complete A2A Examples

### 1. Send Email Notification

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "notification_agent",
    "action": "send_email",
    "payload": {
      "user_email": "customer@example.com",
      "subject": "Product Recommendation",
      "body": "Based on your browsing history, we recommend these products...",
      "user_id": "user_12345",
      "sku_id": "PRODUCT-001"
    },
    "priority": "normal"
  }'
```

### 2. Send OOS (Out of Stock) Notification

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "notification_agent",
    "action": "send_oos_notification",
    "payload": {
      "user_id": "user_12345",
      "user_email": "customer@example.com",
      "sku_id": "LAPTOP-001",
      "product_name": "Gaming Laptop",
      "urgency": "high"
    },
    "priority": "high"
  }'
```

### 3. Check Inventory (Query Inventory Agent)

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
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

### 4. Broadcast System Alert

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "all",
    "action": "broadcast",
    "payload": {
      "alert_type": "maintenance",
      "message": "System maintenance in 30 minutes",
      "scheduled_time": "'$(date -d '+30 minutes' -Iseconds)'"
    },
    "priority": "high"
  }'
```

---

## 🔍 Difference Between Endpoints

### `POST /api/v1/events` (Event Logging Only)
- ✅ Logs event in database
- ✅ Shows in dashboard
- ✅ Increments request counter
- ❌ **Does NOT trigger built-in agents**
- ❌ **Does NOT send emails**

**Use for:** Logging, tracking, dashboard visibility

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hackathon_agent_001",
    "eventType": "A2A",
    "data": {"message": "Logged but not processed"},
    "timestamp": "'$(date -Iseconds)'"
  }'
```

### `POST /api/v1/a2a/send` (A2A Bridge - NEW!)
- ✅ Logs event in database
- ✅ Shows in dashboard
- ✅ Increments request counter
- ✅ **Triggers built-in agents**
- ✅ **Actually sends emails**
- ✅ Returns response from target agent

**Use for:** Actually executing actions (sending emails, checking inventory, etc.)

```bash
curl -X POST "http://192.168.15.48:8000/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer logixal-agent-api-key-2024" \
  -d '{
    "agentId": "hackathon_agent_001",
    "targetAgent": "notification_agent",
    "action": "send_email",
    "payload": {
      "user_email": "test@example.com",
      "subject": "Test",
      "body": "This will actually send!"
    }
  }'
```

---

## 🎯 Supported Actions

| Action | Target Agent | Description |
|--------|--------------|-------------|
| `send_email` | notification_agent | Send email to user |
| `send_oos_notification` | notification_agent | Send OOS alert email |
| `send_notification` | notification_agent | Generic notification |
| `check_inventory` | inventory_agent | Check product stock |
| `broadcast` | all | Broadcast to all agents |

---

## 📊 What You'll See

### In Dashboard:
1. **Recent Events** section shows the A2A message
2. **Hackathon Agent** request counter increases
3. **Notification Agent** shows email sent (if you check its logs)

### In Your Email:
You should receive the actual email! 📧

---

## 🧪 Complete Test Flow

```bash
#!/bin/bash

BASE_URL="http://192.168.15.48:8000"
API_KEY="logixal-agent-api-key-2024"
AGENT_ID="hackathon_agent_001"
EMAIL="arvind.hariharan@logixal.com"

echo "============================================"
echo "📧 Testing A2A Email Sending"
echo "============================================"
echo ""

# Test 1: Send test email
echo "📧 Sending test email to $EMAIL..."
curl -X POST "$BASE_URL/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "targetAgent": "notification_agent",
    "action": "send_email",
    "payload": {
      "user_email": "'$EMAIL'",
      "subject": "A2A Test Email from Hackathon Agent",
      "body": "This email was sent via the new A2A Bridge endpoint! If you receive this, the integration is working perfectly. 🎉",
      "user_id": "test_user",
      "sku_id": "TEST-001"
    },
    "priority": "high"
  }'
echo -e "\n"
sleep 2

# Test 2: Send OOS notification
echo "📧 Sending OOS notification..."
curl -X POST "$BASE_URL/api/v1/a2a/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentId": "'$AGENT_ID'",
    "targetAgent": "notification_agent",
    "action": "send_oos_notification",
    "payload": {
      "user_id": "test_user",
      "user_email": "'$EMAIL'",
      "sku_id": "LAPTOP-001",
      "product_name": "Gaming Laptop",
      "urgency": "high"
    },
    "priority": "high"
  }'
echo -e "\n"

echo "============================================"
echo "✅ Test Complete!"
echo "============================================"
echo ""
echo "📧 Check your email: $EMAIL"
echo "📊 Check dashboard: http://192.168.15.48:8888/agentic-dashboard.html"
```

---

## 🐛 Troubleshooting

### Issue: Still no email received
**Check:**
1. Is the notification agent running? Check dashboard
2. Are SMTP credentials configured correctly?
3. Check spam/junk folder
4. Check server logs for email sending errors

### Issue: "Target agent not found"
**Solution:** Make sure built-in agents are started. Check:
```bash
curl -X GET "http://192.168.15.48:8000/api/dashboard/agents"
```

### Issue: "Invalid or missing API key"
**Solution:** Use `logixal-agent-api-key-2024` in Authorization header

---

## 📞 Summary

### ✅ To Actually Send Emails:
Use `POST /api/v1/a2a/send` (NEW!)

### ✅ To Just Log Events:
Use `POST /api/v1/events` (existing)

### ✅ Both endpoints:
- Log to database
- Show in dashboard
- Increment request counter

### ✅ Only A2A Bridge:
- **Actually triggers built-in agents**
- **Actually sends emails**
- Returns response from target agent

---

**Now try it and check your email! 📧🎉**

