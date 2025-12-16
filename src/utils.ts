/**
 * Utility Functions
 * Common utilities for agent development
 */

import { v4 as uuidv4 } from 'uuid';

// Simple console-based logger (bypasses winston dependency issues)
export function setupLogging(level: string = 'info'): void {
  // No-op for console logger
  console.log(`[SETUP] Logging initialized at level: ${level}`);
}

function getTimestampForLog(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

export const logger = {
  info: (message: string, ...meta: any[]) => {
    console.log(`${getTimestampForLog()} [INFO] ${message}`, ...meta);
  },
  error: (message: string, ...meta: any[]) => {
    console.error(`${getTimestampForLog()} [ERROR] ${message}`, ...meta);
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(`${getTimestampForLog()} [WARN] ${message}`, ...meta);
  },
  debug: (message: string, ...meta: any[]) => {
    console.log(`${getTimestampForLog()} [DEBUG] ${message}`, ...meta);
  }
};

export function generateAgentId(prefix: string = 'agent'): string {
  return `${prefix}_${uuidv4().substring(0, 8)}`;
}

export function getTimestamp(): string {
  return new Date().toISOString();
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(1)}m`;
  } else if (seconds < 86400) {
    return `${(seconds / 3600).toFixed(1)}h`;
  } else {
    return `${(seconds / 86400).toFixed(1)}d`;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

