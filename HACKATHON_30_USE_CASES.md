# 🎯 Logixal Agent AI Hackathon - 30 Use Cases

## Overview
Choose ONE use case from below, implement it using our agent templates, and register it with LogAgent!

**Difficulty Legend:**
- 🟢 Easy (Good for beginners)
- 🟡 Medium (Requires commerce platform knowledge)
- 🔴 Hard (Complex logic or multiple integrations)

---

## 📦 VTEX Use Cases (10)

### 1. **Inventory Out-of-Stock Alert Agent** 🟡
**Description:** Monitor SKU inventory levels in real-time and send notifications when items go out of stock or are restocked.

**Capabilities:**
- `check_inventory` - Check stock level for a SKU
- `subscribe_oos_alerts` - Subscribe to OOS notifications
- `notify_restock` - Send restock notifications

**APIs Used:** VTEX Inventory API, Notification Agent

**Business Value:** Prevent lost sales, improve customer satisfaction

**Example Flow:**
1. Monitor SKU inventory every 60 seconds
2. Detect when quantity drops to 0
3. Send notification to Notification Agent
4. Track when item is back in stock
5. Alert subscribed customers

---

### 2. **Order Status Tracking Agent** 🟡
**Description:** Track order status changes and automatically notify customers of shipping updates and delivery confirmations.

**Capabilities:**
- `track_order` - Get order status
- `subscribe_order_updates` - Subscribe to order changes
- `send_status_notification` - Send status updates

**APIs Used:** VTEX OMS API, Notification Agent

**Business Value:** Proactive customer communication, reduce support tickets

---

### 3. **Smart Inventory Reorder Agent** 🟡
**Description:** Autonomously monitors inventory levels, calculates optimal reorder points based on sales velocity, and coordinates with warehouse for restocking.

**Agentic Capabilities:**
- `monitor_inventory_levels` - Track stock in real-time
- `calculate_reorder_point` - Decide when to reorder based on velocity
- `check_warehouse_capacity` - Coordinate with warehouse agent (A2A)
- `place_reorder_request` - Autonomous reorder decision
- `track_reorder_status` - Monitor until stock arrives

**APIs Used:** VTEX Inventory API, Warehouse Agent (A2A), Notification Agent

**Business Value:** Prevent stockouts, optimize inventory costs, autonomous operations

**Example Flow:**
1. Monitor SKU inventory every 5 minutes
2. Calculate sales velocity (units sold per day)
3. **Decide:** If current stock < (velocity × lead_time + safety_stock), trigger reorder
4. **Coordinate:** Check warehouse agent for available space (A2A)
5. **Decide:** Calculate optimal reorder quantity (EOQ formula)
6. Place reorder and send notification to purchasing team
7. Track delivery and update inventory

**Why Agentic:** Makes autonomous purchasing decisions, multi-criteria calculation, A2A coordination

---

### 4. **Order Exception Handler Agent** 🟡
**Description:** Detects order issues (payment failed, address invalid, out of stock) and autonomously decides the best resolution strategy, coordinating with multiple agents.

**Agentic Capabilities:**
- `detect_order_exception` - Identify order problems
- `analyze_exception_context` - Understand issue + customer history
- `decide_resolution_strategy` - Choose best action autonomously
- `coordinate_resolution` - Work with payment/inventory/notification agents
- `track_resolution_outcome` - Learn from results

**APIs Used:** VTEX OMS API, Payment Agent (A2A), Inventory Agent (A2A), Notification Agent (A2A)

**Business Value:** Reduce manual intervention, faster resolution, improved customer satisfaction

**Example Flow:**
1. Monitor orders for exceptions (payment failed, address invalid, OOS)
2. **Analyze:** Check customer history, order value, issue type
3. **Decide Resolution:**
   - Payment failed + good customer → Retry payment + email reminder
   - Address invalid → Suggest corrections via notification agent
   - Out of stock → Check alternative warehouse (A2A) or offer substitute
4. **Coordinate:** Send A2A messages to relevant agents
5. **Track:** Monitor if issue resolved, log outcome
6. **Learn:** Track which strategies work best

**Why Agentic:** Context-aware decisions, multi-step reasoning, agent orchestration, outcome tracking

---

### 5. **Customer Experience Orchestrator Agent** 🟡
**Description:** Monitors customer journey in real-time, detects friction points, and autonomously decides interventions to improve experience.

**Agentic Capabilities:**
- `monitor_customer_journey` - Track browsing, cart, checkout behavior
- `detect_friction_points` - Identify issues (slow checkout, cart abandonment)
- `decide_intervention` - Choose action: discount, help offer, chat
- `personalize_approach` - Adapt based on customer history
- `coordinate_outreach` - Work with notification/chat agents
- `measure_impact` - Track if intervention worked

**APIs Used:** VTEX Checkout API, Session API, Notification Agent (A2A), Chat Agent (A2A)

**Business Value:** Increase conversion, reduce abandonment, personalized experience

