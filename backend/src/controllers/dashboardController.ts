import { Request, Response } from 'express';
import User from '../database/models/User';
import Pool from '../database/models/Pool';
import Bid from '../database/models/Bid';
import Transaction from '../database/models/Transaction';

// @desc    Get user dashboard data
// @route   GET /api/dashboards/user
// @access  Private
export const getUserDashboard = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;
  try {
    const pools = await Pool.find({ creator: userId });
    const transactions = await Transaction.find({ user: userId });
    res.json({ pools, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboards/admin
// @access  Private/Admin
export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const poolCount = await Pool.countDocuments();
    const bidCount = await Bid.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed', type: 'payment' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      userCount,
      poolCount,
      bidCount,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get supplier dashboard data
// @route   GET /api/dashboards/supplier
// @access  Private/Supplier
export const getSupplierDashboard = async (req: Request, res: Response) => {
  // @ts-ignore
  const supplierId = req.user.id;
  try {
    const bids = await Bid.find({ supplier: supplierId });
    const transactions = await Transaction.find({ user: supplierId });
    res.json({ bids, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
