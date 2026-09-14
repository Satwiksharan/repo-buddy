import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: string;
  variant?: 'teal' | 'emerald' | 'cyan' | 'amber';
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore = 100,
  icon: Icon,
  subtitle,
  trend,
  variant = 'teal'
}) => {
  const badgeColors = {
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${badgeColors[variant]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-100 tracking-tight">{score}</span>
        <span className="text-sm font-medium text-slate-500">/ {maxScore}</span>
        {trend && (
          <span className="ml-auto text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">{subtitle}</p>
      )}

      {/* Progress bar */}
      <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, (score / maxScore) * 100))}%` }}
        />
      </div>
    </div>
  );
};
