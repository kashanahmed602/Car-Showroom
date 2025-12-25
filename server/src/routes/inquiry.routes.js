import express from 'express';
import {
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  getInquiryStats
} from '../controllers/inquiry.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'EMPLOYEE'));

router.get('/stats', getInquiryStats);
router.get('/', getInquiries);
router.get('/:id', getInquiryById);
router.put('/:id', updateInquiry);
router.delete('/:id', authorize('ADMIN'), deleteInquiry);

export default router;

