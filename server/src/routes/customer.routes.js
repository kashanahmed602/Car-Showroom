import express from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerPurchases
} from '../controllers/customer.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('ADMIN', 'EMPLOYEE'), getCustomers);
router.get('/:id', authorize('ADMIN', 'EMPLOYEE'), getCustomerById);
router.get('/:id/purchases', authorize('ADMIN', 'EMPLOYEE'), getCustomerPurchases);
router.post('/', authorize('ADMIN', 'EMPLOYEE'), createCustomer);
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), updateCustomer);
router.delete('/:id', authorize('ADMIN'), deleteCustomer);

export default router;


