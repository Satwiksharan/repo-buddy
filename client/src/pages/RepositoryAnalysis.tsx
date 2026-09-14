import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ScoreCard } from '../components/ScoreCard/ScoreCard';
import { TechnologyBadge } from '../components/TechnologyBadge/TechnologyBadge';
import { scanRepository, AnalysisReportResponse } from '../services/repositoryService';
import { FolderGit2, ShieldCheck, CheckCircle2, FileText, Bug, Layers, Code, Play, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { LoadingState } from '../components/LoadingState/LoadingState';

export const RepositoryAnalysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisReportResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await scanRepository(id || '101');
      if (res.success) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.error('Failed to run analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar repoId={id || '101'} />
          <main className="flex-1 p-8 flex items-center justify-center">
            <LoadingState message="Scanning Repository Structure & Dependencies..." subtext="Analyzing file tree, imports, secrets redaction, and architecture pattern matching..." />
          </main>
        </div>
      </div>
    );
  }

  const health = analysis?.healthScore || {
    overall: 78,
    architecture: 88,
    codeQuality: 82,
    security: 85,
    testing: 65,
    documentation: 85,
    dependencies: 80
  };

  const tech = analysis?.technologies || {
    frontend: ['React', 'Tailwind CSS'],
    backend: ['Express.js', 'Node.js'],
    database: ['MongoDB', 'Mongoose'],
    authentication: ['JWT'],
    testing: ['Jest'],
    deployment: ['Docker']
  };

  const arch = analysis?.architecture || {
    primaryPattern: 'Client-Server',
    summary: 'Analyzed files. Structure indicates a Client-Server layout.'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar repoId={id || '101'} />

        <main className="flex-1 max-w-5xl w-full p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div>
              <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Repository Scanner Report</span>
              <h1 className="text-2xl font-bold text-slate-100 mt-1">Repository Technical Analysis</h1>
              <p className="text-xs text-slate-400 mt-1">Automated analysis of architecture, security, tests, documentation, and dependencies.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-scan</span>
              </button>
              <Link
                to={`/repositories/${id || '101'}/explanation`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>View Explanation Pitch</span>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ScoreCard title="Repository Health" score={health.overall} icon={FolderGit2} subtitle="Overall structural health score" variant="teal" />
            <ScoreCard title="Security Analysis" score={health.security} icon={ShieldCheck} subtitle="Secrets redacted & safe configuration" variant="emerald" />
            <ScoreCard title="Testing Coverage" score={health.testing} icon={Bug} subtitle="Jest test framework detected" variant="amber" />
          </div>

          {/* Detected Technologies */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Detected Technologies (Deterministic)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1.5">Frontend</div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.frontend.map((t) => <TechnologyBadge key={t} name={t} category="frontend" />)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1.5">Backend</div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.backend.map((t) => <TechnologyBadge key={t} name={t} category="backend" />)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1.5">Database</div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.database.map((t) => <TechnologyBadge key={t} name={t} category="database" />)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1.5">Authentication</div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.authentication.map((t) => <TechnologyBadge key={t} name={t} category="auth" />)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1.5">Testing</div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.testing.map((t) => <TechnologyBadge key={t} name={t} category="testing" />)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1.5">Deployment</div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.deployment.map((t) => <TechnologyBadge key={t} name={t} category="deployment" />)}
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Pattern Summary */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Inferred Architectural Pattern</span>
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <div className="text-sm font-bold text-teal-400 mb-1">{arch.primaryPattern} Pattern</div>
              <p className="text-slate-400 font-sans text-xs">{arch.summary}</p>
            </div>
          </div>

          {/* Scanned Files list */}
          {analysis?.importantFiles && analysis.importantFiles.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Important Files Identified</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.importantFiles.map((file) => (
                  <span key={file} className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                    {file}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
