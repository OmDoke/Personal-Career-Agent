# Personal Career Agent

An AI-powered Applicant Tracking System (ATS) resume optimization platform.

This platform allows users to upload their existing PDF resumes alongside a target job description. The system securely extracts the text from the PDF, performs a gap analysis using Google's Gemini AI, and provides an instant, actionable, and truthful breakdown of missing keywords and matches to improve their ATS score.

## Features

- **Modern Premium UI:** Built with Vite, React, and Tailwind CSS using customized design tokens, glassmorphism, and subtle micro-animations for a stunning look.
- **Secure File Upload:** Uses Multer to smoothly handle and temporarily store PDF uploads.
- **Advanced Parsing:** Implements `pdf-parse` to accurately pull text data from resumes.
- **AI Gap Analysis:** Integrated with `@google/generative-ai` to compare your resume against the Job Description and return actionable missing keywords.
- **Automated Cleanup:** Built-in node-cron jobs continuously sweep temporary storage directories to ensure privacy and optimize disk usage.

## Tech Stack

**Frontend:**
- Vite (React + TypeScript)
- Tailwind CSS (with `tailwind-merge` and `clsx` utilities)
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- TypeScript
- Multer
- Google Generative AI (`gemini-1.5-pro`)
- `pdf-parse`
- `node-cron`
- `dotenv`

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Google Gemini API Key.

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-link>
cd Personal-Career-Agent
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory and add your key:
\`\`\`env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

Start the backend server:
\`\`\`bash
npm run dev
# Server will run on http://localhost:5000
\`\`\`

### Production Deployment (Single Server on Render)

We have configured the application so that the Node.js backend automatically serves the pre-built React frontend. This means you only need to deploy **one** Web Service on Render, which will host both!

1. **Create a new Web Service** on Render and connect your GitHub repository.
2. **Setup Details**:
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
3. **Environment Variables**:
    - Add `GEMINI_API_KEY`: Your exact Google Gemini API Key. (No frontend URL needed!).
4. Click **Deploy**. Render will install all dependencies for both the frontend and backend, build the React app, build the Express server, and start the node process serving both on the same URL!

## Usage
1. Make sure the server is running (locally or deployed).
2. If local, visit `http://localhost:5000`. If deployed, visit your Render service URL.
3. Click "Start Optimization" to proceed to the Analyzer page.
4. Upload your resume PDF and paste the Job Description.
5. Click "Analyze Now" to receive your custom ATS optimization list!
