import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ExplanationCard } from '../components/ExplanationCard/ExplanationCard';
import { fetchProjectExplanation, ExplanationResponse } from '../services/repositoryService';
import { Play, Sparkles, HelpCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { LoadingState } from '../components/LoadingState/LoadingState';

export const ProjectExplanation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [explanation, setExplanation] = useState<ExplanationResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadExplanations = async () => {
    setLoading(true);
    try {
      const res = await fetchProjectExplanation(id || '101');
      if (res.success) {
        setExplanation(res.data);
      }
    } catch (err) {
      console.error('Failed to load project explanations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExplanations();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar repoId={id || '101'} />
          <main className="flex-1 p-8 flex items-center justify-center">
            <LoadingState message="Generating Project Explanation Pitches..." subtext="Analyzing architecture, database design, auth flow, and technical trade-offs..." />
          </main>
        </div>
      </div>
    );
  }

  const s30 = explanation?.summary30s || '"CampusConnect is a campus event management web application built using the MERN stack."';
  const s1m = explanation?.summary1m || '"CampusConnect solves the fragmentation of campus events by consolidating organization management..."';
  const s3m = explanation?.summary3m || '"CampusConnect is a full-stack web application designed to solve student engagement challenges..."';
  const techDecisions = explanation?.techDecisions || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar repoId={id || '101'} />

        <main className="flex-1 max-w-5xl w-full p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Project Pitch Prep</span>
                {explanation?.isFallback && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Grounded Fallback Engine
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mt-1">Project Explanation Pitches</h1>
              <p className="text-xs text-slate-400 mt-1">Master "Tell me about your project" with grounded explanations at 3 detail levels.</p>
            </div>

            <Link
              to={`/repositories/${id || '101'}/explanation/practice`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Practice Pitching Live</span>
            </Link>
          </div>

          <div className="space-y-6">
            <ExplanationCard
              title="30-Second Interview Pitch"
              duration="30 Seconds"
              content={s30}
              highlights={['Problem & Solution', 'Core Stack', 'Main Purpose', 'Architecture']}
            />

            <ExplanationCard
              title="1-Minute Technical Pitch"
              duration="1 Minute"
              content={s1m}
              highlights={['Problem Context', 'Detailed Stack', 'API Communication', 'Database Choice', 'Technical Trade-off']}
            />

            <ExplanationCard
              title="2–3 Minute Technical Interview Deep-Dive"
              duration="2–3 Minutes"
              content={s3m}
              highlights={['Deep Architecture', 'Auth Flow', 'Data Model Details', 'Concurrency Challenge', 'Future Improvements']}
            />
          </div>

          {/* Technology Choices Reasoning Cards */}
          {techDecisions.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>"Why Did You Choose This?" — Tech Choices Reasoning</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {techDecisions.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-mono font-bold text-teal-400">{item.technology || item.decision || `Choice ${idx + 1}`}</div>
                    <div className="text-sm font-semibold text-slate-100">{item.question || item.decision || 'Why this choice?'}</div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.explanation || item.rationale || item.inferredReasoning}</p>
                    <div className="text-[10px] font-mono text-slate-500 italic">Possible explanation based on your implementation</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
