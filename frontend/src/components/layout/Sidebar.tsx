import { NavLink } from 'react-router-dom';
import { Home, Users, MessageSquare, ClipboardCheck, BarChart3, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar glassmorphism">
      <div className="logo">
        <span className="logo-icon">TA</span>
        <span className="logo-text">TalentAI</span>
      </div>
      <nav>
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}><Home size={20} /> Dashboard</NavLink></li>
          <li><NavLink to="/jd-refiner" className={({ isActive }) => isActive ? 'active' : ''}><ClipboardCheck size={20} /> JD Refiner</NavLink></li>
          <li><NavLink to="/candidates" className={({ isActive }) => isActive ? 'active' : ''}><Users size={20} /> Candidates</NavLink></li>
          <li><NavLink to="/interview" className={({ isActive }) => isActive ? 'active' : ''}><MessageSquare size={20} /> Interview Copilot</NavLink></li>
          <li><NavLink to="/cultural-fit" className={({ isActive }) => isActive ? 'active' : ''}><BarChart3 size={20} /> Cultural Fit</NavLink></li>
          <li><NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}><Settings size={20} /> Settings</NavLink></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
