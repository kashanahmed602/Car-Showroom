import express from 'express';
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSaleInvoice
} from '../controllers/sale.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('ADMIN', 'EMPLOYEE'), getSales);
router.get('/:id', authorize('ADMIN', 'EMPLOYEE'), getSaleById);
router.get('/:id/invoice', authorize('ADMIN', 'EMPLOYEE'), getSaleInvoice);
router.post('/', authorize('ADMIN', 'EMPLOYEE'), createSale);
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), updateSale);
router.delete('/:id', authorize('ADMIN'), deleteSale);

export default router;


