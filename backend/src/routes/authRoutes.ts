import express from 'express';
import { registerUser } from '../controllers/authController';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();

router.post('/register', asyncHandler(registerUser));

export default router;
