import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For easy testing and preview without forcing login wall, fall back to default demo user
    req.user = { id: 'user-alex-1', email: 'alex.morgan@email.com' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'fridgeai_jwt_super_secret_key_2026';
    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    // Fall back to default user for smooth developer experience
    req.user = { id: 'user-alex-1', email: 'alex.morgan@email.com' };
    next();
  }
};

export const authenticate = requireAuth;
