import React from 'react';
import { ArrowDown, Server, Database, Monitor, ShieldCheck } from 'lucide-react';

interface ArchitectureDiagramProps {
  frontend?: string;
  backend?: string;
  database?: string;
  auth?: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  frontend = 'React Frontend (Vite)',
  backend = 'Node.js + Express REST API',
  database = 'MongoDB (Mongoose)',
  auth = 'GitHub OAuth + Session / JWT'
}) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono">
      <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
        {/* Client Layer */}
        <div className="w-full p-3.5 bg-slate-900 border border-teal-500/30 rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-teal-400" />
            <div>
              <div className="text-xs text-teal-400 font-bold uppercase">Frontend Client</div>
              <div className="text-sm font-sans font-medium text-slate-200">{frontend}</div>
            </div>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />

        {/* Auth / API Security Layer */}
        <div className="w-full p-2.5 bg-slate-900/80 border border-amber-500/20 rounded-lg flex items-center justify-center gap-2 text-xs text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{auth}</span>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />

        {/* Server Layer */}
        <div className="w-full p-3.5 bg-slate-900 border border-indigo-500/30 rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-xs text-indigo-400 font-bold uppercase">Backend API</div>
              <div className="text-sm font-sans font-medium text-slate-200">{backend}</div>
            </div>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />

        {/* Database Layer */}
        <div className="w-full p-3.5 bg-slate-900 border border-emerald-500/30 rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase">Database Layer</div>
              <div className="text-sm font-sans font-medium text-slate-200">{database}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
