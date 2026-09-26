import { Router } from 'express';
import multer from 'multer';
import { processScan, confirmScanIngredients } from '../controllers/scanController';
import { authenticate } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.use(authenticate);

// Scan image upload & AI vision processing
router.post('/upload', upload.single('image'), processScan);

// Confirm detected bounding boxes & ingredients into inventory
router.post('/confirm', confirmScanIngredients);

export default router;
