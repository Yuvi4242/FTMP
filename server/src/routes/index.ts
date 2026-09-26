import { Router } from 'express';
import authRoutes from './authRoutes';
import inventoryRoutes from './inventoryRoutes';
import scanRoutes from './scanRoutes';
import recipeRoutes from './recipeRoutes';
import mealRoutes from './mealRoutes';
import groceryRoutes from './groceryRoutes';
import userRoutes from './userRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FridgeAI Backend Engine',
    version: '1.0.0',
    mode: 'Zero-Waste Solo-Dweller Optimizer',
  });
});

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/scan', scanRoutes);
router.use('/recipes', recipeRoutes);
router.use('/meals', mealRoutes);
router.use('/grocery', groceryRoutes);
router.use('/user', userRoutes);

export default router;
