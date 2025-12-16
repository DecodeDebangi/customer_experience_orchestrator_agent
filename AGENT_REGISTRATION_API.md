# 📡 Agent Registration API Documentation

## Overview

The Agent Registration API allows developers to register their agents with the Logixal Agent AI platform, making them visible in the dashboard and enabling A2A communication.

**Base URL:** `http://192.168.15.48:8000/api/v1`

**Authentication:** Bearer token (provided by organizers)

---

## 🔐 Authentication

All API requests require an API key passed as a Bearer token:

```bash
Authorization: Bearer YOUR_API_KEY_HERE
```

To get your API key:
1. Contact hackathon organizers
2. Or check your `.env` file from the starter kit

---

## 📋 API Endpoints

### 1. Register Agent

Register a new agent with the platform.

**Endpoint:** `POST /agents/register`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Request Body:**

```json
{
  "agentId": "string (required, unique)",
  "agentName": "string (required)",
  "agentType": "string (required)",
  "version": "string (required)",
  "capabilities": ["string"] (required, array),
  "endpoint": "string (required, http://host:port)",
  "healthCheckUrl": "string (required)",
  "metadata": {
    "description": "string (optional)",
    "author": "string (optional)",
    "platform": "string (optional, e.g., VTEX, CT, ATG)",
    "tags": ["string"] (optional)
  }
}
```

**Example Request:**

```bash
curl -X POST http://192.168.15.48:8000/api/v1/agents/register \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "inventory_monitor_agent",
    "agentName": "Inventory Monitor Agent",
    "agentType": "inventory",
    "version": "1.0.0",
    "capabilities": [
      "check_inventory",
      "subscribe_to_alerts",
      "notify_restock"
    ],
    "endpoint": "http://myserver.com:8080",
    "healthCheckUrl": "http://myserver.com:8080/health",
    "metadata": {
      "description": "Monitors product inventory and sends OOS/restock alerts",
      "author": "John Doe",
      "platform": "VTEX",
      "tags": ["inventory", "notifications", "commerce"]
    }
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "agentId": "inventory_monitor_agent",
  "message": "Agent registered successfully",
  "registeredAt": "2025-11-20T10:30:00Z",
  "dashboardUrl": "https://dashboard.logixal.com/agentic-dashboard.html"
}
```

**Error Responses:**

**400 Bad Request** - Invalid request data
```json
{
  "success": false,
  "error": "Missing required field: agentId"
}
```

**409 Conflict** - Agent ID already exists
```json
{
  "success": false,
  "error": "Agent ID 'inventory_monitor_agent' already registered"
}
```

**401 Unauthorized** - Invalid or missing API key
```json
{
  "success": false,
  "error": "Invalid API key"
}
```

---

### 2. Update Agent Status

Update agent health and metrics (typically called from background task).

**Endpoint:** `PUT /agents/{agentId}/status`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Request Body:**

```json
{
  "status": "string (required: healthy | degraded | unhealthy)",
  "metrics": {
    "uptimeSeconds": "number",
    "messagesProcessed": "number",
    "messagesSent": "number",
    "errorCount": "number",
    "customMetrics": {
      "key": "value"
    }
  }
}
```

**Example Request:**

```bash
curl -X PUT http://192.168.15.48:8000/api/v1/agents/inventory_monitor_agent/status \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "healthy",
    "metrics": {
      "uptimeSeconds": 3600,
      "messagesProcessed": 150,
      "messagesSent": 45,
      "errorCount": 0,
      "customMetrics": {
        "skusMonitored": 25,
        "alertsSent": 12
      }
    }
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "agentId": "inventory_monitor_agent",
  "status": "healthy",
  "updatedAt": "2025-11-20T10:35:00Z"
}
```

---

### 3. Send Agent Event

Log an event from your agent to be tracked in the dashboard.

**Endpoint:** `POST /events`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Request Body:**

```json
{
  "agentId": "string (required)",
  "eventType": "string (required)",
  "data": {
    "key": "value"
  },
  "timestamp": "string (ISO 8601, required)"
}
```

**Example Request:**

```bash
curl -X POST http://192.168.15.48:8000/api/v1/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "inventory_monitor_agent",
    "eventType": "oos_detected",
    "data": {
      "skuId": "175",
      "previousStock": 5,
      "currentStock": 0,
      "subscriberCount": 3
    },
    "timestamp": "2025-11-20T10:40:00Z"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "eventId": "evt_abc123",
  "message": "Event recorded successfully"
}
```

**Example Common Event Types:**

| Event Type | Description | When to Use |
|------------|-------------|-------------|
| `task_started` | Task execution started | Beginning of long-running task |
| `task_completed` | Task finished successfully | Task success |
| `task_failed` | Task failed with error | Task failure |
| `oos_detected` | Out of stock detected | Inventory monitoring |
| `restock_detected` | Item back in stock | Inventory monitoring |
| `notification_sent` | Notification delivered | After sending alerts |
| `data_synced` | Data synchronized | After sync operations |
| `threshold_exceeded` | Metric threshold crossed | Performance monitoring |

---

### 4. Get Agent Status

Retrieve current status of a registered agent.

**Endpoint:** `GET /agents/{agentId}`

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
```

**Example Request:**

```bash
curl http://192.168.15.48:8000/api/v1/agents/inventory_monitor_agent \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response (200 OK):**

