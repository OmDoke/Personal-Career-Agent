import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Load environment variables
dotenv.config();

import routes from './routes';
import { startCleanupJob } from './utils/cron.util';

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use(routes);

// --- SERVE FRONTEND (PRODUCTION) ---
// In production, serve the built React files from the frontend/dist directory
if (process.env.NODE_ENV === 'production') {
    const frontendDistPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDistPath));

    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
}

// --- GLOBAL ERROR HANDLER ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// --- START AUTOMATED CLEANUP ---
startCleanupJob();

export default app;
