import React from 'react';
import { HelpCircle, Code, Layers } from 'lucide-react';

interface QuestionCardProps {
  index?: number;
  total?: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  sourceFiles?: string[];
  expectedConcepts?: string[];
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  index,
  total,
  category,
  difficulty,
  question,
  sourceFiles = [],
  expectedConcepts = []
}) => {
  const difficultyColors = {
    Easy: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    Medium: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    Hard: 'bg-rose-950/60 text-rose-300 border-rose-800/60'
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {index && total && (
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-800/60">
              QUESTION {index} / {total}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            {category}
          </span>
        </div>

        <span className={`text-xs font-mono px-2.5 py-1 rounded-md border ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <HelpCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <h3 className="text-lg font-semibold text-slate-100 leading-snug">{question}</h3>
      </div>

      {(sourceFiles.length > 0 || expectedConcepts.length > 0) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col gap-2">
          {sourceFiles.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Code className="w-3.5 h-3.5 text-slate-500" />
              <span>Grounded in:</span>
              {sourceFiles.map((file, idx) => (
                <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded text-teal-300 border border-slate-800">
                  {file}
                </span>
              ))}
            </div>
          )}

          {expectedConcepts.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Key Concepts:</span>
              <div className="flex flex-wrap gap-1">
                {expectedConcepts.map((concept, idx) => (
                  <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[11px]">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
