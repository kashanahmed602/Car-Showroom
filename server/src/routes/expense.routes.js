import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expense.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('ADMIN', 'EMPLOYEE'), getExpenses);
router.get('/:id', authorize('ADMIN', 'EMPLOYEE'), getExpenseById);
router.post('/', authorize('ADMIN', 'EMPLOYEE'), createExpense);
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), updateExpense);
router.delete('/:id', authorize('ADMIN'), deleteExpense);

export default router;


