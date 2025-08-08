import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import Pool from '../database/models/Pool';
import { IRequestWithUser } from '../middleware/authMiddleware';

// @desc    Create a new pool
// @route   POST /api/pools
// @access  Private
const createPool = asyncHandler(async (req: IRequestWithUser, res: Response) => {
  const { title, description, amount, closingDate, location } = req.body;

  if (!title || !description || !amount || !closingDate || !location) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const pool = new Pool({
    title,
    description,
    amount,
    closingDate,
    location,
    creator: req.user._id,
  });

  const createdPool = await pool.save();
  res.status(201).json(createdPool);
});

export { createPool };
