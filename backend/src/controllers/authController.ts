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
   console.log('📩 Register attempt:', { username, email, rawPassword: password });

  const userExists = await User.findOne({ email });
  console.log('🔍 Checking if user exists:', userExists);

  if (userExists) {
    console.log('⚠️ User already exists:', email);
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ username, email, password: password, // Use the original password here
  
  });
  console.log('✅ New user created. Stored user object:', user);

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
  console.log('🔑 Login attempt:', { email, rawPassword: password });

  try {
    const user = await User.findOne({ email: email.trim() });
    console.log('📂 User found in DB:', user);

    if (user) {
  console.log("🔐 Attempting login for:", email);
  console.log("👉 Raw password entered:", password);
  console.log("👉 Hashed password in DB:", user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("✅ Password match result:", isMatch);

  if (isMatch) {
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
} else {
  res.status(401);
  throw new Error('Invalid email or password');
}

  } catch (error) {
    console.error('💥 Login error:', error);
    next(error);
  }
};
