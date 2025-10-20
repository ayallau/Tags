declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      MONGO_URI: string;
      CLIENT_ORIGIN: string;
      CLIENT_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      PASSWORD_PEPPER: string;
      COOKIE_KEY: string;
      BCRYPT_ROUNDS?: string;
      SSL_ENABLED?: string;
      SSL_CERT_PATH?: string;
      SSL_KEY_PATH?: string;
      // Email settings (optional)
      EMAIL_HOST?: string;
      EMAIL_PORT?: string;
      EMAIL_SECURE?: string;
      EMAIL_USER?: string;
      EMAIL_PASS?: string;
      // SMTP settings (optional)
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_SECURE?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
    }
  }
}

export {};

