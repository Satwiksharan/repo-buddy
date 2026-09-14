import React from 'react';
import { Stethoscope } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'RepoBuddy is analyzing your repository...',
  subtext = 'Understanding project structure, dependencies, and architecture...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 animate-pulse">
          <Stethoscope className="w-8 h-8" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-teal-500/20 blur-sm -z-10 animate-ping opacity-50" />
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-2">{message}</h3>
      <p className="text-sm text-slate-400 max-w-md">{subtext}</p>
    </div>
  );
};
