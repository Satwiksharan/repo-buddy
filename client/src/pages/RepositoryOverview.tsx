import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ScoreCard } from '../components/ScoreCard/ScoreCard';
import { TechnologyBadge } from '../components/TechnologyBadge/TechnologyBadge';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram/ArchitectureDiagram';
import { MessageSquare, Award, Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { fetchRepositoryAnalysis } from '../services/repositoryService';
import { LoadingState } from '../components/LoadingState/LoadingState';
import { Footer } from '../components/Footer/Footer';

export const RepositoryOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchRepositoryAnalysis(id || '101');
        if (res.success && res.data) {
          setAnalysisData(res.data);
        }
      } catch (e) {
        console.warn('Could not fetch repository analysis:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar repoId={id || '101'} />
          <main className="flex-1 p-8">
            <LoadingState message="Analyzing repository architecture & files..." subtext="Executing technology detector, security analyzer & architecture inference engine..." />
          </main>
        </div>
      </div>
    );
  }

  const proj = analysisData?.projectContext?.project || {};
  const tech = analysisData?.technologies || {
    frontend: ['React'],
    backend: ['Express.js', 'Node.js'],
    database: ['MongoDB'],
    authentication: ['JWT'],
    testing: ['Jest'],
    deployment: ['Docker']
  };
  const scores = analysisData?.healthScore || { overall: 81, architecture: 88 };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar repoId={id || '101'} />

        <main className="flex-1 max-w-5xl w-full p-8 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Active Repository</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Scanned & Analyzed
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mt-1">{proj.name || analysisData?.name || 'CampusConnect'}</h1>
              <p className="text-xs text-slate-400 mt-1">{proj.description || analysisData?.fullName || 'Real-World GitHub Repository'}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/repositories/${id || '101'}/explanation`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Explain Pitch</span>
              </Link>
              <Link
                to={`/repositories/${id || '101'}/questions`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Mock Interview</span>
              </Link>
            </div>
          </div>

          {/* Scores Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <ScoreCard
              title="Interview Readiness"
              score={scores.overall || 81}
              icon={Award}
              subtitle="Project explanation, tech choices, architecture & database"
              variant="teal"
            />
            <ScoreCard
              title="Project Explanation Readiness"
              score={scores.architecture || 88}
              icon={MessageSquare}
              subtitle="Problem statement, solution, stack & challenge pitch"
              variant="cyan"
            />
          </div>

          {/* Technology Stack Grid */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Detected Technology Stack</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2">Frontend Framework</div>
                <div className="flex flex-wrap gap-1.5">
                  {(tech.frontend || ['React']).map((item: string) => (
                    <TechnologyBadge key={item} name={item} category="frontend" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2">Backend Framework</div>
                <div className="flex flex-wrap gap-1.5">
                  {(tech.backend || ['Express.js']).map((item: string) => (
                    <TechnologyBadge key={item} name={item} category="backend" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2">Database Layer</div>
                <div className="flex flex-wrap gap-1.5">
                  {(tech.database || ['MongoDB']).map((item: string) => (
                    <TechnologyBadge key={item} name={item} category="database" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2">Authentication</div>
                <div className="flex flex-wrap gap-1.5">
                  {(tech.authentication || ['JWT']).map((item: string) => (
                    <TechnologyBadge key={item} name={item} category="auth" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2">Testing & Specs</div>
                <div className="flex flex-wrap gap-1.5">
                  {(tech.testing || ['Jest']).map((item: string) => (
                    <TechnologyBadge key={item} name={item} category="testing" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2">Deployment & Ops</div>
                <div className="flex flex-wrap gap-1.5">
                  {(tech.deployment || ['Docker']).map((item: string) => (
                    <TechnologyBadge key={item} name={item} category="deployment" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Visualization */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Inferred Architecture Model</h3>
            <ArchitectureDiagram
              frontend={`${(tech.frontend || ['React']).join(', ')} Interface`}
              backend={`${(tech.backend || ['Express.js']).join(', ')} REST Services`}
              database={`${(tech.database || ['MongoDB']).join(', ')} Storage`}
              auth={`${(tech.authentication || ['JWT']).join(', ')} Auth Layer`}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
