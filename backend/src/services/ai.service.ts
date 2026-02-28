import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client (Assumes API key is in environment variable API_KEY)
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
    console.warn('WARNING: Gemini API Key is missing. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export const analyzeResume = async (resumeText: string, jobDescription: string) => {
    try {
        const prompt = `
You are an expert ATS (Applicant Tracking System) parser and an elite Technical Recruiter.
Analyze the provided resume against the given job description.

Job Description:
${jobDescription}

Resume:
${resumeText}

Provide a detailed analysis including:
1. An overall ATS match score (percentage).
2. Key matching skills.
3. Missing skills or keywords.
4. Actionable recommendations to improve the resume for this specific role.

Format your response clearly using markdown.
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini AI:', error);
        throw new Error('Failed to analyze the resume using AI.');
    }
};
