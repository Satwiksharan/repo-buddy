import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProgressDataPoint {
  interview: string;
  score: number;
  explanation: number;
  architecture: number;
}

interface ProgressChartProps {
  data?: ProgressDataPoint[];
}

const defaultData: ProgressDataPoint[] = [
  { interview: 'Interview 1', score: 58, explanation: 55, architecture: 60 },
  { interview: 'Interview 2', score: 66, explanation: 68, architecture: 65 },
  { interview: 'Interview 3', score: 74, explanation: 78, architecture: 72 },
  { interview: 'Interview 4', score: 81, explanation: 88, architecture: 84 },
];

export const ProgressChart: React.FC<ProgressChartProps> = ({ data = defaultData }) => {
  return (
    <div className="w-full h-72 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Interview Score Progression</h4>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="interview" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
          />
          <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={3} name="Overall Score" dot={{ r: 4 }} />
          <Line type="monotone" dataKey="explanation" stroke="#06b6d4" strokeWidth={2} name="Explanation" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="architecture" stroke="#6366f1" strokeWidth={2} name="Architecture" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
