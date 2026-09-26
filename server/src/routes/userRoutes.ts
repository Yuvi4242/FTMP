import { Router } from 'express';
import {
  getProfile,
  updatePreferences,
  updateNotifications,
  getWasteStats,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/preferences', updatePreferences);
router.put('/notifications', updateNotifications);
router.get('/waste-stats', getWasteStats);

export default router;
