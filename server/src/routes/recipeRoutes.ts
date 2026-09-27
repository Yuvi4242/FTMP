import { Router } from 'express';
import {
  getRecommendedRecipes,
  getRecipeById,
  scaleRecipe,
  generateCustomRecipe,
  getSubstitutions,
  getZeroWasteMealPlan,
} from '../controllers/recipeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/recommendations', getRecommendedRecipes);
router.post('/custom-generate', generateCustomRecipe);
router.get('/substitutions', getSubstitutions);
router.get('/meal-plan', getZeroWasteMealPlan);
router.get('/:id', getRecipeById);
router.post('/:id/scale', scaleRecipe);

export default router;
