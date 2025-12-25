import express from 'express';
import { body } from 'express-validator';
import {
  getPublicCars,
  getPublicCarById,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  createInquiry
} from '../controllers/public.controller.js';

const router = express.Router();

router.get('/cars', getPublicCars);
router.get('/cars/:id', getPublicCarById);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:carId', removeFromWishlist);
router.get('/wishlist/:email', getWishlist);
router.post(
  '/inquiry',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required').trim(),
    body('message').notEmpty().withMessage('Message is required').trim(),
    body('carId').optional().isUUID().withMessage('Invalid car ID')
  ],
  createInquiry
);

export default router;


