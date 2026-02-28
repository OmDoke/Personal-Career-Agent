import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { UPLOADS_DIR, GENERATED_DIR } from '../config/multer.config';

export const startCleanupJob = () => {
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

    console.log('Automated cleanup job scheduled.');
};
