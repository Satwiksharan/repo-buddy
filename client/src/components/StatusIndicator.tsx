import React from 'react';
import { Activity, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'loading' | 'connected' | 'disconnected';
  message?: string;
  onRetry?: () => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, message, onRetry }) => {
  if (status === 'loading') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
        <Activity className="w-3.5 h-3.5 animate-spin text-teal-400" />
        <span>Checking backend status...</span>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold">Backend Status: Connected</span>
        {message && <span className="opacity-75">({message})</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-mono">
      <XCircle className="w-3.5 h-3.5 text-rose-400" />
      <span>Backend Disconnected</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-1 p-0.5 hover:bg-rose-900/50 rounded transition-colors text-rose-200"
          title="Retry Connection"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
