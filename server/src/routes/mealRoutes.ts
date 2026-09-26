import { Router } from 'express';
import { logMealCooked, getMealHistory } from '../controllers/mealController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/cook', logMealCooked);
router.get('/history', getMealHistory);

export default router;
