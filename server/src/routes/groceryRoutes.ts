import { Router } from 'express';
import {
  getGroceryList,
  addGroceryItem,
  togglePurchased,
  addCheckedToPantry,
  deleteGroceryItem,
  addMissingFromRecipe,
} from '../controllers/groceryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getGroceryList);
router.post('/', addGroceryItem);
router.post('/add-recipe-missing', addMissingFromRecipe);
router.patch('/:id/toggle', togglePurchased);
router.post('/transfer-to-pantry', addCheckedToPantry);
router.delete('/:id', deleteGroceryItem);

export default router;