**Example Flow:**
1. Monitor customer session in real-time
2. **Detect:** Customer added items to cart but hasn't checked out in 10 mins
3. **Analyze:** Check customer history (first-time vs returning, past purchases)
4. **Decide Intervention:**
   - First-time customer → Offer 10% discount + free shipping
   - Returning customer → Send chat offer for assistance
   - High-value cart → Priority customer service notification
5. **Coordinate:** Send A2A message to notification agent
6. **Track:** Did customer complete purchase? Log success rate

**Why Agentic:** Real-time monitoring, context-aware decisions, adaptive interventions, impact measurement

---

### 6. **Proactive Customer Service Agent** 🟡
**Description:** Monitors orders for potential issues, predicts customer dissatisfaction, and proactively reaches out before complaints occur.

**Agentic Capabilities:**
- `monitor_order_health` - Track orders for potential issues
- `predict_dissatisfaction` - Detect problems early (shipping delay, quality issues)
- `decide_proactive_action` - Choose intervention (discount, upgrade, apology)
- `coordinate_outreach` - Work with notification agent
- `track_prevention_success` - Measure if complaint was prevented

**APIs Used:** VTEX OMS API, Logistics API, Notification Agent (A2A)

**Business Value:** Prevent complaints, improve satisfaction, reduce support load

**Example Flow:**
1. Monitor all active orders every hour
2. **Detect Issues:**
   - Shipping delay detected (expected delivery passed)
   - Order stuck in same status for 3+ days
   - Product has recent negative reviews
3. **Predict:** Calculate dissatisfaction risk score
4. **Decide Action:**
   - High-value order + delay → Upgrade to express shipping
   - Low-value order + delay → Send apology + 10% discount
   - Quality issue → Proactive replacement offer
5. **Coordinate:** Send A2A to notification agent with personalized message
6. **Track:** Monitor if customer still complains, measure prevention rate

**Why Agentic:** Predictive, proactive, autonomous intervention, outcome tracking

---

### 7. **Flash Sale Coordinator Agent** 🟡
**Description:** Manage flash sale inventory, coordinate with notification agent, and track real-time performance.

**Capabilities:**
- `setup_flash_sale` - Configure sale
- `monitor_inventory` - Track stock during sale
- `coordinate_notifications` - Send alerts

**APIs Used:** VTEX Catalog API, Pricing API

**Business Value:** Maximize flash sale revenue, prevent overselling

---

### 8. **Return Processing Automation Agent** 🟡
**Description:** Handle return requests automatically, update inventory, and coordinate refunds.

**Capabilities:**
- `process_return_request` - Handle returns
- `update_inventory` - Adjust stock
- `coordinate_refund` - Trigger refund

**APIs Used:** VTEX OMS API, Payment API

**Business Value:** Faster returns, better customer experience

---

### 9. **Product Availability Notifier Agent** 🟢
**Description:** Track wishlist items and notify customers when products become available or go on sale.

**Capabilities:**
- `track_wishlist_items` - Monitor wishlisted products
- `notify_available` - Send availability alerts
- `handle_pre_orders` - Manage pre-orders

**APIs Used:** VTEX Catalog API, Notification Agent

**Business Value:** Drive sales, customer engagement

---

### 10. **Smart Bundle & Upsell Agent** 🟡
**Description:** Analyzes cart contents in real-time, autonomously decides relevant products to suggest, and calculates optimal bundle discounts to maximize profit.

**Agentic Capabilities:**
- `analyze_cart_contents` - Understand what customer is buying
- `decide_relevant_products` - Choose smart suggestions (not random)
- `calculate_bundle_discount` - Optimize for profit margin
- `check_inventory_availability` - Coordinate with inventory agent (A2A)
- `adapt_suggestions` - Learn from customer response

**APIs Used:** VTEX Catalog API, Cart API, Inventory Agent (A2A)

**Business Value:** Increase average order value, improve margins, personalized experience

**Example Flow:**
1. Monitor cart updates in real-time
2. **Analyze:** Customer added laptop to cart
3. **Decide Suggestions:**
   - Laptop bag (high margin, frequently bought together)
   - Mouse (complementary, in stock)
   - Laptop stand (premium upsell)
4. **Calculate Discount:** "Buy all 3, save 15%" (still profitable)
5. **Coordinate:** Check inventory agent for stock availability (A2A)
6. **Present:** Show bundle offer at checkout
7. **Adapt:** If customer declines, try different bundle next time

**Why Agentic:** Real-time analysis, profit optimization, adaptive recommendations, inventory coordination

---

## 🛒 CommerceTools Use Cases (10)

### 11. **Intelligent Return & Refund Agent** 🟡
**Description:** Analyzes return requests with context (reason, product, customer history), autonomously decides approval/rejection, detects fraud patterns, and coordinates multi-agent refund workflow.

**Agentic Capabilities:**
- `analyze_return_request` - Understand context (reason, product condition, customer history)
- `decide_approval` - Autonomous decision based on policy + context
- `detect_fraud_patterns` - Flag suspicious return behavior
- `coordinate_inventory` - Work with inventory agent for restock/dispose (A2A)
- `coordinate_refund` - Work with payment agent for refund (A2A)
- `learn_patterns` - Track return patterns to improve decisions

