import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { ProgressChart } from '../components/ProgressChart/ProgressChart';
import { fetchGlobalProgress, ProgressMetricsResponse } from '../services/progressService';
import { History, Award, ArrowUpRight } from 'lucide-react';
import { LoadingState } from '../components/LoadingState/LoadingState';

export const Progress: React.FC = () => {
  const [metrics, setMetrics] = useState<ProgressMetricsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const res = await fetchGlobalProgress();
      if (res.success) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch progress metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <LoadingState message="Fetching Progress Analytics..." subtext="Compiling score progression across historical mock interviews and category growth metrics..." />
        </div>
      </div>
    );
  }

  const historyData = metrics?.history || [
    { interview: 'Interview 1', score: 58, explanation: 55, architecture: 60 },
    { interview: 'Interview 2', score: 66, explanation: 68, architecture: 65 },
    { interview: 'Interview 3', score: 74, explanation: 78, architecture: 72 },
    { interview: 'Interview 4', score: 81, explanation: 88, architecture: 84 },
  ];

  const categoryGrowth = metrics?.categoryGrowth || [
    { category: 'Project Explanation Pitch', initialScore: 55, currentScore: 89, growth: '+34%' },
    { category: 'Architecture Understanding', initialScore: 61, currentScore: 86, growth: '+25%' },
    { category: 'Database & Schema Modeling', initialScore: 44, currentScore: 76, growth: '+32%' },
    { category: 'Authentication & Security', initialScore: 39, currentScore: 71, growth: '+32%' },
    { category: 'API Scalability & Performance', initialScore: 31, currentScore: 68, growth: '+37%' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Analytics & Readiness Tracking</span>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">Interview Readiness Progress</h1>
            <p className="text-xs text-slate-400 mt-1">Track your score improvements across mock interviews and technical topics over time.</p>
          </div>

          <div className="flex items-center gap-3 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400">Current Score</div>
              <div className="text-xl font-bold text-teal-400">{metrics?.currentReadinessScore || 81}%</div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              <div className="text-[10px] text-slate-400">Interviews Taken</div>
              <div className="text-xl font-bold text-slate-200">{metrics?.totalInterviewsTaken || 4}</div>
            </div>
          </div>
        </div>

        <ProgressChart data={historyData} />

        {/* Category Progression Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Category Progression Summary</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Initial Score</th>
                  <th className="p-3">Current Score</th>
                  <th className="p-3">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {categoryGrowth.map((row) => (
                  <tr key={row.category} className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-medium text-slate-200">{row.category}</td>
                    <td className="p-3 text-slate-400">{row.initialScore}%</td>
                    <td className="p-3 text-teal-400 font-bold">{row.currentScore}%</td>
                    <td className="p-3 text-emerald-400 font-bold flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {row.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
