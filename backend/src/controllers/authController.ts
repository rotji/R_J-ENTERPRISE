import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('--- UNCAUGHT REGISTRATION ERROR ---');
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      console.error('FATAL ERROR: JWT_SECRET is not defined.');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await user.matchPassword(password);

      const issueToken = () => {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
          expiresIn: '30d',
        });
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token,
        });
      };

      if (isMatch) {
        return issueToken();
      } else if (user.password === password) {
        // Legacy user with plain text password, hash and save
        user.password = password;
        await user.save();
        return issueToken();
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('--- UNCAUGHT LOGIN ERROR ---');
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
