import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { resumeApi } from '../api/resumeApi';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function Analyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) return;
    
    setLoading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await resumeApi.analyzeResume(formData);
      setResult(response.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      setResult('Failed to analyze the resume. Please ensure the backend server is running and your API keys are valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden">
        {/* Background ambient gradients */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100/50 via-indigo-50/50 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
        
      <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-fade-in-up">
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Resume Analyzer</h1>
          <p className="text-slate-500 text-lg">Upload your current PDF resume and the target job description to get instant, ATS-optimized feedback.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Input Form Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Upload Resume</CardTitle>
                <CardDescription>We only accept PDF files.</CardDescription>
              </CardHeader>
              <CardContent>
                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500">
                        <span className="font-semibold">{file ? file.name : 'Click to upload'}</span> or drag and drop
                      </p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Job Description</CardTitle>
                <CardDescription>Paste the target JD here.</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-white text-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow"
                  placeholder="e.g. Seeking a Senior Frontend Engineer with 5+ years of React experience..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
            </Card>

            <Button 
                onClick={handleAnalyze} 
                disabled={!file || !jobDescription || loading}
                className="w-full h-14 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Now
                </>
              )}
            </Button>
          </div>

          {/* Result Column */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
                <CardDescription>Review your AI-generated feedback below.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {result ? (
                    <div className="prose prose-sm prose-slate max-w-none bg-white p-6 rounded-xl border border-slate-100 shadow-inner h-[500px] overflow-y-auto whitespace-pre-wrap">
                       {result}
                    </div>
                ) : (
                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                        <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                        <p>Awaiting inputs...</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
