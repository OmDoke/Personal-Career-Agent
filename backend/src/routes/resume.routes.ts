import { Router } from 'express';
import { processResume, generatePdfFromOptimization } from '../controllers/resume.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.post('/analyze', upload.single('resume'), processResume);
router.post('/generate-pdf', generatePdfFromOptimization);

export default router;
