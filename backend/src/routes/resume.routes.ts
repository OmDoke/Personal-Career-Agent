import { Router } from 'express';
import { processResume } from '../controllers/resume.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.post('/analyze', upload.single('resume'), processResume);

export default router;
