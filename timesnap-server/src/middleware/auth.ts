import { Request, Response, NextFunction } from 'express';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.admin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}
