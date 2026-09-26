import { Router } from 'express';
import { getRecommendedRecipes, getRecipeById, scaleRecipe } from '../controllers/recipeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/recommendations', getRecommendedRecipes);
router.get('/:id', getRecipeById);
router.post('/:id/scale', scaleRecipe);

export default router;
