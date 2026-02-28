import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50/80 backdrop-blur-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 font-medium text-sm">
          &copy; {currentYear} @omdoke. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/OmDoke/Personal-Career-Agent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-900 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/onkar-doke/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-600 transition-colors"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
