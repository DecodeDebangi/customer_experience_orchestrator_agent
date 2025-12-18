/**
 * Main Entry Point
 * Customer Experience Orchestrator Agent
 *
 * Use Case #5: Monitors customer journey in real-time, detects friction points,
 * and autonomously decides interventions to improve experience.
 *
 * Platform: VTEX
 */

import dotenv from "dotenv";
import { CustomerExperienceOrchestratorAgent } from "./CustomerExperienceOrchestratorAgent";
import { logger } from "./utils";

// Load environment variables
dotenv.config();

// Main function
async function main() {
  console.log("=".repeat(60));
  console.log("🤖 Customer Experience Orchestrator Agent");
  console.log("📋 Use Case #5 - VTEX Platform");
  console.log("=".repeat(60));
  console.log();

  const agent = new CustomerExperienceOrchestratorAgent();

  // Handle graceful shutdown
  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, shutting down gracefully...");
    await agent.stop();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    logger.info("Received SIGINT, shutting down gracefully...");
    await agent.stop();
    process.exit(0);
  });

  // Start the agent
  await agent.start();
}

// Run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Fatal error: ${error.message}`, error);
    process.exit(1);
  });
}

export { CustomerExperienceOrchestratorAgent };
