import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import JDRefiner from './pages/JDRefiner';
import Candidates from './pages/Candidates';
import InterviewCopilot from './pages/InterviewCopilot';
import CulturalFit from './pages/CulturalFit';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <header className="top-header glassmorphism">
            <h1>Recruitment Dashboard</h1>
            <div className="user-profile">
              <span className="status-dot"></span>
              Online
            </div>
          </header>
          
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jd-refiner" element={<JDRefiner />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/interview" element={<InterviewCopilot />} />
              <Route path="/cultural-fit" element={<CulturalFit />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
