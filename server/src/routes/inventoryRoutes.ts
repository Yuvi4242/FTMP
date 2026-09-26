import { Router } from 'express';
import {
  getInventory,
  getInventorySummary,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getInventory);
router.get('/summary', getInventorySummary);
router.post('/', addInventoryItem);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;