**APIs Used:** CT Order API, Payment API, Inventory Agent (A2A), Notification Agent (A2A)

**Business Value:** Faster returns, fraud prevention, reduced manual review, better customer experience

**Example Flow:**
1. Receive return request from customer
2. **Analyze Context:**
   - Product: Electronics (high fraud risk)
   - Reason: "Defective"
   - Customer history: 3 returns in last month (red flag)
   - Order age: 45 days (within policy)
3. **Detect Fraud:** Calculate fraud risk score
   - Frequent returner: +30 points
   - High-value item: +20 points
   - Vague reason: +10 points
   - Total: 60/100 (medium risk)
4. **Decide Action:**
   - Risk < 40: Auto-approve
   - Risk 40-70: Require photo proof
   - Risk > 70: Manual review
5. **Coordinate:**
   - Send A2A to notification agent: "Please upload product photos"
   - If approved: Send A2A to inventory agent (restock or dispose?)
   - Send A2A to payment agent: Process refund
6. **Learn:** Track if flagged returns were actually fraud

**Why Agentic:** Context-aware decisions, fraud detection, multi-agent workflow, learning from patterns

---

### 12. **Payment Retry & Recovery Agent** 🟡
**Description:** Detect failed payments, implement smart retry logic, and alert customers.

**Capabilities:**
- `detect_failed_payment` - Monitor payments
- `smart_retry` - Intelligent retry logic
- `alert_customer` - Payment issue alerts

**APIs Used:** CT Payment API, Notification Agent

**Business Value:** Recover failed transactions, reduce churn

---

### 13. **Dynamic Fulfillment Optimizer Agent** 🟡
**Description:** Analyzes each order (items, destination, urgency) and autonomously decides the optimal warehouse and shipping method, coordinating with multiple agents in real-time.

**Agentic Capabilities:**
- `analyze_order` - Understand items, destination, customer urgency
- `check_warehouse_inventory` - Query multiple warehouses (A2A)
- `evaluate_shipping_options` - Compare cost, speed, reliability
- `decide_optimal_fulfillment` - Choose best warehouse + carrier combo
- `coordinate_execution` - Work with warehouse and shipping agents
- `adapt_strategy` - Adjust based on real-time performance

**APIs Used:** CT Order API, Inventory API, Warehouse Agent (A2A), Shipping Agent (A2A)

**Business Value:** Reduce shipping costs, faster delivery, optimal resource utilization

**Example Flow:**
1. New order received: 3 items, destination: Mumbai, customer: Prime member
2. **Analyze Order:**
   - Item A: Available in Warehouse 1 (Delhi) & 3 (Pune)
   - Item B: Only in Warehouse 3 (Pune)
   - Item C: Available in all warehouses
   - Customer urgency: High (Prime member)
3. **Coordinate:** Send A2A to warehouse agents for real-time stock check
4. **Evaluate Options:**
   - Option 1: Ship all from Pune (1 shipment, 1 day delivery)
   - Option 2: Split shipment (cheaper but 2 days)
5. **Decide:** Choose Pune warehouse (faster for Prime member)
6. **Evaluate Shipping:**
   - Carrier A: ₹200, 1 day, 95% on-time
   - Carrier B: ₹150, 1 day, 85% on-time
7. **Decide:** Choose Carrier A (reliability matters for Prime)
8. **Coordinate:** Send A2A to warehouse agent (Pune) and shipping agent (Carrier A)
9. **Adapt:** Track delivery performance, adjust carrier preference

**Why Agentic:** Multi-criteria optimization, real-time decisions, agent orchestration, adaptive learning

---

### 14. **Order Fraud Prevention Agent** 🟡
**Description:** Analyzes orders at checkout, calculates fraud risk score using multiple signals, and autonomously decides whether to approve, review, or decline, coordinating with payment and notification agents.

**Agentic Capabilities:**
- `analyze_order_signals` - Check amount, location, customer history, device
- `calculate_fraud_risk` - Multi-factor risk scoring
- `decide_action` - Approve, manual review, or decline
- `coordinate_payment` - Work with payment agent to hold/release (A2A)
- `coordinate_verification` - Work with notification agent for customer verification (A2A)
- `learn_patterns` - Track fraud patterns over time

**APIs Used:** CT Order API, Payment API, Customer API, Payment Agent (A2A), Notification Agent (A2A)

**Business Value:** Prevent fraud losses, reduce chargebacks, balance security with customer experience

**Example Flow:**
1. Order submitted at checkout
2. **Analyze Signals:**
   - Order amount: ₹50,000 (high)
   - Customer: First-time buyer (risk)
   - Shipping address: Different from billing (risk)
   - Device: New device, VPN detected (risk)
   - Payment: Credit card (medium risk)
   - Time: 2 AM (unusual)
3. **Calculate Risk Score:**
   - High amount first-time: +25 points
   - Address mismatch: +20 points
   - VPN + new device: +30 points
   - Unusual time: +10 points
   - Total: 85/100 (High Risk)
