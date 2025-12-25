import express from 'express';
import {
  getDashboardStats,
  getSalesReport,
  getProfitReport,
  getEmployeePerformance,
  exportSalesReport
} from '../controllers/report.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/dashboard', authorize('ADMIN', 'EMPLOYEE'), getDashboardStats);
router.get('/sales', authorize('ADMIN', 'EMPLOYEE'), getSalesReport);
router.get('/profit', authorize('ADMIN', 'EMPLOYEE'), getProfitReport);
router.get('/employees', authorize('ADMIN'), getEmployeePerformance);
router.get('/export/sales', authorize('ADMIN', 'EMPLOYEE'), exportSalesReport);

export default router;


