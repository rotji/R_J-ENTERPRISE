import express from 'express';
import {
  getUserDashboard,
  getAdminDashboard,
  getSupplierDashboard,
} from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';
import { admin, supplier } from '../middleware/roleMiddleware';

const router = express.Router();

router.route('/user').get(protect, getUserDashboard);
router.route('/admin').get(protect, admin, getAdminDashboard);
router.route('/supplier').get(protect, supplier, getSupplierDashboard);

export default router;
