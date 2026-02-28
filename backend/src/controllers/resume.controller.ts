import { Request, Response } from 'express';
import { extractTextFromPDF } from '../services/pdf.service';
import { analyzeResume } from '../services/ai.service';
import fs from 'fs';

export const processResume = async (req: Request, res: Response): Promise<void> => {
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

        const filePath = req.file.path;

        // 1. Extract text from the PDF
        const resumeText = await extractTextFromPDF(filePath);

        // 2. Pass text + job description to Gemini AI
        const analysisResult = await analyzeResume(resumeText, jobDescription);

        res.status(200).json({
            message: 'Resume analyzed successfully',
            analysis: analysisResult
        });

    } catch (error: any) {
        console.error('Error during resume processing:', error);
        res.status(500).json({ error: error.message || 'Server error during analysis.' });
    } finally {
        // Optional: Clean up the uploaded file immediately after processing to save space
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(`Failed to delete temporary file ${req.file?.path}`);
            });
        }
    }
};
