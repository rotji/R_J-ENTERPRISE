import { Response, NextFunction } from 'express';
import { IRequestWithUser } from './authMiddleware';

export const admin = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export const supplier = (req: IRequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'supplier') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a supplier');
  }
};
