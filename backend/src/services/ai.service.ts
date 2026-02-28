import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client (Assumes API key is in environment variable API_KEY)
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
    console.warn('WARNING: Gemini API Key is missing. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

export const analyzeResume = async (resumeText: string, jobDescription: string) => {
    try {
        const prompt = `
You are an expert ATS (Applicant Tracking System) parser and an elite Technical Recruiter.
Your task is to analyze the provided resume against the given job description and output ONE clean JSON object.
Do not use any markdown formatting, do not wrap the JSON in \`\`\`json blocks. Just output raw JSON.

Job Description:
${jobDescription}

Resume:
${resumeText}

Analyze the resume and return a strict JSON object matching this exact structure:
{
    "atsScore": number (0-100),
    "analysis": "A detailed 4-point markdown formatted analysis containing: 1. Overall Match, 2. Key matching skills, 3. Missing skills, 4. Actionable recommendations. (Use raw \n for newlines in this string)",
    "optimizedData": {
        "header": { "name": "...", "email": "...", "phone": "...", "linkedin": "...", "github": "..." },
        "summary": "A 2-3 line ATS-optimized professional summary organically incorporating some missing JD keywords.",
        "skills": { 
            "languages": "Comma separated list", 
            "frameworks": "Comma separated list", 
            "tools": "Comma separated list",
            "other": "Comma separated list"
         },
        "experience": [
            {
                "company": "...",
                "role": "...",
                "dates": "...",
                "bullets": ["Bullet 1 with woven keywords...", "Bullet 2..."]
            }
        ],
        "projects": [
            {
             "name": "...",
             "techStack": "...",
             "bullets": ["Bullet 1...", "Bullet 2..."]
            }
        ],
        "education": [
            { "degree": "...", "university": "...", "year": "..." }
        ]
    }
}

CRITICAL INSTRUCTIONS:
- Organic keywords: Weave missing JD keywords organically into the existing experience and projects bullets to target a 90%+ ATS score.
- DO NOT hallucinate: Do not make up fake companies, degrees, or timeframes. Enhance the *descriptions* of existing work to highlight relevance.
- Return ONLY valid JSON.
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Strip markdown JSON block if Gemini accidentally wraps it
        if (text.startsWith('\`\`\`json')) {
            text = text.replace(/^\`\`\`json\s*/, '');
        }
        if (text.startsWith('\`\`\`')) {
            text = text.replace(/^\`\`\`\s*/, '');
        }
        text = text.replace(/\s*\`\`\`$/, '');

        // Parse and return to ensure it's valid JSON
        return JSON.parse(text);
    } catch (error) {
        console.error('Error calling Gemini AI:', error);
        throw new Error('Failed to analyze the resume using AI.');
    }
};
