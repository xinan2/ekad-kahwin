import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent clickjacking attacks
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME type confusion attacks
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Enable XSS filtering
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Control referrer information
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()', // Restrict browser features
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://hcaptcha.com https://*.hcaptcha.com",
              "style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com",
              "frame-src https://hcaptcha.com https://*.hcaptcha.com",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
