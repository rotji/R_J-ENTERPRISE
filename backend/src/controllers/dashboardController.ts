import { Response } from 'express';
import User from '../database/models/User';
import Pool from '../database/models/Pool';
import Bid from '../database/models/Bid';
import Transaction from '../database/models/Transaction';
import { IRequestWithUser } from '../middleware/authMiddleware';

// @desc    Get user dashboard data
// @route   GET /api/dashboards/user
// @access  Private
export const getUserDashboard = async (req: IRequestWithUser, res: Response) => {
  const userId = req.user?._id;
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
export const getAdminDashboard = async (req: IRequestWithUser, res: Response) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const dailyUsers = await User.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } });
    const weeklyUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const monthlyUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const dailyRevenue = await Transaction.aggregate([
      { $match: { status: 'completed', type: 'payment', createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const weeklyRevenue = await Transaction.aggregate([
        { $match: { status: 'completed', type: 'payment', createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthlyRevenue = await Transaction.aggregate([
        { $match: { status: 'completed', type: 'payment', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const dailyPools = await Pool.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } });
    const weeklyPools = await Pool.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const monthlyPools = await Pool.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const allBids = await Bid.find({}).populate('pool', 'title').populate('supplier', 'username');

    res.json({
      users: {
        daily: dailyUsers,
        weekly: weeklyUsers,
        monthly: monthlyUsers,
      },
      revenue: {
        daily: dailyRevenue.length > 0 ? dailyRevenue[0].total : 0,
        weekly: weeklyRevenue.length > 0 ? weeklyRevenue[0].total : 0,
        monthly: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
      },
      pools: {
        daily: dailyPools,
        weekly: weeklyPools,
        monthly: monthlyPools,
      },
      allBids,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get supplier dashboard data
// @route   GET /api/dashboards/supplier
// @access  Private/Supplier
export const getSupplierDashboard = async (req: IRequestWithUser, res: Response) => {
  const supplierId = req.user?._id;
  try {
    const bids = await Bid.find({ supplier: supplierId });
    const transactions = await Transaction.find({ user: supplierId });
    res.json({ bids, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
