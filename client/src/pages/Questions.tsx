import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { QuestionCard } from '../components/QuestionCard/QuestionCard';
import { fetchRepositoryQuestions, QuestionItem } from '../services/interviewService';
import { Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { LoadingState } from '../components/LoadingState/LoadingState';

export const Questions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetchRepositoryQuestions(id || '101');
      if (res.success && res.data) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar repoId={id || '101'} />
          <main className="flex-1 p-8 flex items-center justify-center">
            <LoadingState message="Generating Project-Grounded Question Bank..." subtext="Analyzing controllers, models, security configs, and API routes to formulate interview questions..." />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar repoId={id || '101'} />

        <main className="flex-1 max-w-5xl w-full p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div>
              <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Repository Interview Questions</span>
              <h1 className="text-2xl font-bold text-slate-100 mt-1">Project-Grounded Question Bank</h1>
              <p className="text-xs text-slate-400 mt-1">Questions generated directly from your codebase implementation.</p>
            </div>

            <Link
              to={`/interview/${id || '101'}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Start Adaptive Mock Interview</span>
            </Link>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={idx}
                index={idx + 1}
                total={questions.length}
                category={q.category}
                difficulty={q.difficulty}
                question={q.question}
                sourceFiles={q.sourceFiles}
                expectedConcepts={q.expectedConcepts}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
