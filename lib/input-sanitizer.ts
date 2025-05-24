// Input sanitization utilities to prevent injection attacks
// Protects against XSS, SQL injection, command injection, and other malicious inputs

// HTML entities for basic XSS prevention
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

// Dangerous patterns that should be blocked/escaped
const DANGEROUS_PATTERNS = [
  // SQL injection patterns
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
  /('(\s*OR\s*'.*'|;\s*DROP\s+TABLE|;\s*DELETE\s+FROM|;\s*INSERT\s+INTO))/gi,
  
  // JavaScript injection patterns
  /(javascript:|data:text\/html|data:application|vbscript:)/gi,
  /(<script[\s\S]*?>[\s\S]*?<\/script>)/gi,
  /(on\w+\s*=)/gi, // event handlers like onclick, onload, etc.
  
  // Command injection patterns
  /(\||&|;|\$\(|\`|\\)/g,
  
  // Path traversal patterns
  /(\.\.\/|\.\.\\)/g,
  
  // Null bytes and control characters
  /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g
];

// Suspicious keywords that should be logged
const SUSPICIOUS_KEYWORDS = [
  'script', 'javascript', 'vbscript', 'onload', 'onerror', 'onclick',
  'select', 'union', 'drop', 'delete', 'insert', 'update', 'exec',
  'admin', 'root', 'password', 'auth', 'token', 'session'
];

interface SanitizationOptions {
  allowHTML?: boolean;
  maxLength?: number;
  trimWhitespace?: boolean;
  logSuspicious?: boolean;
  strict?: boolean;
}

interface SanitizationResult {
  sanitized: string;
  wasSanitized: boolean;
  blockedPatterns: string[];
  suspiciousKeywords: string[];
}

// Main sanitization function
export function sanitizeInput(
  input: string, 
  options: SanitizationOptions = {}
): SanitizationResult {
  const {
    allowHTML = false,
    maxLength = 1000,
    trimWhitespace = true,
    logSuspicious = true,
    strict = true
  } = options;

  let sanitized = input;
  let wasSanitized = false;
  const blockedPatterns: string[] = [];
  const suspiciousKeywords: string[] = [];

  // Step 1: Trim whitespace if requested
  if (trimWhitespace) {
    const originalLength = sanitized.length;
    sanitized = sanitized.trim();
    if (sanitized.length !== originalLength) {
      wasSanitized = true;
    }
  }

  // Step 2: Enforce length limits
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
    wasSanitized = true;
  }

  // Step 3: Check for suspicious keywords
  if (logSuspicious) {
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (sanitized.toLowerCase().includes(keyword.toLowerCase())) {
        suspiciousKeywords.push(keyword);
      }
    }
  }

  // Step 4: Block dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      const matches = sanitized.match(pattern);
      if (matches) {
        blockedPatterns.push(...matches);
        if (strict) {
          sanitized = sanitized.replace(pattern, '[BLOCKED]');
          wasSanitized = true;
        }
      }
    }
  }

  // Step 5: HTML encode if not allowing HTML
  if (!allowHTML) {
    const originalSanitized = sanitized;
    sanitized = sanitized.replace(/[&<>"'`=\/]/g, (char) => HTML_ENTITIES[char] || char);
    if (sanitized !== originalSanitized) {
      wasSanitized = true;
    }
  }

  // Step 6: Remove null bytes and control characters
  const cleanedSanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  if (cleanedSanitized !== sanitized) {
    sanitized = cleanedSanitized;
    wasSanitized = true;
  }

  // Log suspicious activity
  if (logSuspicious && (blockedPatterns.length > 0 || suspiciousKeywords.length > 0)) {
    console.warn('Suspicious input detected:', {
      original: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      blockedPatterns,
      suspiciousKeywords,
      timestamp: new Date().toISOString()
    });
  }

  return {
    sanitized,
    wasSanitized,
    blockedPatterns,
    suspiciousKeywords
  };
}

// Specialized sanitizers for different data types

// Sanitize text inputs (names, addresses, etc.)
export function sanitizeText(input: string, maxLength = 255): string {
  const result = sanitizeInput(input, {
    allowHTML: false,
    maxLength,
    trimWhitespace: true,
    strict: true
  });
  return result.sanitized;
}

// Sanitize phone numbers
export function sanitizePhone(input: string): string {
  // Allow only digits, +, -, spaces, and parentheses
  const cleaned = input.replace(/[^\d+\-\s()]/g, '');
  return sanitizeInput(cleaned, {
    allowHTML: false,
    maxLength: 20,
    trimWhitespace: true,
    strict: true
  }).sanitized;
}

// Sanitize email addresses
export function sanitizeEmail(input: string): string {
  // Basic email character allowlist
  const cleaned = input.replace(/[^a-zA-Z0-9@._\-]/g, '');
  return sanitizeInput(cleaned, {
    allowHTML: false,
    maxLength: 254, // RFC 5321 limit
    trimWhitespace: true,
    strict: true
  }).sanitized;
}

// Sanitize usernames (admin usernames)
export function sanitizeUsername(input: string): string {
  // Allow alphanumeric, underscore, hyphen
  const cleaned = input.replace(/[^a-zA-Z0-9_\-]/g, '');
  return sanitizeInput(cleaned, {
    allowHTML: false,
    maxLength: 50,
    trimWhitespace: true,
    strict: true
  }).sanitized;
}

// Sanitize URLs
export function sanitizeURL(input: string): string {
  const result = sanitizeInput(input, {
    allowHTML: false,
    maxLength: 2048,
    trimWhitespace: true,
    strict: true
  });
  
  // Additional URL validation
  try {
    const url = new URL(result.sanitized);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }
    return result.sanitized;
  } catch {
    return ''; // Invalid URL format
  }
}

// Validate and sanitize form data
export function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Apply appropriate sanitization based on field name
      if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('username')) {
        sanitized[key] = sanitizeUsername(value);
      } else if (key.toLowerCase().includes('url')) {
        sanitized[key] = sanitizeURL(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'number') {
      // Validate numbers are within reasonable ranges
      if (isNaN(value) || !isFinite(value)) {
        sanitized[key] = 0;
      } else {
        sanitized[key] = Math.max(0, Math.min(value, 999999)); // Reasonable limits
      }
    } else {
      // For non-string, non-number values, convert to string and sanitize
      sanitized[key] = sanitizeText(String(value));
    }
  }
  
  return sanitized;
}

// Security audit logging
export function logSecurityEvent(event: string, details: unknown) {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event,
    details,
    severity: 'WARNING'
  };
  
  console.warn('SECURITY EVENT:', securityLog);
  
  // In production, you would send this to a security monitoring service
  // Example: await sendToSecurityMonitoring(securityLog);
} 