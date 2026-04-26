import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  if (!auth) {
    console.error("Firebase Auth not initialized");
    return res.status(500).json({ error: 'Internal Server Error: Auth service unavailable' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user && user.admin === true) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admin access only' });
  }
};
