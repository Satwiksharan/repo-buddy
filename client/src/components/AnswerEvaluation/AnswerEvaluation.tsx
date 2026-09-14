import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface Scores {
  accuracy: number;
  completeness: number;
  depth: number;
  clarity: number;
  overall: number;
}

interface AnswerEvaluationProps {
  scores: Scores;
  strengths?: string[];
  missingConcepts?: string[];
  feedback?: string;
  followUpQuestion?: string;
}

export const AnswerEvaluation: React.FC<AnswerEvaluationProps> = ({
  scores,
  strengths = [],
  missingConcepts = [],
  feedback,
  followUpQuestion
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">AI Evaluation Feedback</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Overall Score:</span>
          <span className="text-xl font-extrabold text-teal-400 font-mono">{scores.overall}%</span>
        </div>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Accuracy', val: scores.accuracy },
          { label: 'Completeness', val: scores.completeness },
          { label: 'Depth', val: scores.depth },
          { label: 'Clarity', val: scores.clarity }
        ].map((item) => (
          <div key={item.label} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400 font-medium">{item.label}</div>
            <div className="text-lg font-bold text-slate-100 font-mono">{item.val}%</div>
          </div>
        ))}
      </div>

      {/* Strengths & Missing Points */}
      <div className="grid md:grid-cols-2 gap-4">
        {strengths.length > 0 && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>What You Explained Well</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {missingConcepts.length > 0 && (
          <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Missing / Needs Depth</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {missingConcepts.map((m, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400">⚠</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {feedback && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-teal-400 block mb-1">Feedback & Recommendations:</span>
          {feedback}
        </div>
      )}

      {followUpQuestion && (
        <div className="bg-teal-950/30 border border-teal-800/40 p-4 rounded-xl flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-teal-400 uppercase mb-1">Adaptive Follow-Up Question</div>
            <div className="text-sm text-slate-100 font-medium">{followUpQuestion}</div>
          </div>
        </div>
      )}
    </div>
  );
};
