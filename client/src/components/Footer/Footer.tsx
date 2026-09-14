import React from 'react';
import { Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-teal-400" />
          <span>RepoBuddy &copy; {new Date().getFullYear()} — Technical Interview & Codebase Coach</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 text-slate-300">
          <span>Developed with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>by</span>
          <span className="font-bold text-teal-400 tracking-wide">Satwik</span>
        </div>
      </div>
    </footer>
  );
};
