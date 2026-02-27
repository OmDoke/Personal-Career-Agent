import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. DIRECTORY INITIALIZATION ---
// Ensure temporary directories exist for Render's ephemeral storage
const UPLOADS_DIR = path.join(__dirname, '../tmp/uploads');
const GENERATED_DIR = path.join(__dirname, '../tmp/generated');

[UPLOADS_DIR, GENERATED_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 3. MULTER UPLOAD CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        // Append timestamp to prevent file name collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- 4. ROUTES ---

// Health Check Endpoint (For React frontend to wake up Render instance)
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Personal Career Agent server is awake!' });
});

// Placeholder for the main processing route
// You will move this to a dedicated resume.routes.ts file later
app.post('/api/resume/analyze', upload.single('resume'), (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No resume file uploaded.' });
            return;
        }

        const { jobDescription } = req.body;
        if (!jobDescription) {
            res.status(400).json({ error: 'Job description is required.' });
            return;
        }

        // TODO: Pass req.file.path and jobDescription to your parsing and AI services here.

        res.status(200).json({
            message: 'File received successfully',
            filePath: req.file.path
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during upload.' });
    }
});

// Global Error Handler for Multer and other errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// --- 5. AUTOMATED CLEANUP (CRON JOB) ---
// Runs at minute 0 past every hour to wipe older files from /tmp
cron.schedule('0 * * * *', () => {
    console.log('Running hourly cleanup of /tmp directories...');

    const cleanDirectory = (directory: string) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                console.error(`Failed reading directory ${directory}`, err);
                return;
            }

            const now = Date.now();
            const ONE_HOUR = 60 * 60 * 1000;

            for (const file of files) {
                if (file === '.gitkeep') continue;

                const filePath = path.join(directory, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return;
                    // Only delete if the file was created more than exactly 1 hour ago
                    if (now - stats.mtimeMs > ONE_HOUR) {
                        fs.unlink(filePath, err => {
                            if (err) console.error(`Failed to delete ${filePath}`);
                        });
                    }
                });
            }
        });
    };

    cleanDirectory(UPLOADS_DIR);
    cleanDirectory(GENERATED_DIR);
});

// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
