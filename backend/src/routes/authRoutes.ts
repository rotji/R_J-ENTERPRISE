import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import asyncHandler from '../utils/asyncHandler';

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

export default router;
