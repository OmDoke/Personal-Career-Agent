import { Request, Response } from 'express';
import { extractTextFromPDF } from '../services/pdf.service';
import { analyzeResume, enhanceResume } from '../services/ai.service';
import { generateATSResumePDF } from '../services/pdfGenerator.service';
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

export const generatePdfFromOptimization = async (req: Request, res: Response): Promise<void> => {
    try {
        const { optimizedData } = req.body;

        if (!optimizedData) {
            res.status(400).json({ error: 'Optimized data is required to generate the PDF.' });
            return;
        }

        // Generate the PDF Buffer
        const pdfBuffer = await generateATSResumePDF(optimizedData);

        // Send back as a file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=ATS_Optimized_Resume.pdf');
        res.send(pdfBuffer);

    } catch (error: any) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Server error generating PDF.' });
    }
};

export const enhanceResumeData = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No resume file uploaded.' });
            return;
        }

        const { prompt, force } = req.body;
        if (!prompt) {
            res.status(400).json({ error: 'Enhancement prompt is required.' });
            return;
        }

        const isForce = force === 'true' || force === true;
        const filePath = req.file.path;

        // 1. Extract text from the PDF
        const resumeText = await extractTextFromPDF(filePath);

        // 2. Pass text + prompt to Gemini AI
        const enhancementResult = await enhanceResume(resumeText, prompt, isForce);

        res.status(200).json({
            message: 'Resume enhanced successfully',
            analysis: enhancementResult
        });

    } catch (error: any) {
        console.error('Error during resume enhancement:', error);
        res.status(500).json({ error: error.message || 'Server error during enhancement.' });
    } finally {
        // Optional: Clean up the uploaded file immediately after processing to save space
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(`Failed to delete temporary file ${req.file?.path}`);
            });
        }
    }
};
