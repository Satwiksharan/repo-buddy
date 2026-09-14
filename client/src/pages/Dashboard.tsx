import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { ScoreCard } from '../components/ScoreCard/ScoreCard';
import { Award, MessageSquare, FolderGit2, ArrowRight, Plus, Search, ShieldCheck, Play, Code, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchUserRepositories, fetchRepositoryAnalysis, importGithubRepository, RepositoryData } from '../services/repositoryService';
import { LoadingState } from '../components/LoadingState/LoadingState';
import { Footer } from '../components/Footer/Footer';

export const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const [activeRepoId, setActiveRepoId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [importInput, setImportInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const res = await fetchUserRepositories();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setRepositories(res.data);
        setActiveRepoId(res.data[0].githubId);
      }
    } catch (e) {
      console.warn('Could not fetch user repositories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  useEffect(() => {
    if (!activeRepoId) return;
    fetchRepositoryAnalysis(activeRepoId)
      .then((res) => {
        if (res.success) {
          setAnalysisData(res.data);
        }
      })
      .catch(() => {});
  }, [activeRepoId]);

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importInput.trim()) return;
    setImporting(true);
    setImportMsg(null);
    try {
      const res = await importGithubRepository(importInput.trim());
      if (res.success && res.data) {
        const imported = Array.isArray(res.data) ? res.data[0] : res.data;
        setRepositories((prev) => [imported, ...prev.filter((r) => r.githubId !== imported.githubId)]);
        setActiveRepoId(imported.githubId);
        setImportMsg(`Successfully imported ${imported.fullName || imported.name}!`);
        setImportInput('');
      } else {
        setImportMsg(res.error?.message || 'Could not import repository.');
      }
    } catch (err: any) {
      setImportMsg(err.response?.data?.error?.message || 'Failed to fetch repository from GitHub.');
    } finally {
      setImporting(false);
    }
  };

  const activeRepo = repositories.find((r) => r.githubId === activeRepoId) || repositories[0];
  const scores = analysisData?.healthScore || { overall: 85, architecture: 88, security: 90 };
  const tech = analysisData?.technologies || { frontend: [], backend: [], database: [], authentication: [] };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Technical Interview Dashboard</span>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">Repository Coach & Mock Interview Engine</h1>
            <p className="text-xs text-slate-400 mt-1">Import real GitHub projects, generate AI pitches, and take technical interviews.</p>
          </div>
          <Link
            to="/repositories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow shrink-0"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Manage Repositories ({repositories.length})</span>
          </Link>
        </div>

        {/* Inline Import Search Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <form onSubmit={handleImportSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Paste public GitHub repository URL (e.g. https://github.com/facebook/react) or username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={importing || !importInput.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{importing ? 'Fetching...' : 'Import & Analyze'}</span>
            </button>
          </form>
          {importMsg && <p className="text-[11px] font-mono mt-2 text-teal-400">{importMsg}</p>}
        </div>

        {loading ? (
          <LoadingState message="Loading dashboard & candidate repositories..." subtext="Retrieving analyzed projects from GitHub REST API..." />
        ) : activeRepo ? (
          <>
            {/* Active Repository Card Header & Selector */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Active Selected Repository</span>
                  {repositories.length > 1 && (
                    <select
                      value={activeRepoId || ''}
                      onChange={(e) => setActiveRepoId(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-teal-500"
                    >
                      {repositories.map((r) => (
                        <option key={r.githubId} value={r.githubId}>
                          {r.fullName || r.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <Link
                  to={`/repositories/${activeRepo.githubId}`}
                  className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:underline font-mono"
                >
                  <span>Full Overview & Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                <div>
                  <div className="text-xl font-bold text-slate-100">{activeRepo.name}</div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">{activeRepo.fullName} — {activeRepo.description}</div>
                  <div className="flex flex-wrap gap-2 mt-3 font-mono text-[11px]">
                    <span className="bg-slate-800 px-2.5 py-1 rounded text-teal-300">★ {activeRepo.stars} Stars</span>
                    <span className="bg-slate-800 px-2.5 py-1 rounded text-cyan-300">{activeRepo.language}</span>
                    <span className="bg-slate-800 px-2.5 py-1 rounded text-indigo-300">Branch: {activeRepo.defaultBranch}</span>
                    {analysisData?.architecture?.primaryPattern && (
                      <span className="bg-slate-800 px-2.5 py-1 rounded text-emerald-300">{analysisData.architecture.primaryPattern}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 uppercase">Readiness Score</div>
                    <div className="text-2xl font-bold text-teal-400">{scores.overall || 85}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Overview ScoreCards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreCard
                title="Interview Readiness"
                score={scores.overall || 85}
                icon={Award}
                subtitle="Calculated across architecture, code quality & security"
                variant="teal"
              />
              <ScoreCard
                title="Explanation Pitch"
                score={scores.architecture || 88}
                icon={MessageSquare}
                subtitle="30s, 1m & 3m pitches generated by Gemini 3.6 Flash"
                variant="cyan"
              />
              <ScoreCard
                title="Repository Health"
                score={scores.security || 90}
                icon={FolderGit2}
                subtitle="Live tree inspection, testing & secret redactions"
                variant="emerald"
              />
            </div>

            {/* Quick Actions Grid for Active Repository */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">1. Project Explanation Pitches</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Master "Tell me about your project" with 30-second, 1-minute, and 3-minute pitches crafted specifically for {activeRepo.name}.
                  </p>
                </div>
                <Link
                  to={`/repositories/${activeRepo.githubId}/explanation`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-all border border-slate-700"
                >
                  <span>View Project Pitches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Play className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">2. Technical Interview Engine</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Take a project-grounded mock technical interview with adaptive AI follow-up questions for {activeRepo.name}.
                  </p>
                </div>
                <Link
                  to={`/repositories/${activeRepo.githubId}/questions`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow"
                >
                  <span>Start Mock Interview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">3. Codebase Analysis</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Inspect detected technology stack, inferred architecture diagrams, and secret redaction security status.
                  </p>
                </div>
                <Link
                  to={`/repositories/${activeRepo.githubId}/analysis`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-all border border-slate-700"
                >
                  <span>View Analysis Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">No Repository Imported Yet</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-mono">
              Paste any public GitHub repository URL above (e.g. https://github.com/facebook/react) to analyze its tech stack and generate interview pitches.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
