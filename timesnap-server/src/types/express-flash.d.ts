import 'express';

declare global {
  namespace Express {
    interface Request {
      flash(type: string, message: string): void;
      flash(type: string): string[];
    }
  }
}
