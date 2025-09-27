import { Response } from 'express';
import { Schema } from 'mongoose';
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

  const userId = req.user?._id;
  if (!userId) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const pool = new Pool({
    title,
    description,
    amount,
    closingDate,
    location,
    creator: userId as Schema.Types.ObjectId,
  });

  const createdPool = await pool.save();
  res.status(201).json(createdPool);
});

// @desc    Get all pools
// @route   GET /api/pools
// @access  Public
const getPools = asyncHandler(async (req: IRequestWithUser, res: Response) => {
  const keyword = req.query.search
    ? {
        $text: {
          $search: req.query.search as string,
          $caseSensitive: false,
        },
      }
    : {};

  const pools = await Pool.find({ ...keyword }).sort({ createdAt: -1 });
  res.json(pools);
});

// @desc    Join a pool
// @route   POST /api/pools/:id/join
// @access  Private
const joinPool = asyncHandler(async (req: IRequestWithUser, res: Response) => {
  const pool = await Pool.findById(req.params.id);

  if (!pool) {
    res.status(404);
    throw new Error('Pool not found');
  }

  const userId = req.user?._id;
  if (!userId) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const userObjectId = userId as Schema.Types.ObjectId;

  const alreadyMember = pool.members.find(
    (memberId) => memberId.toString() === userObjectId.toString()
  );

  if (alreadyMember) {
    res.status(400);
    throw new Error('You are already a member of this pool');
  }

  pool.members.push(userObjectId);
  await pool.save();

  res.json(pool);
});

export { createPool, getPools, joinPool };