4. **Decide Action:**
   - Score < 30: Auto-approve
   - Score 30-70: Manual review
   - Score > 70: Require verification
5. **Coordinate:**
   - Send A2A to payment agent: "Hold payment"
   - Send A2A to notification agent: "Send OTP to customer"
   - Wait for customer verification
   - If verified: Release payment, approve order
   - If not verified: Decline order
6. **Learn:** Track if flagged orders were actually fraud

**Why Agentic:** Risk assessment, autonomous decisions, multi-agent coordination, pattern learning

---

### 15. **Smart Cart Optimization Agent** 🟡
**Description:** Suggest related products, optimize cart value, and apply smart discounts.

**Capabilities:**
- `suggest_products` - Recommendations
- `optimize_cart_value` - Increase AOV
- `apply_smart_discount` - Dynamic pricing

**APIs Used:** CT Cart API, Product API

**Business Value:** Increase average order value

---

### 16. **Address Validation & Correction Agent** 🟢
**Description:** Validate shipping addresses, suggest corrections, and prevent delivery failures.

**Capabilities:**
- `validate_address` - Check address validity
- `suggest_corrections` - Fix errors
- `prevent_failures` - Stop bad deliveries

**APIs Used:** CT Cart API, Address Validation APIs

**Business Value:** Reduce failed deliveries, lower costs

---

### 17. **Loyalty Points & Rewards Agent** 🟡
**Description:** Track loyalty points, send balance updates, and suggest redemption options.

**Capabilities:**
- `track_points` - Monitor balances
- `send_updates` - Balance notifications
- `suggest_redemptions` - Reward recommendations

**APIs Used:** CT Custom Objects API, Customer API

**Business Value:** Increase loyalty, drive repeat purchases

---

### 18. **Gift Card Management Agent** 🟢
**Description:** Handle gift card purchases, track balances, and send notifications.

**Capabilities:**
- `create_gift_card` - Issue cards
- `track_balance` - Monitor usage
- `send_notifications` - Balance alerts

**APIs Used:** CT Payment API, Custom Objects API

**Business Value:** Additional revenue stream, gifting

---

### 19. **Smart Subscription Renewal Agent** 🟡
**Description:** Monitors subscription renewals, predicts cancellation risk, autonomously decides retention offers, and coordinates renewal reminders with personalized incentives.

**Agentic Capabilities:**
- `monitor_subscriptions` - Track renewal dates and usage patterns
- `predict_cancellation_risk` - Detect at-risk subscriptions (low usage, payment issues)
- `decide_retention_offer` - Choose incentive: discount, upgrade, bonus
- `personalize_reminder` - Adapt message based on customer segment
- `coordinate_renewal` - Work with payment and notification agents (A2A)
- `track_retention_success` - Learn which offers work best

**APIs Used:** CT Subscription API, Order API, Payment Agent (A2A), Notification Agent (A2A)

**Business Value:** Reduce churn, increase recurring revenue, proactive retention

**Example Flow:**
1. Monitor subscriptions expiring in next 30 days
2. **Analyze Each Subscription:**
   - Subscription A: Active user, no payment issues (low risk)
   - Subscription B: Low usage, payment failed last month (HIGH RISK)
   - Subscription C: Medium usage, price-sensitive customer (medium risk)
3. **Predict Cancellation Risk:**
   - Subscription A: 10% risk
   - Subscription B: 80% risk
   - Subscription C: 45% risk
4. **Decide Retention Strategy:**
   - Low risk (A): Standard renewal reminder
   - High risk (B): 20% discount + payment help + usage tips
   - Medium risk (C): 10% discount for annual upgrade
5. **Personalize Message:**
   - Check customer's preferred contact method
   - Use past purchase language/tone
   - Highlight most-used features
6. **Coordinate:**
   - Send A2A to payment agent: Check payment method validity
   - Send A2A to notification agent: Send personalized reminder
7. **Track:** Did customer renew? At what price? Log success rate

**Why Agentic:** Predictive risk assessment, personalized decisions, multi-agent coordination, learning

---

### 20. **Abandoned Cart Recovery Agent** 🟡
**Description:** Detects abandoned carts, analyzes abandonment context (cart value, customer history, items), autonomously decides recovery strategy, and coordinates personalized outreach.

**Agentic Capabilities:**
- `detect_abandoned_cart` - Identify carts inactive for 30+ minutes
- `analyze_abandonment_context` - Understand why (high shipping, first-time buyer, price)
- `decide_recovery_strategy` - Choose action: discount, free shipping, reminder
- `calculate_optimal_offer` - Balance conversion vs profit
- `coordinate_outreach` - Work with notification agent (A2A)
- `track_recovery_rate` - Learn which strategies work

**APIs Used:** CT Cart API, Customer API, Notification Agent (A2A)

**Business Value:** Recover lost revenue, increase conversion, personalized experience

**Example Flow:**
1. Monitor active carts every 5 minutes
2. **Detect Abandonment:**
   - Cart A: ₹5,000 cart, inactive 35 minutes
   - Cart B: ₹500 cart, inactive 60 minutes
   - Cart C: ₹50,000 cart, inactive 20 minutes
