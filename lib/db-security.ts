// Database security utilities for additional SQL injection protection
// and query monitoring

import { logSecurityEvent } from './input-sanitizer';

// SQL injection patterns to monitor for in values
const SQL_INJECTION_PATTERNS = [
  /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
  /(\bUNION\b|\bOR\b|\bAND\b)\s*\d+\s*=\s*\d+/gi,
  /('|\").*(\bOR\b|\bAND\b).*('|\")/gi,
  /(;|\||&|\$\()/g,
  /(\-\-|\/\*|\*\/)/g
];

// Validate query parameters for potential SQL injection
export function validateQueryParams(params: Record<string, unknown>, context: string): boolean {
  let hasViolation = false;
  const violations: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      for (const pattern of SQL_INJECTION_PATTERNS) {
        if (pattern.test(value)) {
          hasViolation = true;
          violations.push(`${key}: ${value.substring(0, 50)}`);
          break;
        }
      }
    }
  }

  if (hasViolation) {
    logSecurityEvent('POTENTIAL_SQL_INJECTION_DETECTED', {
      context,
      violations,
      timestamp: new Date().toISOString()
    });
  }

  return !hasViolation;
}

// Secure parameter validation for specific data types
export const validators = {
  // Validate ID parameters (should be positive integers)
  id: (value: unknown): value is number => {
    const num = Number(value);
    return Number.isInteger(num) && num > 0 && num <= 2147483647; // Max INT value
  },

  // Validate username (alphanumeric + underscore/hyphen only)
  username: (value: unknown): value is string => {
    if (typeof value !== 'string') return false;
    return /^[a-zA-Z0-9_\-]{1,50}$/.test(value) && !SQL_INJECTION_PATTERNS.some(p => p.test(value));
  },

  // Validate phone numbers (digits, +, -, spaces, parentheses only)
  phone: (value: unknown): value is string => {
    if (typeof value !== 'string') return false;
    return /^[\d+\-\s()]{1,20}$/.test(value) && !SQL_INJECTION_PATTERNS.some(p => p.test(value));
  },

  // Validate text fields with length limits
  text: (value: unknown, maxLength = 255): value is string => {
    if (typeof value !== 'string') return false;
    return value.length <= maxLength && !SQL_INJECTION_PATTERNS.some(p => p.test(value));
  },

  // Validate email format
  email: (value: unknown): value is string => {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) && value.length <= 254 && !SQL_INJECTION_PATTERNS.some(p => p.test(value));
  },

  // Validate numeric values within reasonable ranges
  numeric: (value: unknown, min = 0, max = 999999): value is number => {
    const num = Number(value);
    return Number.isFinite(num) && num >= min && num <= max;
  }
};

// Query monitoring for suspicious patterns
export function monitorQuery(operation: string, table: string, conditions?: Record<string, unknown>) {
  const queryInfo = {
    operation: operation.toUpperCase(),
    table,
    timestamp: new Date().toISOString(),
    conditions: conditions ? Object.keys(conditions).length : 0
  };

  // Log high-risk operations
  const highRiskOps = ['DELETE', 'DROP', 'ALTER', 'TRUNCATE'];
  if (highRiskOps.includes(queryInfo.operation)) {
    logSecurityEvent('HIGH_RISK_DATABASE_OPERATION', queryInfo);
  }

  // Log operations on sensitive tables
  const sensitiveTables = ['admin_users', 'rsvp_responses'];
  if (sensitiveTables.includes(table.toLowerCase())) {
    console.log('Database operation on sensitive table:', queryInfo);
  }

  return queryInfo;
}

// Prepare safe parameters for database queries
export function prepareSafeParams(params: Record<string, unknown>): Record<string, unknown> {
  const safeParams: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      safeParams[key] = null;
      continue;
    }

    if (typeof value === 'string') {
      // Remove null bytes and trim whitespace
      const cleaned = value.replace(/\0/g, '').trim();
      safeParams[key] = cleaned.substring(0, 1000); // Limit length
    } else if (typeof value === 'number') {
      // Validate numeric values
      if (Number.isFinite(value)) {
        safeParams[key] = Math.max(-999999, Math.min(value, 999999));
      } else {
        safeParams[key] = 0;
      }
    } else if (typeof value === 'boolean') {
      safeParams[key] = Boolean(value);
    } else {
      // Convert other types to string and clean
      safeParams[key] = String(value).replace(/\0/g, '').trim().substring(0, 1000);
    }
  }

  return safeParams;
}

// Audit trail for database operations
export function auditDatabaseOperation(
  operation: string,
  table: string,
  userId?: string,
  data?: Record<string, unknown>
) {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    operation: operation.toUpperCase(),
    table,
    userId: userId || 'anonymous',
    dataFields: data ? Object.keys(data).length : 0,
    severity: operation.toUpperCase() === 'DELETE' ? 'HIGH' : 'INFO'
  };

  console.log('Database Audit:', auditEntry);

  // In production, you would store this in an audit table
  // await db.insert(auditLog).values(auditEntry);
}

// Note: Database operation rate limiting removed for serverless compatibility// In serverless environments, use external rate limiting services or database-based solutions 