import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeSales
} from '../controllers/employee.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('ADMIN'), getEmployees);
router.get('/:id', authorize('ADMIN'), getEmployeeById);
router.get('/:id/sales', authorize('ADMIN'), getEmployeeSales);
router.post('/', authorize('ADMIN'), createEmployee);
router.put('/:id', authorize('ADMIN'), updateEmployee);
router.delete('/:id', authorize('ADMIN'), deleteEmployee);

export default router;


