import { Router } from 'express';
import {
  getGroceryList,
  addGroceryItem,
  togglePurchased,
  addCheckedToPantry,
  deleteGroceryItem,
} from '../controllers/groceryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getGroceryList);
router.post('/', addGroceryItem);
router.patch('/:id/toggle', togglePurchased);
router.post('/transfer-to-pantry', addCheckedToPantry);
router.delete('/:id', deleteGroceryItem);

export default router;
