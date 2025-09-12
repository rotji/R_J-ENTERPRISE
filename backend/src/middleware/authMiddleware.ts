import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler';
import User from '../database/models/User';
import { Document, Types } from 'mongoose';

import { IUser } from '../database/models/User';

// Extend Express Request interface to include user
export interface IUserPayload {
  id: string;
  role: string;
}

export interface IRequestWithUser extends Request {
  user?: (IUser & Document) | null;
}

interface IDecodedToken extends jwt.JwtPayload {
  id: string;
}

const protect = asyncHandler(async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IDecodedToken;

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