```json
{
  "agentId": "inventory_monitor_agent",
  "agentName": "Inventory Monitor Agent",
  "agentType": "inventory",
  "version": "1.0.0",
  "status": "healthy",
  "capabilities": [
    "check_inventory",
    "subscribe_to_alerts",
    "notify_restock"
  ],
  "endpoint": "http://myserver.com:8080",
  "healthCheckUrl": "http://myserver.com:8080/health",
  "registeredAt": "2025-11-20T10:30:00Z",
  "lastStatusUpdate": "2025-11-20T10:35:00Z",
  "metrics": {
    "uptimeSeconds": 3600,
    "messagesProcessed": 150,
    "messagesSent": 45,
    "errorCount": 0
  },
  "metadata": {
    "description": "Monitors product inventory and sends OOS/restock alerts",
    "author": "John Doe",
    "platform": "VTEX"
  }
}
```

---

### 5. List All Agents

Get a list of all registered agents (admin only).

**Endpoint:** `GET /agents`

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
```

**Query Parameters:**
- `type` (optional): Filter by agent type
- `status` (optional): Filter by status (healthy, degraded, unhealthy)
- `limit` (optional): Max results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**

```bash
curl "http://192.168.15.48:8000/api/v1/agents?type=inventory&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response (200 OK):**

```json
{
  "success": true,
  "total": 15,
  "limit": 10,
  "offset": 0,
  "agents": [
    {
      "agentId": "inventory_monitor_agent",
      "agentName": "Inventory Monitor Agent",
      "agentType": "inventory",
      "status": "healthy",
      "version": "1.0.0",
      "registeredAt": "2025-11-20T10:30:00Z"
    }
    // ... more agents
  ]
}
```

---

### 6. Deregister Agent

Remove an agent from the registry (use with caution).

**Endpoint:** `DELETE /agents/{agentId}`

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
```

**Example Request:**

```bash
curl -X DELETE http://192.168.15.48:8000/api/v1/agents/inventory_monitor_agent \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response (200 OK):**

```json
{
  "success": true,
  "agentId": "inventory_monitor_agent",
  "message": "Agent deregistered successfully"
}
```

---

## 🔄 Agent Lifecycle

```
1. REGISTER
   └─> POST /agents/register
       └─> Agent appears in dashboard

2. HEARTBEAT (every 30-60s)
   └─> PUT /agents/{agentId}/status
       └─> Dashboard shows "healthy"

3. LOG EVENTS
   └─> POST /events
       └─> Events appear in dashboard

4. DEREGISTER (optional)
   └─> DELETE /agents/{agentId}
       └─> Agent removed from dashboard
```

---

## 🛠️ Integration Examples

### Python Example

```python
import httpx
from typing import Dict, Any

class LogAgentClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    async def register_agent(self, registration: Dict[str, Any]) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{self.base_url}/agents/register',
                headers=self.headers,
                json=registration
            )
            return response.json()
    
    async def update_status(self, agent_id: str, status: str, metrics: Dict[str, Any]):
        async with httpx.AsyncClient() as client:
            response = await client.put(
                f'{self.base_url}/agents/{agent_id}/status',
                headers=self.headers,
                json={'status': status, 'metrics': metrics}
            )
            return response.json()
    
    async def send_event(self, agent_id: str, event_type: str, data: Dict[str, Any]):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{self.base_url}/events',
                headers=self.headers,
                json={
                    'agentId': agent_id,
                    'eventType': event_type,
                    'data': data,
                    'timestamp': datetime.now(timezone.utc).isoformat()
                }
            )
            return response.json()
```

### TypeScript Example

```typescript
import axios, { AxiosInstance } from 'axios';

class LogAgentClient {
  private client: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async registerAgent(registration: any): Promise<any> {
    const response = await this.client.post('/agents/register', registration);
    return response.data;
  }

  async updateStatus(agentId: string, status: string, metrics: any): Promise<any> {
    const response = await this.client.put(`/agents/${agentId}/status`, {
      status,
      metrics
    });
    return response.data;
  }

  async sendEvent(agentId: string, eventType: string, data: any): Promise<any> {
    const response = await this.client.post('/events', {
      agentId,
      eventType,
      data,
      timestamp: new Date().toISOString()
    });
    return response.data;
  }
}
```

---

## ✅ Best Practices

### 1. **Heartbeat Frequency**
- Send status updates every 30-60 seconds
- Use background task for heartbeats
- Include updated metrics each time

### 2. **Error Handling**
- Always wrap API calls in try-catch
- Log errors but don't crash your agent
- Retry failed registrations with exponential backoff

### 3. **Event Logging**
- Log significant events only (don't spam)
- Include relevant context in `data` field
- Use consistent event types

### 4. **Agent ID Naming**
- Use lowercase with underscores: `my_agent_name`
- Include agent type: `inventory_monitor_agent`
- Keep it unique and descriptive

### 5. **Metadata**
- Provide detailed description
- Include your name/team
- Specify platform (VTEX, CT, ATG, etc.)
- Add relevant tags for discoverability

---

## 🐛 Troubleshooting

### Registration Fails with 409 Conflict
- **Problem:** Agent ID already registered
- **Solution:** Choose a unique agent ID or deregister the old one

### Agent Not Visible in Dashboard
- **Problem:** Registration succeeded but agent doesn't appear
- **Solution:** Check dashboard URL, refresh page, verify heartbeat is running

### 401 Unauthorized Errors
- **Problem:** Invalid or missing API key
- **Solution:** Verify API key in `.env`, contact organizers for new key

### Health Check Fails
- **Problem:** Dashboard can't reach agent's health endpoint
- **Solution:** Ensure agent is publicly accessible, check firewall, verify URL

---

## 📚 Related Documentation

- [Quick Start Guide](./HACKATHON_QUICK_START.md)
- [30 Use Cases](./HACKATHON_30_USE_CASES.md)
- [Python Template](./agent-ai-python-template/README.md)
- [Node.js Template](./agent-ai-nodejs-template/README.md)
- [Postman Collection](./Logixal_Agent_AI_Hackathon.postman_collection.json)

---

