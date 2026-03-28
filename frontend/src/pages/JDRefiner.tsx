import { useState } from 'react';
import { jdApi } from '../api/client';
import { Sparkles, FileText } from 'lucide-react';
import './JDRefiner.css';

const JDRefiner = () => {
  const [input, setInput] = useState('');
  const [refined, setRefined] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefine = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const response = await jdApi.refine(input);
      setRefined(response.data.refined_jd);
    } catch (error) {
           console.error('Refinement failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jd-refiner-container">
      <div className="input-section premium-card">
        <div className="card-header">
          <FileText size={20} className="icon" />
          <h2>Raw Requirements</h2>
        </div>
        <textarea 
          placeholder="Paste raw requirements here... e.g., 'Need a python dev with 5 years exp, knows fastapi and react.'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn-primary" onClick={handleRefine} disabled={loading}>
          {loading ? 'Refining...' : <><Sparkles size={18} /> Refine with AI</>}
        </button>
      </div>

      {refined && (
        <div className="output-section premium-card glassmorphism">
          <div className="card-header">
            <Sparkles size={20} className="icon-gold" />
            <h2>Standardized JD</h2>
          </div>
          <div className="refined-content">
            <pre>{refined}</pre>
          </div>
          <div className="actions">
            <button className="btn-secondary">Save to Pipeline</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JDRefiner;
