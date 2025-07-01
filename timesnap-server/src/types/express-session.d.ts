import 'express-session';

declare module 'express-session' {
  interface SessionData {
    admin?: {
      id: number;
      name: string;
      email: string;
    };
  }
}
