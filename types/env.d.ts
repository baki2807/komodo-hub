declare namespace NodeJS {
  interface ProcessEnv {
    CLERK_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    DATABASE_URL: string;
  }
} 