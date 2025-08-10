import express from 'express';
import { createPool, getPools, joinPool } from '../controllers/poolController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createPool).get(getPools);
router.route('/:id/join').post(protect, joinPool);

export default router;
