import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Stethoscope, LayoutDashboard, FolderGit2, History, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-all">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1">
              Repo<span className="text-teal-400">Buddy</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">PROJECT INTERVIEW COACH</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/dashboard') ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            to="/repositories"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/repositories') ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Repositories
          </Link>

        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-6 h-6 rounded-full border border-teal-500/40" />
                ) : (
                  <User className="w-4 h-4 text-teal-400" />
                )}
                <span className="text-xs font-mono font-semibold text-slate-200">{user.username}</span>
              </div>

              <button
                onClick={() => logout()}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-medium transition-colors"
            >
              <Github className="w-4 h-4 text-teal-400" />
              <span>Connect GitHub</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
