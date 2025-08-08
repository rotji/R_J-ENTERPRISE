import express from 'express';
import { createPool } from '../controllers/poolController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createPool);

export default router;
