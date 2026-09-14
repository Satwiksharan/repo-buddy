import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { fetchUserRepositories, importGithubRepository, RepositoryData } from '../services/repositoryService';
import { FolderGit2, Star, GitBranch, ArrowRight, Lock, Globe, RefreshCw, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingState } from '../components/LoadingState/LoadingState';
import { Footer } from '../components/Footer/Footer';

export const Repositories: React.FC = () => {
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [importInput, setImportInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUserRepositories();
      if (res.success && Array.isArray(res.data)) {
        setRepositories(res.data);
      }
    } catch (err: any) {
      // Keep empty repositories list if not fetched yet
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importInput.trim()) return;
    setImporting(true);
    setImportMsg(null);
    try {
      const res = await importGithubRepository(importInput.trim());
      if (res.success && res.data) {
        const importedData = Array.isArray(res.data) ? res.data : [res.data];
        setRepositories((prev) => {
          const existingIds = new Set(prev.map((r) => r.githubId));
          const newItems = importedData.filter((r: any) => !existingIds.has(r.githubId));
          return [...newItems, ...prev];
        });
        setImportMsg(`Successfully imported ${importedData.length} repository from GitHub!`);
        setImportInput('');
      } else {
        setImportMsg(res.error?.message || 'Could not import repository.');
      }
    } catch (err: any) {
      setImportMsg(err.response?.data?.error?.message || 'Failed to fetch public repository from GitHub.');
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">GitHub Integration</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">Select Project Repository</h1>
            <p className="text-xs text-slate-400 mt-1">Choose an existing project or import any public GitHub repository to analyze.</p>
          </div>

          <button
            onClick={loadRepositories}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Repos</span>
          </button>
        </div>

        {/* Live Public GitHub Import Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <form onSubmit={handleImportSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Import public repo URL (e.g. https://github.com/facebook/react) or GitHub username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={importing || !importInput.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{importing ? 'Fetching...' : 'Import Repo'}</span>
            </button>
          </form>
          {importMsg && (
            <p className="text-[11px] font-mono mt-2 text-teal-400">{importMsg}</p>
          )}
        </div>

        {loading ? (
          <LoadingState message="Fetching repositories from GitHub REST API..." subtext="Retrieving user repositories, language info, and commit metadata..." />
        ) : error ? (
          <div className="bg-rose-950/40 border border-rose-800 p-6 rounded-2xl text-center text-rose-300 text-sm">
            {error}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <div
                key={repo.githubId}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-teal-400" />
                      <h3 className="font-bold text-slate-100 text-base group-hover:text-teal-400 transition-colors">
                        {repo.name}
                      </h3>
                    </div>
                    {repo.isPrivate ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        <Lock className="w-3 h-3 text-amber-400" /> Private
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        <Globe className="w-3 h-3 text-teal-400" /> Public
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{repo.description}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(repo.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to={`/repositories/${repo.githubId}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-all border border-slate-700"
                  >
                    <span>Analyze & Prepare Interview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
