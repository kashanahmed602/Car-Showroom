import express from 'express';
import {
  getSettings,
  updateSettings
} from '../controllers/settings.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('ADMIN'), getSettings);
router.put('/', authorize('ADMIN'), upload.single('logo'), updateSettings);

export default router;


