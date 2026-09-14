import React, { useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { AnswerEvaluation } from '../components/AnswerEvaluation/AnswerEvaluation';
import { evaluateExplanation } from '../services/repositoryService';
import { Send, MessageSquare } from 'lucide-react';
import { useParams } from 'react-router-dom';

export const ExplanationPractice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await evaluateExplanation(id || '101', answer);
      if (res.success) {
        setEvaluation(res.data);
      } else {
        setError('Failed to evaluate explanation.');
      }
    } catch (err: any) {
      setError(err.message || 'Evaluation API error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar repoId={id || '101'} />

        <main className="flex-1 max-w-4xl w-full p-8 space-y-8">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold">Interactive Practice</span>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">Practice Project Introduction</h1>
            <p className="text-xs text-slate-400 mt-1">Answer the classic technical interview question and get instant AI evaluation grounded in your codebase.</p>
          </div>

          {/* Question Prompt */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-mono text-slate-400 uppercase">Interviewer Prompt</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">"Tell me about your project."</h2>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your project explanation pitch here (include problem, solution, technologies, architecture, and key technical challenges)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-colors font-sans resize-none"
            />

            {error && (
              <div className="text-xs text-rose-400 font-mono bg-rose-950/40 p-3 rounded-xl border border-rose-800">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !answer.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow transition-all"
              >
                {isSubmitting ? (
                  <span>Evaluating Answer...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for Grounded AI Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Evaluation Results */}
          {evaluation && (
            <AnswerEvaluation
              scores={{
                accuracy: evaluation.scores?.projectUnderstanding || 85,
                completeness: evaluation.scores?.completeness || 80,
                depth: evaluation.scores?.technicalDepth || 75,
                clarity: evaluation.scores?.clarity || 85,
                overall: evaluation.scores?.overall || 82
              }}
              strengths={evaluation.strengths}
              missingConcepts={evaluation.missingConcepts}
              feedback={evaluation.feedback}
              followUpQuestion={evaluation.followUpQuestion}
            />
          )}
        </main>
      </div>
    </div>
  );
};