3. **Analyze Context:**
   - Cart A: First-time buyer, shipping cost ₹200 (40% of item price - HIGH)
   - Cart B: Returning customer, just browsing (low intent)
   - Cart C: High-value, returning customer, payment page (HIGH INTENT)
4. **Decide Strategy:**
   - Cart A: Offer free shipping (remove barrier)
   - Cart B: Just send reminder email (no discount waste)
   - Cart C: Urgent: Live chat offer + 5% discount (high value)
5. **Calculate Offer:**
   - Cart A: Free shipping costs ₹200, but ₹5k order worth it
   - Cart B: No offer, just reminder
   - Cart C: 5% = ₹2,500 discount, but ₹50k order worth it
6. **Coordinate:**
   - Send A2A to notification agent with personalized message
   - For Cart C: Also trigger live chat agent
7. **Track:**
   - Did customer complete purchase?
   - What was the recovery cost?
   - Calculate ROI per strategy

**Why Agentic:** Context analysis, profit optimization, personalized decisions, ROI tracking

---

## 🏢 ATG / Legacy System Use Cases (5)

### 21. **Delivery Time Optimizer Agent** 🟡
**Description:** Analyzes order destination, checks inventory locations, evaluates shipping options, and autonomously decides the optimal delivery strategy to balance cost and speed.

**Agentic Capabilities:**
- `analyze_destination` - Understand delivery location, urgency, customer tier
- `check_inventory_locations` - Query multiple warehouses (A2A)
- `evaluate_shipping_options` - Compare carriers (cost, speed, reliability)
- `decide_optimal_strategy` - Choose best fulfillment + shipping combo
- `coordinate_execution` - Work with warehouse and carrier agents
- `adapt_based_on_performance` - Learn from delivery success rates

**APIs Used:** ATG Order API, Warehouse Agent (A2A), Shipping Agent (A2A), Notification Agent (A2A)

**Business Value:** Reduce shipping costs, improve delivery times, customer satisfaction

**Example Flow:**
1. New order: Electronics, destination: Bangalore, customer: Regular
2. **Analyze:**
   - Item: High-value electronics (needs careful handling)
   - Destination: Bangalore (metro, multiple warehouses nearby)
   - Customer: Regular (not premium, cost-conscious)
3. **Check Inventory:** Send A2A to warehouse agents
   - Warehouse A (Bangalore): In stock, 0 km
   - Warehouse B (Pune): In stock, 150 km
   - Warehouse C (Mumbai): In stock, 850 km
4. **Evaluate Shipping:**
   - Local delivery (Warehouse A): ₹50, same day, 98% success
   - Regional (Warehouse B): ₹80, 1 day, 95% success
   - National (Warehouse C): ₹150, 2 days, 90% success
5. **Decide:** Choose Warehouse A + local delivery (best balance)
6. **Coordinate:** Send A2A to warehouse A and local carrier
7. **Track:** Monitor delivery, learn carrier performance
8. **Adapt:** If local carrier fails, prefer regional next time

**Why Agentic:** Multi-criteria optimization, real-time decisions, agent coordination, adaptive learning

---

### 22. **Customer Retention Agent** 🟡
**Description:** Monitors customer activity, detects churn risk, autonomously decides retention strategies, and coordinates personalized outreach campaigns.

**Agentic Capabilities:**
- `monitor_customer_activity` - Track purchase frequency, engagement
- `detect_churn_risk` - Identify at-risk customers (no purchase in 60+ days)
- `decide_retention_strategy` - Choose action: discount, survey, re-engagement
- `personalize_approach` - Adapt based on customer segment
- `coordinate_outreach` - Work with notification agent for campaigns (A2A)
- `track_success` - Measure retention rate, learn what works

**APIs Used:** ATG Customer API, Order API, Notification Agent (A2A)

**Business Value:** Reduce churn, increase lifetime value, proactive retention

**Example Flow:**
1. Daily scan of customer database
2. **Detect Risk:**
   - Customer A: Last purchase 65 days ago (was monthly buyer)
   - Customer B: Last purchase 90 days ago (was weekly buyer - HIGH RISK)
   - Customer C: Last purchase 45 days ago (normal for quarterly buyer)
3. **Calculate Churn Risk:**
   - Customer A: 60% risk (deviation from pattern)
   - Customer B: 90% risk (major deviation)
   - Customer C: 20% risk (normal behavior)
4. **Decide Strategy:**
   - Customer A (60% risk): Send 15% discount offer
   - Customer B (90% risk): Personal call + 25% discount + free shipping
   - Customer C (20% risk): Just engagement email (no discount)
5. **Personalize:**
   - Check past purchases for product preferences
   - Check email open rates for best send time
6. **Coordinate:** Send A2A to notification agent with personalized message
7. **Track:**
   - Did customer make purchase within 30 days?
   - Calculate retention rate per strategy
8. **Learn:** Adjust discount amounts and timing based on success

**Why Agentic:** Predictive, personalized decisions, adaptive strategies, outcome learning

---

