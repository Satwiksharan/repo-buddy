import React, { useState } from 'react';
import { Copy, Check, Clock } from 'lucide-react';

interface ExplanationCardProps {
  title: string;
  duration?: string;
  content: string;
  highlights?: string[];
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  title,
  duration,
  content,
  highlights = []
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          {duration && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-mono border border-teal-500/20">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
          title="Copy explanation"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-sans">
        {content}
      </div>

      {highlights.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Key Elements:</span>
          {highlights.map((item, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
              ✓ {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
