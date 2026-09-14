import React, { useState } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { QuestionCard } from '../components/QuestionCard/QuestionCard';
import { AnswerEvaluation } from '../components/AnswerEvaluation/AnswerEvaluation';
import { Send, ArrowRight, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const Interview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const mockQuestions = [
    {
      category: 'Project Overview',
      difficulty: 'Easy' as const,
      question: 'Tell me about your project, what problem it solves, and why you built it.',
      sourceFiles: ['README.md', 'package.json'],
      expectedConcepts: ['Problem Context', 'MERN Stack', 'Main Purpose']
    },
    {
      category: 'Authentication',
      difficulty: 'Medium' as const,
      question: 'How does authentication work in your application, and where are tokens validated?',
      sourceFiles: ['middleware/auth.js', 'controllers/authController.js'],
      expectedConcepts: ['JWT', 'Bearer Token', 'Middleware', 'Secret Key']
    },
    {
      category: 'Database',
      difficulty: 'Hard' as const,
      question: 'Why did you choose MongoDB for this project, and how would you optimize database queries under high traffic?',
      sourceFiles: ['models/User.js', 'models/Scan.js'],
      expectedConcepts: ['Document Schema', 'Indexing', 'Aggregations']
    }
  ];

  const currentQ = mockQuestions[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEvaluation({
        scores: { accuracy: 84, completeness: 78, depth: 70, clarity: 86, overall: 80 },
        strengths: ['Strong technical description of controller logic'],
        missingConcepts: ['Could expand on token expiration and refresh flow'],
        feedback: 'Solid response! To make it top-tier, explicitly mention how error middleware handles expired tokens.',
        followUpQuestion: 'Where is the secret key stored and how do you prevent committing it to version control?'
      });
    }, 1000);
  };

  const handleNext = () => {
    setAnswer('');
    setEvaluation(null);
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate(`/interview/${id || '1'}/results`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-mono text-teal-400 font-bold uppercase">RepoBuddy Mock Interview</span>
            <div className="text-sm font-semibold text-slate-200">CampusConnect Project Interview</div>
          </div>
          <div className="text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 border border-slate-700">
            Question {currentIndex + 1} of {mockQuestions.length}
          </div>
        </div>

        <QuestionCard
          index={currentIndex + 1}
          total={mockQuestions.length}
          category={currentQ.category}
          difficulty={currentQ.difficulty}
          question={currentQ.question}
          sourceFiles={currentQ.sourceFiles}
          expectedConcepts={currentQ.expectedConcepts}
        />

        {!evaluation ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your technical response here..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-colors font-sans resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !answer.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow transition-all"
              >
                {isSubmitting ? <span>Evaluating Answer...</span> : <><Send className="w-4 h-4" /><span>Submit Answer</span></>}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <AnswerEvaluation
              scores={evaluation.scores}
              strengths={evaluation.strengths}
              missingConcepts={evaluation.missingConcepts}
              feedback={evaluation.feedback}
              followUpQuestion={evaluation.followUpQuestion}
            />

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-all"
              >
                <span>{currentIndex < mockQuestions.length - 1 ? 'Next Question' : 'View Final Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
