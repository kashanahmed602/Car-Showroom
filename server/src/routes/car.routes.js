import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages,
  updateCarImage,
  deleteCarImage,
  bulkUploadCars
} from '../controllers/car.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes (for customer portal)
router.get('/public', getCars);
router.get('/public/:id', getCarById);

// Protected routes
router.use(authenticate);
router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', authorize('ADMIN', 'EMPLOYEE'), createCar);
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), updateCar);
router.delete('/:id', authorize('ADMIN'), deleteCar);
router.post('/:id/images', authorize('ADMIN', 'EMPLOYEE'), upload.array('images', 10), uploadCarImages);
router.put('/:id/images/:imageId', authorize('ADMIN', 'EMPLOYEE'), updateCarImage);
router.delete('/images/:imageId', authorize('ADMIN', 'EMPLOYEE'), deleteCarImage);
router.post('/bulk-upload', authorize('ADMIN'), bulkUploadCars);

export default router;


