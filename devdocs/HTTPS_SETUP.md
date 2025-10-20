# HTTPS Configuration Guide

## Overview

This project has been configured to support HTTPS for secure communication between the server and clients.

## SSL Certificate Setup

### For Development (Self-Signed Certificates)

1. **Create certificates directory:**

   ```bash
   mkdir apps/server/certs
   ```

2. **Generate self-signed certificate:**

   ```bash
   # Generate private key
   openssl genrsa -out apps/server/certs/server.key 2048

   # Generate certificate
   openssl req -new -x509 -key apps/server/certs/server.key -out apps/server/certs/server.crt -days 365 -subj "/C=IL/ST=Israel/L=Tel Aviv/O=Tags/OU=Development/CN=localhost"
   ```

### For Production

Use a trusted Certificate Authority (CA) like Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificates will be in /etc/letsencrypt/live/yourdomain.com/
```

## Environment Configuration

### Server (.env)

```env
SSL_ENABLED=true
SSL_CERT_PATH=./certs/server.crt
SSL_KEY_PATH=./certs/server.key
CLIENT_ORIGIN=https://localhost:3001
CLIENT_URL=https://localhost:3001
```

### Web App (.env)

```env
VITE_API_BASE_URL=https://localhost:5173
```

### Mobile App (.env)

```env
EXPO_PUBLIC_API_BASE_URL=https://localhost:0000
```

## Running with HTTPS

1. **Start the server:**

   ```bash
   cd apps/server
   npm run dev
   ```

2. **Start the web app:**

   ```bash
   cd apps/web
   npm run dev
   ```

3. **Access the applications:**
   - Server API: `https://localhost:3001`
   - Web App: `http://localhost:5173` (Vite dev server)
   - API Documentation: `https://localhost:3001/docs`

## Browser Security Warnings

When using self-signed certificates, browsers will show security warnings. To proceed:

1. **Chrome/Edge:** Click "Advanced" → "Proceed to localhost (unsafe)"
2. **Firefox:** Click "Advanced" → "Accept the Risk and Continue"
3. **Safari:** Click "Show Details" → "visit this website"

## Production Considerations

1. **Use trusted certificates** from a CA
2. **Configure proper CORS origins** for your production domains
3. **Set up proper security headers** (HSTS, CSP, etc.)
4. **Use environment-specific configurations**

## Troubleshooting

### Certificate Issues

- Ensure certificate files exist and are readable
- Check file paths in environment variables
- Verify certificate is not expired

### Connection Issues

- Check if ports are available (3001 for server, 5173 for web)
- Verify firewall settings
- Ensure CORS origins match your client URLs

### Development Issues

- Server falls back to HTTP if SSL configuration fails
- Check console logs for SSL-related errors
- Verify environment variables are loaded correctly
