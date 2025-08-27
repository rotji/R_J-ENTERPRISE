import { Request, Response, NextFunction } from 'express';
import User from '../database/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ username, email, password: password, // Use the original password here
  
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.trim() });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};
