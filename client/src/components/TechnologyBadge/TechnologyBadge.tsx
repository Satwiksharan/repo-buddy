import React from 'react';

interface TechnologyBadgeProps {
  name: string;
  category?: 'frontend' | 'backend' | 'database' | 'auth' | 'testing' | 'deployment' | 'general';
}

export const TechnologyBadge: React.FC<TechnologyBadgeProps> = ({ name, category = 'general' }) => {
  const categoryStyles = {
    frontend: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    backend: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    database: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    auth: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    testing: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
    deployment: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    general: 'bg-slate-900 text-slate-300 border-slate-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${categoryStyles[category]}`}>
      {name}
    </span>
  );
};
