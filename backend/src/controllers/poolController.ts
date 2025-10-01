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

  // Get the highest pool number and increment by 1
  const lastPool = await Pool.findOne().sort({ poolNumber: -1 });
  let nextPoolNumber = 1;
  
  if (lastPool && typeof lastPool.poolNumber === 'number' && !isNaN(lastPool.poolNumber)) {
    nextPoolNumber = lastPool.poolNumber + 1;
  } else {
    // If no pools exist or poolNumber is invalid, start from 1
    // Also handle case where existing pools don't have poolNumber field
    const poolCount = await Pool.countDocuments();
    nextPoolNumber = poolCount + 1;
  }

  const pool = new Pool({
    title,
    description,
    amount,
    closingDate,
    location,
    creator: userId as Schema.Types.ObjectId,
    poolNumber: nextPoolNumber,
  });

  const createdPool = await pool.save();
  res.status(201).json(createdPool);
});

// @desc    Remove expired pools
// @route   Internal function
// @access  Internal
const removeExpiredPools = async () => {
  const currentDate = new Date();
  await Pool.deleteMany({ closingDate: { $lt: currentDate } });
};

// @desc    Fix existing pools without poolNumber (one-time migration)
// @route   Internal function
// @access  Internal
const fixPoolNumbers = async () => {
  try {
    // Find pools without poolNumber or with invalid poolNumber
    const poolsWithoutNumber = await Pool.find({
      $or: [
        { poolNumber: { $exists: false } },
        { poolNumber: null },
        { poolNumber: { $type: "string" } }
      ]
    }).sort({ createdAt: 1 }); // Oldest first

    if (poolsWithoutNumber.length > 0) {
      // Get the highest existing valid poolNumber
      const lastValidPool = await Pool.findOne({ 
        poolNumber: { $type: "number", $ne: null } 
      }).sort({ poolNumber: -1 });
      
      let nextNumber = lastValidPool ? lastValidPool.poolNumber + 1 : 1;

      // Assign numbers to pools without valid poolNumber
      for (const pool of poolsWithoutNumber) {
        pool.poolNumber = nextNumber;
        await pool.save();
        nextNumber++;
      }
    }
  } catch (error) {
    console.error('Error fixing pool numbers:', error);
  }
};

// @desc    Get all pools
// @route   GET /api/pools
// @access  Public
const getPools = asyncHandler(async (req: IRequestWithUser, res: Response) => {
  // Remove expired pools before fetching
  await removeExpiredPools();

  // Fix existing pools without poolNumber (one-time migration)
  await fixPoolNumbers();

  const keyword = req.query.search
    ? {
        $text: {
          $search: req.query.search as string,
          $caseSensitive: false,
        },
      }
    : {};

  const pools = await Pool.find({ ...keyword }).sort({ poolNumber: -1 });
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

export { createPool, getPools, joinPool, removeExpiredPools };
