import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, BookOpen, MessageSquare, Award, BarChart3 } from 'lucide-react';

interface SidebarProps {
  repoId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ repoId }) => {
  const items = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Repositories', path: '/repositories', icon: FolderGit2 },
    ...(repoId ? [
      { label: 'Overview', path: `/repositories/${repoId}`, icon: BookOpen },
      { label: 'Explanation Pitch', path: `/repositories/${repoId}/explanation`, icon: MessageSquare },
      { label: 'Mock Interview', path: `/repositories/${repoId}/questions`, icon: Award },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </aside>
  );
};
