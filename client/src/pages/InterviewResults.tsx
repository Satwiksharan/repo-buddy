import React from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { ScoreCard } from '../components/ScoreCard/ScoreCard';
import { Award, CheckCircle2, AlertTriangle, BookOpen, RotateCcw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export const InterviewResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Interview Evaluation Completed</span>
            <h1 className="text-3xl font-bold text-slate-100 mt-1">Mock Interview Performance Result</h1>
            <p className="text-xs text-slate-400 mt-1">Overall readiness score and targeted preparation plan based on your answers.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/interview/${id || '1'}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-teal-400" />
              <span>Retake Interview</span>
            </Link>
          </div>
        </div>

        {/* Score Header */}
        <div className="grid md:grid-cols-3 gap-6">
          <ScoreCard
            title="Interview Readiness Score"
            score={81}
            icon={Award}
            subtitle="Overall readiness to defend CampusConnect in a technical interview"
            variant="teal"
          />
          <ScoreCard
            title="Project Pitch Score"
            score={88}
            icon={CheckCircle2}
            subtitle="Problem, solution, and stack explanation performance"
            variant="cyan"
          />
          <ScoreCard
            title="Technical Depth Score"
            score={74}
            icon={AlertTriangle}
            subtitle="Database query optimization & security concept depth"
            variant="amber"
          />
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Identified Key Strengths</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-100 block mb-0.5">Project Overview Pitch</span>
                Articulated the problem statement and MERN stack capabilities clearly.
              </li>
              <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-100 block mb-0.5">Authentication Fundamentals</span>
                Good understanding of JWT tokens and Express middleware verification.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Identified Weakness Areas</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl">
                <span className="font-semibold text-rose-300 block mb-0.5">Database Query Performance</span>
                Struggled explaining how Mongoose indexing prevents full table scans.
              </li>
              <li className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl">
                <span className="font-semibold text-amber-300 block mb-0.5">Scalability & Rate Limiting</span>
                Incomplete explanation of handling high traffic spikes on API endpoints.
              </li>
            </ul>
          </div>
        </div>

        {/* Personalized Preparation Plan */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Personalized Preparation Plan</span>
            </h3>
          </div>

          <div className="space-y-3 font-sans">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-100 text-sm">1. MongoDB Indexing & Compound Queries</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">HIGH PRIORITY</span>
              </div>
              <p className="text-xs text-slate-400">Review how single and compound indexes speed up MongoDB read operations for event searches.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-100 text-sm">2. Express Rate Limiting & Security Headers</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">MEDIUM PRIORITY</span>
              </div>
              <p className="text-xs text-slate-400">Learn how express-rate-limit and helmet middleware defend APIs against brute-force attacks.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
