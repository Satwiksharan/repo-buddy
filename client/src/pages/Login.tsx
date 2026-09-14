import React, { useState } from 'react';
import { Github, Stethoscope, Shield, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { importGithubRepository } from '../services/repositoryService';
import { Footer } from '../components/Footer/Footer';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [repoInput, setRepoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleGithubLogin = () => {
    window.location.href = 'http://127.0.0.1:5001/api/auth/github';
  };

  const handleDirectImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setLoading(true);
    setImportError(null);
    try {
      const res = await importGithubRepository(repoInput.trim());
      if (res.success) {
        navigate('/repositories');
      } else {
        setImportError(res.error?.message || 'Could not import GitHub repository.');
      }
    } catch (err: any) {
      setImportError(err.response?.data?.error?.message || 'Failed to fetch public repository from GitHub.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome to RepoBuddy</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Analyze real-world GitHub repositories & prepare for interviews</p>
        </div>

        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Connect via GitHub OAuth or paste any public repository URL</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Automatic technology & architecture detection</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Generate 30s/1m/3m AI project pitches & mock interviews</span>
          </div>
        </div>

        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-sm transition-all shadow-lg"
        >
          <Github className="w-5 h-5" />
          <span>Continue with GitHub OAuth</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">Or Import Any Public Repo</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleDirectImport} className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="e.g. https://github.com/facebook/react or username"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repoInput.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Importing from GitHub...' : 'Analyze Public Repository'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {importError && (
            <p className="text-[11px] text-rose-400 font-mono text-center">{importError}</p>
          )}
        </form>

        <div className="text-center pt-2">
          <Link to="/dashboard" className="text-xs text-slate-400 hover:text-teal-400 underline font-mono">
            Skip for now & view Demo Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
          <Shield className="w-3.5 h-3.5" />
          <span>RepoBuddy redacts all private credentials & keys</span>
        </div>
      </div>
      <div className="w-full max-w-md mt-6">
        <Footer />
      </div>
    </div>
  );
};
