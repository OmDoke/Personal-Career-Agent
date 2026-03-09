import { Router } from 'express';
import { processResume, generatePdfFromOptimization, enhanceResumeData } from '../controllers/resume.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.post('/analyze', upload.single('resume'), processResume);
router.post('/enhance', upload.single('resume'), enhanceResumeData);
router.post('/generate-pdf', generatePdfFromOptimization);

export default router;
