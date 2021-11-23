declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    BASE_URL: string;
    ENABLE_INAPP_CONSUME: string;
  }
}
