import { useState } from 'react';
import { candidateApi } from '../api/client';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import './Candidates.css';

const Candidates = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const response = await candidateApi.uploadCv(file, jdText);
      setResult(response.data);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidates-container">
      <div className="upload-section premium-card">
        <div className="card-header">
          <Upload size={20} className="icon" />
          <h2>CV Analysis & Comparison</h2>
        </div>
        
        <div className="jd-input-container">
          <label>Target Job Description (Optional)</label>
          <textarea 
            placeholder="Paste the Job Description here to compare with the resume..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="jd-textarea glassmorphism"
          />
        </div>

        <p className="subtitle">Upload candidate resume (PDF/DOCX) for AI matching.</p>
        
        <div className="dropzone glassmorphism">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <FileText size={48} className="upload-icon" />
            <span>{file ? file.name : 'Select Resume'}</span>
          </label>
        </div>

        <button className="btn-primary" onClick={handleUpload} disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Start Comparative Analysis'}
        </button>
      </div>

      {result && (
        <div className="results-section">
          {result.comparison && typeof result.comparison === 'object' ? (
            <div className="results-grid">
              <div className="premium-card glassmorphism ranking-analysis-card">
                <div className="card-header">
                  <CheckCircle size={20} className="icon-green" />
                  <h2>Ranking Analysis Result</h2>
                </div>
                <div className="comparison-card">
                  <div className="score-badge">Match: {result.comparison?.matching_score}%</div>
                  <p className="justification"><strong>AI Verdict:</strong> {result.comparison?.justification}</p>
                  
                  <div className="skills-grid">
                    <div className="skill-column">
                      <h4>Matching Skills</h4>
                      <ul className="accent-list">
                        {result.comparison?.top_skills?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="skill-column">
                      <h4>Identified Gaps</h4>
                      <ul className="gap-list">
                        {result.comparison?.gaps?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card glassmorphism matched-requirements-card">
                <div className="card-header">
                  <CheckCircle size={20} className="icon-green" />
                  <h2>What Skills You Want</h2>
                </div>
                <p className="subtitle" style={{ fontSize: '14px', marginBottom: '12px' }}>
                  Requirements from your JD that the candidate satisfies.
                </p>
                <div className="requirement-list">
                  {result.comparison?.matched_requirements?.length > 0 ? (
                    result.comparison.matched_requirements.map((req: string, i: number) => (
                      <div key={i} className="requirement-item">
                        <CheckCircle size={14} className="requirement-check" />
                        <span>{req}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No specific JD requirements matched yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card glassmorphism analysis-summary">
              <div className="card-header">
                <CheckCircle size={20} className="icon-green" />
                <h2>Analysis Summary</h2>
              </div>
              <p>Candidate parsed successfully.</p>
              {result.comparison && typeof result.comparison === 'string' && (
                <div className="raw-comparison glassmorphism">
                  <strong>AI Analysis:</strong>
                  <p>{result.comparison}</p>
                </div>
              )}
              <div className="data-preview">
                <strong>Structured Data:</strong>
                <pre className="json-result">{JSON.stringify(result.candidate_data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Candidates;
