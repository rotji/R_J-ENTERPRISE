

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  // ✅ Use "username" instead of "name" to match the User schema
  const { username, email, password } = req.body;

  try {
    // ✅ Mongoose style: no "where"
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashing is handled by Mongoose pre-save middleware in the User model
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
        // Legacy user with plain text password
        // Hash the password and update the user
        user.password = password; // The pre-save hook will hash it
        await user.save();
        return issueToken();
      }
    }

    // If no user or password mismatch
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
