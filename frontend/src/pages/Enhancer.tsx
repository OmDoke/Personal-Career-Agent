import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, ArrowLeft, Sparkles, Download, RotateCcw, Eye } from 'lucide-react';
import { resumeApi } from '../api/resumeApi';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function Enhancer() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Reset result on new file
    }
  };

  const handleEnhance = async (isForce: boolean = false) => {
    if (!file || !prompt) return;
    
    setLoading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('prompt', prompt);
    formData.append('force', String(isForce));

    try {
      const response = await resumeApi.enhanceResume(formData);
      setResult(response.analysis);
    } catch (error) {
      console.error('Enhancement failed:', error);
      setResult({ error: 'Failed to enhance the resume. Please ensure the backend server is running and your API keys are valid.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!result || !result.optimizedData) return;
    setDownloading(true);
    try {
      const blob = await resumeApi.generatePdf(result.optimizedData);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Custom_Enhanced_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to generate enhanced PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePreviewPdf = async () => {
    if (!result || !result.optimizedData) return;
    setDownloading(true); // Re-using downloading state for loading indication
    try {
      const blob = await resumeApi.generatePdf(result.optimizedData);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to preview PDF:', error);
      alert('Failed to generate PDF preview.');
    } finally {
      setDownloading(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden">
        {/* Background ambient gradients */}
       <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/50 via-pink-50/50 to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
        
      <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-fade-in-up">
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="space-y-2">
          <h1 className="text-4xl font-display font-extrabold tracking-tight text-slate-900">Custom Resume Enhancer</h1>
          <p className="text-slate-500 text-lg">Upload your resume and tell us exactly what to add or change. Get a custom PDF instantly.</p>
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
                <CardTitle>2. Enter Your Request</CardTitle>
                <CardDescription>What should we add or change?</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-white text-sm focus-visible:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-shadow"
                  placeholder="e.g. Add that I worked at Google as a Senior Frontend Engineer from Jan 2020 to Dec 2023... or 'Add a 1-year employment gap for travel in 2022'..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </CardContent>
            </Card>

            {result && result.isMismatch ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <h4 className="font-bold text-amber-800 mb-1">Mismatch Detected</h4>
                    <p className="text-sm text-amber-700 mb-3">{result.analysis}</p>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => handleEnhance(true)} 
                            disabled={loading}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Proceed Anyway (Force)
                        </Button>
                        <Button 
                            onClick={() => setResult(null)} 
                            variant="outline"
                            className="border-amber-200 text-amber-700 hover:bg-amber-100"
                        >
                          Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <Button 
                    onClick={() => handleEnhance(false)} 
                    disabled={!file || !prompt || loading}
                    className="w-full h-14 text-base bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Enhance Resume
                    </>
                  )}
                </Button>
            )}
          </div>

          {/* Result Column */}
          <div className="space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Enhancement Result</CardTitle>
                <CardDescription>Review your changes below.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {result ? (
                    result.error ? (
                        <div className="text-red-500 font-medium bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                            {result.error}
                        </div>
                    ) : (
                        <div className="flex flex-col h-full gap-4">
                            <div className="prose prose-sm prose-slate max-w-none bg-white p-6 rounded-xl border border-slate-100 shadow-inner overflow-y-auto whitespace-pre-wrap flex-1 max-h-[400px]">
                               <strong className="text-slate-900 block mb-2">Summary of Changes:</strong>
                               {result.analysis}
                            </div>

                            {/* Download / Retake / Preview Buttons */}
                            {result.optimizedData && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Button 
                                        onClick={handlePreviewPdf} 
                                        disabled={downloading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                                    >
                                        {downloading ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Eye className="w-4 h-4 mr-2" />
                                        )}
                                        {downloading ? 'Loading...' : 'Preview PDF'}
                                    </Button>

                                    <Button 
                                        onClick={handleDownloadPdf} 
                                        disabled={downloading}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
                                    >
                                        {downloading ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4 mr-2" />
                                        )}
                                        {downloading ? 'Downloading...' : 'Download PDF'}
                                    </Button>
                                    
                                    <Button 
                                        onClick={handleRetake} 
                                        variant="outline"
                                        className="shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 w-full sm:w-auto mt-2 sm:mt-0"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Retake
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
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
