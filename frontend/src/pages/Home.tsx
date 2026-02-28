import { useEffect, useState } from 'react';
import { resumeApi } from '../api/resumeApi';
import { Link } from 'react-router-dom';
import { FileUp, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function Home() {
  const [serverAwake, setServerAwake] = useState(false);

  // Ping backend to wake up Render instance on load
  useEffect(() => {
    const wakeServer = async () => {
      try {
        await resumeApi.pingHealth();
        setServerAwake(true);
      } catch (err) {
        console.warn('Backend is waking up...', err);
      }
    };
    wakeServer();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4 overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 -z-10 animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      
      <div className="max-w-5xl w-full text-center space-y-8 relative z-10 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-blue-800 text-sm font-semibold tracking-wide mb-2 sm:mb-6 mx-auto animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-blue-500" />
          AI-Powered ATS Optimization
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 tracking-tight text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Format your Resume <br />
          <span className="text-gradient inline-block mt-3">for the Job you Want.</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Upload your resume and the job description. Our agent analyzes your experience, 
          identifies missing keywords, and instantly generates an ATS-optimized PDF—without 
          fabricating any fake experience.
        </p>

        <div className="pt-16 pb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/analyzer">
            <Button size="lg" className="shadow-blue-200/50 min-w-[240px] font-display text-lg px-8 py-6 rounded-2xl">
              Start Optimization <Sparkles className="ml-2 w-5 h-5 opacity-80" />
            </Button>
          </Link>
          
          <div className="mt-8 flex items-center justify-center font-display gap-2 text-sm font-semibold text-slate-600 bg-white/50 py-2.5 px-5 rounded-full inline-flex border border-slate-200/50 backdrop-blur-sm shadow-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${serverAwake ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400 animate-pulse'}`} />
            {serverAwake ? 'Agent is online and ready' : 'Waking up the Agent...'}
          </div>
        </div>

        <div className="pt-10 grid md:grid-cols-3 gap-8 text-left animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Card className="hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-50/80 ring-1 ring-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                <FileUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">1. Upload & Parse</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We extract your existing experience securely using advanced PDF parsing technologies.</p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-50/80 ring-1 ring-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">2. AI Gap Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Gemini instantly compares your history against the JD to find critical keyword gaps and matches.</p>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-emerald-50/80 ring-1 ring-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">3. Truthful Generation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Get an ATS-friendly analysis instantly. Zero hallucinations guaranteed.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
