import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkHealth } from '../services/api';
import { StatusIndicator } from '../components/StatusIndicator';
import { Stethoscope, Github, ArrowRight, ShieldCheck, Cpu, Code2, Award, CheckCircle } from 'lucide-react';
import { Footer } from '../components/Footer/Footer';

export const Landing: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [healthMsg, setHealthMsg] = useState<string>('');

  const verifyBackend = async () => {
    setStatus('loading');
    try {
      const res = await checkHealth();
      if (res.success) {
        setStatus('connected');
        setHealthMsg(res.message);
      } else {
        setStatus('disconnected');
      }
    } catch (err) {
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    verifyBackend();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner showing live backend connection */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-2.5 px-4 flex justify-center items-center">
        <StatusIndicator status={status} message={healthMsg} onRetry={verifyBackend} />
      </div>

      {/* Main Hero */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono mb-8">
          <Stethoscope className="w-4 h-4" />
          <span>RepoBuddy — Technical Project Interview Coach</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-tight mb-6">
          Your GitHub project. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400">
            Your technical interview.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-sans">
          RepoBuddy understands what you built, teaches you how to explain it, and prepares you to defend it in a technical interview.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mb-16">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all glow-teal shadow-lg"
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition-all"
          >
            <span>Explore Dashboard</span>
          </Link>
        </div>

        {/* Core Differentiation Banner */}
        <div className="w-full max-w-4xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left mb-16 shadow-xl">
          <div className="text-xs font-bold font-mono text-teal-400 uppercase tracking-wider mb-2">Core Difference</div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4">
            Not just an interview question generator.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Generic preparation tools do not understand your implementation details. RepoBuddy analyzes your actual GitHub repository structure, configuration, and dependencies to conduct a personalized technical interview around what you actually built.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <Code2 className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="font-bold text-slate-200 mb-1">1. Understand</div>
              <div className="text-slate-400 font-sans text-xs">Deep repository scan & architecture detection</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <Cpu className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="font-bold text-slate-200 mb-1">2. Explain</div>
              <div className="text-slate-400 font-sans text-xs">30s, 1m, and 3m interview-ready technical pitches</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <Award className="w-5 h-5 text-teal-400 mb-2" />
              <div className="font-bold text-slate-200 mb-1">3. Defend</div>
              <div className="text-slate-400 font-sans text-xs">Mock interview with adaptive AI follow-up questions</div>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-teal-400 mb-3" />
            <h3 className="text-base font-bold text-slate-200 mb-1">Project Specific</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Questions grounded directly in your source code, controllers, models, and dependencies.
            </p>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <CheckCircle className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-slate-200 mb-1">Explanation Practice</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practice answering "Tell me about your project" and receive instant AI readiness scores.
            </p>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <Award className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-base font-bold text-slate-200 mb-1">Weakness Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies weak areas in scalability, security, database indexing, or auth and generates a prep plan.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
