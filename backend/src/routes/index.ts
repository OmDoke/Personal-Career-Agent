import { Router } from 'express';
import healthRoutes from './health.routes';
import resumeRoutes from './resume.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/resume', resumeRoutes);

export default router;