### 23. **Intelligent Product Recommendation Agent** 🟡
**Description:** Analyzes customer browsing and purchase history, autonomously decides relevant product suggestions using collaborative filtering, and adapts recommendations based on customer response.

**Agentic Capabilities:**
- `analyze_customer_behavior` - Understand browsing, purchases, preferences
- `find_similar_customers` - Collaborative filtering (customers like you bought...)
- `decide_recommendations` - Choose products (not random, contextual)
- `calculate_relevance_score` - Rank recommendations by likelihood
- `adapt_suggestions` - Learn from clicks and purchases
- `coordinate_display` - Work with frontend to show recommendations

**APIs Used:** ATG Customer API, Order API, Catalog API, Analytics

**Business Value:** Increase cross-sell, improve discovery, personalized experience

**Example Flow:**
1. Customer viewing laptop on website
2. **Analyze Customer:**
   - Past purchases: Phone, headphones
   - Browsing: Laptops, tablets
   - Price range: ₹30k-₹50k
3. **Find Similar Customers:**
   - Query: Customers who bought laptops in ₹30k-₹50k range
   - Result: 80% also bought laptop bags, 60% bought mice, 40% bought stands
4. **Decide Recommendations:**
   - Laptop bag (high probability, good margin)
   - Wireless mouse (complementary, in stock)
   - Laptop stand (premium upsell)
5. **Calculate Scores:**
   - Bag: 0.85 (80% probability × good margin)
   - Mouse: 0.72 (60% probability × medium margin)
   - Stand: 0.48 (40% probability × high margin)
6. **Display:** Show top 3 recommendations
7. **Track Response:**
   - Customer clicked bag, added to cart
   - Customer ignored mouse and stand
8. **Adapt:**
   - Increase bag recommendation weight
   - Decrease stand recommendation for this customer
   - Learn: This customer prefers practical over premium

**Why Agentic:** Behavioral analysis, collaborative filtering, relevance scoring, adaptive learning

---

### 24. **Legacy Order Lookup Agent** 🟡
**Description:** Query historical orders from ATG, provide unified view, handle API incompatibilities.

**Capabilities:**
- `lookup_legacy_order` - Find old orders
- `unified_view` - Combine old/new data
- `handle_compatibility` - Bridge APIs

**APIs Used:** ATG Order API, Modern OMS APIs

**Business Value:** Complete order history

---

### 25. **Legacy Order Fulfillment Bridge Agent** 🟡
**Description:** Monitors orders from ATG system, intelligently routes them to modern fulfillment systems, handles data transformation, and coordinates with warehouse agents for seamless fulfillment.

**Agentic Capabilities:**
- `monitor_legacy_orders` - Track new orders from ATG
- `analyze_order_requirements` - Understand items, urgency, special handling
- `decide_fulfillment_system` - Route to best modern system
- `transform_data` - Convert ATG format to modern format
- `coordinate_fulfillment` - Work with warehouse and shipping agents (A2A)
- `handle_errors` - Retry logic and fallback strategies

**APIs Used:** ATG Order API, Modern OMS API, Warehouse Agent (A2A), Shipping Agent (A2A)

**Business Value:** Smooth legacy migration, no order disruption, gradual modernization

**Example Flow:**
1. Monitor ATG orders every minute
2. **New Order Detected:** Order #12345 from ATG
3. **Analyze Order:**
   - Items: 3 SKUs (all available in modern system)
   - Customer: Existing (profile synced)
   - Shipping: Express (needs fast fulfillment)
   - Special: Gift wrap requested
4. **Decide Routing:**
   - Check modern system capacity
   - Check warehouse availability (A2A)
   - Decision: Route to Modern System A (has gift wrap capability)
5. **Transform Data:**
   - Convert ATG SKU format → Modern SKU format
   - Map customer ID (ATG → Modern)
   - Translate shipping codes
   - Handle custom fields (gift wrap)
6. **Coordinate:**
   - Send A2A to warehouse agent: "New order, gift wrap needed"
   - Send A2A to shipping agent: "Express delivery"
7. **Handle Errors:**
   - If modern system fails → Fallback to ATG fulfillment
   - If SKU not found → Alert for manual mapping
   - Retry failed API calls (3 attempts)
8. **Track:** Log success rate, identify mapping issues

**Why Agentic:** Intelligent routing, data transformation, error handling, multi-agent coordination

---

## 👥 HR / Internal Use Cases (5)

### 26. **Employee Onboarding Automation Agent** 🟡
**Description:** Automate onboarding tasks, send welcome emails, schedule training sessions.

**Capabilities:**
- `automate_onboarding` - Task automation
- `send_welcome` - Welcome communications
- `schedule_training` - Training coordination

**APIs Used:** HR System API, Email API

**Business Value:** Faster onboarding, better experience

---

### 27. **Leave Request Processing Agent** 🟢
**Description:** Process leave requests, check approvals, update calendars automatically.

**Capabilities:**
- `process_leave_request` - Handle requests
- `check_approval` - Approval workflow
- `update_calendar` - Calendar sync

