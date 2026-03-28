import { useState } from 'react';
import './CulturalFit.css';

const CulturalFit = () => {
  const [scores] = useState({
    Innovation: 85,
    Integrity: 92,
    Collaboration: 78,
    Agility: 88
  });

  return (
    <div className="cultural-fit-container">
      <div className="profile-header premium-card">
        <div className="avatar glassmorphism">JD</div>
        <div className="profile-info">
          <h2>John Doe</h2>
          <p>Candidate for Senior Software Engineer</p>
        </div>
        <div className="overall-score">
          <span className="label">Alignment Score</span>
          <span className="value">86%</span>
        </div>
      </div>

      <div className="metrics-grid">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="metric-card premium-card">
            <div className="metric-header">
              <h3>{key}</h3>
              <span className="percentage">{value}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${value}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="insights-card premium-card glassmorphism">
        <h3>AI Insight</h3>
        <p>John shows exceptional alignment with our core value of <strong>Integrity</strong>. His responses in the SIT (Situational Judgment Test) suggest a high degree of accountability. His <strong>Collaboration</strong> score is slightly lower than the average, indicating he may prefer individual deep-work over constant pair-programming.</p>
      </div>
    </div>
  );
};

export default CulturalFit;
