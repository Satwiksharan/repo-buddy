import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Repositories } from './pages/Repositories';
import { RepositoryOverview } from './pages/RepositoryOverview';
import { RepositoryAnalysis } from './pages/RepositoryAnalysis';
import { ProjectExplanation } from './pages/ProjectExplanation';
import { ExplanationPractice } from './pages/ExplanationPractice';
import { Questions } from './pages/Questions';
import { Interview } from './pages/Interview';
import { InterviewResults } from './pages/InterviewResults';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/repositories/:id" element={<RepositoryOverview />} />
          <Route path="/repositories/:id/analysis" element={<RepositoryAnalysis />} />
          <Route path="/repositories/:id/explanation" element={<ProjectExplanation />} />
          <Route path="/repositories/:id/explanation/practice" element={<ExplanationPractice />} />
          <Route path="/repositories/:id/questions" element={<Questions />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/interview/:id/results" element={<InterviewResults />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