**APIs Used:** HR System API, Calendar API

**Business Value:** Streamlined leave management

---

### 28. **Performance Review Reminder Agent** 🟢
**Description:** Monitors performance review cycles and autonomously sends reminders to managers and employees based on review schedules.

**Agentic Capabilities:**
- `monitor_review_cycles` - Track review due dates
- `identify_pending_reviews` - Find overdue or upcoming reviews
- `send_manager_reminders` - Notify managers of pending reviews
- `send_employee_reminders` - Notify employees to complete self-assessments
- `escalate_overdue` - Escalate overdue reviews to HR
- `track_completion` - Monitor review completion rates

**APIs Used:** HR System API, Email/Notification API

**Business Value:** Ensures timely performance reviews, improves completion rates, reduces HR manual follow-up

**Example Flow:**
1. Monitor review schedule daily
2. **Identify Reviews Due:**
   - Manager A: 3 reviews due in 7 days
   - Manager B: 1 review overdue by 5 days
   - Employee C: Self-assessment due in 3 days
3. **Send Reminders:**
   - Manager A: "You have 3 performance reviews due next week"
   - Manager B: "URGENT: 1 review is 5 days overdue"
   - Employee C: "Please complete your self-assessment"
4. **Escalate if needed:**
   - If Manager B doesn't respond in 2 days → Escalate to HR
5. **Track:** Log completion rates and reminder effectiveness

**Why Agentic:** Autonomous monitoring, intelligent reminder scheduling, escalation decisions

---

### 29. **IT Helpdesk Automation Agent** 🟡
**Description:** Handle common IT requests, route complex issues, track resolutions.

**Capabilities:**
- `handle_common_requests` - Auto-resolve simple issues
- `route_complex_issues` - Escalation
- `track_resolutions` - Issue tracking

**APIs Used:** Helpdesk API, Knowledge Base API

**Business Value:** Faster resolution, reduce IT load

---

### 30. **Training Recommendation Agent** 🟡
**Description:** Analyze skill gaps, recommend courses, track completion automatically.

**Capabilities:**
- `analyze_skill_gaps` - Identify needs
- `recommend_courses` - Suggest training
- `track_completion` - Monitor progress

**APIs Used:** HR System API, Learning Management System API

**Business Value:** Skill development, employee growth

---

## 🏦 Banking & Finance Use Cases (5)

### 1. **Transaction Fraud Detection Agent** 🟡
**Description:** Monitor customer transactions in real-time and flag suspicious activities based on patterns like unusual amounts, locations, or frequency.

**Capabilities:**
- `analyze_transaction` - Analyze transaction for fraud indicators
- `check_transaction_pattern` - Compare against customer's historical patterns
- `flag_suspicious_activity` - Flag and alert on suspicious transactions
- `send_fraud_alert` - Notify compliance team

**Database Schema:**
```sql
transactions (
  transaction_id, customer_id, amount, merchant, 
  location, timestamp, status
)
customer_profile (
  customer_id, avg_transaction_amount, 
  usual_locations, transaction_frequency
)
```

**Business Value:** Prevent fraud losses, protect customers, reduce chargebacks

**Example Flow:**
1. Monitor incoming transactions from database
2. Compare transaction amount with customer's average (flag if >3x normal)
3. Check if location is unusual (flag if different country)
4. Check transaction frequency (flag if >5 transactions in 1 hour)
5. If 2+ flags, send alert to compliance team via Notification Agent
6. Log all fraud checks to dashboard

---

### 2. **Loan Application Status Agent** 🟢
**Description:** Automate loan application tracking and send status updates to customers at each stage of the approval process.

**Capabilities:**
- `check_application_status` - Get current status of loan application
- `update_application_stage` - Move application to next stage
- `send_status_update` - Notify customer of status change
- `calculate_approval_score` - Basic credit score calculation

**Database Schema:**
```sql
loan_applications (
  application_id, customer_id, loan_amount, 
  loan_type, status, stage, created_at, updated_at
)
application_stages (
  stage_name, description, email_template
)
```

**Stages:**
1. Application Received
2. Document Verification
3. Credit Check
4. Manager Approval
5. Approved/Rejected

**Business Value:** Improve customer experience, reduce support calls, faster processing

**Example Flow:**
1. Monitor loan applications table for status changes
2. When stage changes, fetch email template for that stage
3. Send personalized email to customer via Notification Agent
4. Log status update event to dashboard
5. If approved, trigger next steps (disbursement agent)

---

### 3. **Credit Card Expiry Reminder Agent** 🟢
**Description:** Monitor credit card expiry dates and send proactive reminders to customers 60, 30, and 7 days before expiration.

**Capabilities:**
- `check_expiring_cards` - Query cards expiring in next 60 days
- `send_expiry_reminder` - Send reminder email to customer
- `track_reminder_sent` - Log which reminders were sent
- `generate_renewal_link` - Create personalized renewal link

**Database Schema:**
```sql
credit_cards (
  card_id, customer_id, card_number_masked, 
  expiry_date, card_type, status
)
customers (
  customer_id, name, email, phone, 
  preferred_contact_method
)
reminder_log (
  card_id, reminder_type, sent_at
)
```

**Business Value:** Reduce card expiry issues, improve customer retention, proactive service

**Example Flow:**
1. Daily check for cards expiring in 60, 30, 7 days
2. Check reminder_log to avoid duplicate reminders
3. For each card, send personalized email with:
   - Card details (masked)
   - Expiry date
   - Renewal link
   - Contact information
4. Log reminder sent to database
5. Track email open rates via dashboard events

---

### 4. **Account Dormancy Reactivation Agent** 🟡
**Description:** Identify dormant bank accounts (no transactions in 90+ days) and send personalized reactivation campaigns with offers.

**Capabilities:**
- `identify_dormant_accounts` - Find accounts with no activity
- `calculate_dormancy_days` - Calculate days since last transaction
- `generate_reactivation_offer` - Create personalized offer based on account type
- `send_reactivation_campaign` - Send email/SMS campaign
- `track_reactivation_success` - Monitor if customer becomes active

**Database Schema:**
```sql
accounts (
  account_id, customer_id, account_type, 
  balance, status, last_transaction_date
)
transactions (
  transaction_id, account_id, amount, 
  transaction_type, timestamp
)
reactivation_campaigns (
  campaign_id, account_id, offer_details, 
  sent_at, opened, clicked, reactivated
)
```

**Reactivation Offers:**
- Savings Account: "Earn 2% extra interest for 3 months"
- Current Account: "Zero balance charges for 6 months"
- Credit Card: "500 bonus points on first transaction"

**Business Value:** Increase account activity, prevent account closures, revenue recovery

**Example Flow:**
1. Query accounts with last_transaction_date > 90 days ago
2. Segment by account type (savings, current, credit card)
3. Generate personalized offer based on segment
4. Send reactivation email via Notification Agent
5. Track email opens and clicks
6. Monitor if account has new transactions within 30 days
7. Calculate reactivation rate and log to dashboard

---

### 5. **KYC Document Expiry Alert Agent** 🟡
**Description:** Monitor customer KYC documents (Aadhaar, PAN, Passport) for expiry and send renewal reminders to maintain compliance.

**Capabilities:**
- `check_expiring_documents` - Find documents expiring in next 90 days
- `send_renewal_reminder` - Send reminder to customer
- `escalate_to_compliance` - Alert compliance team if document expired
- `track_document_update` - Monitor when customer uploads new document
- `generate_compliance_report` - Daily report of expired/expiring documents

**Database Schema:**
```sql
customer_kyc (
  kyc_id, customer_id, document_type, 
  document_number, issue_date, expiry_date, 
  status, last_verified_date
)
kyc_reminders (
  reminder_id, kyc_id, reminder_type, 
  sent_at, customer_responded
)
compliance_alerts (
  alert_id, customer_id, document_type, 
  issue_description, severity, resolved
)
```

**Document Types:**
- Aadhaar Card (no expiry, but re-verification every 10 years)
- PAN Card (no expiry, but address update needed)
- Passport (10-year expiry)
- Driving License (varies by state)
- Voter ID (no expiry, but address update needed)

**Reminder Schedule:**
- 90 days before expiry: First reminder
- 60 days before expiry: Second reminder
- 30 days before expiry: Urgent reminder
- 7 days before expiry: Critical alert + compliance escalation
- After expiry: Daily alerts to compliance team

**Business Value:** Regulatory compliance, avoid penalties, maintain customer account status

**Example Flow:**
1. Daily scan of customer_kyc table for expiring documents
2. Check kyc_reminders to avoid duplicate reminders
3. Send appropriate reminder based on days until expiry
4. If document expired:
   - Send urgent email to customer
   - Send alert to compliance team via A2A
   - Flag account for review
5. When customer uploads new document:
   - Send confirmation email
   - Update KYC status
   - Clear compliance alerts
6. Generate daily compliance report with:
   - Total expired documents
   - Documents expiring this month
   - Customers who haven't responded
   - Compliance risk score

---

## 🚀 How to Choose Your Use Case

1. **Consider Your Skills:**
   - 🟢 Easy: Choose if new to APIs
   - 🟡 Medium: Good balance of challenge and achievability
   - 🔴 Hard: For experienced developers seeking a challenge

2. **Platform Access:**
   - Do you have access to VTEX/CT/ATG credentials?
   - Can you test with real data?

3. **Time Available:**
   - 🟢 Easy: 4-6 hours
   - 🟡 Medium: 8-12 hours
   - 🔴 Hard: 15-20 hours

4. **Business Impact:**
   - Choose use cases aligned with your team's goals
   - Consider what would be most valuable for production

---

## 📋 Submission Checklist

- [ ] Chosen ONE use case
- [ ] Implemented using Python or Node.js template
- [ ] All capabilities implemented
- [ ] Agent registered with LogAgent
- [ ] Visible in dashboard
- [ ] README with use case description
- [ ] Basic tests included
- [ ] Demo video (optional but recommended)

---

**Ready to start? Pick your use case and begin coding! 🚀**

