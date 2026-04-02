import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Activity } from 'lucide-react';
import { candidateApi } from '../api/client';

const Candidates = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [top5Summary, setTop5Summary] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setTop5Summary('');
    try {
      const response = await candidateApi.uploadCv(files, jdText);
      setResults(response.data.candidates);
      setTop5Summary(response.data.top_5_summary);
      setSelectedIndex(0); // Select the top candidate by default
      setFiles([]); // Clear files after successful upload
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const selectedResult = selectedIndex !== null ? results[selectedIndex] : null;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Zap size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Batch Neural Match (Groq GPT-OSS 120B)</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Candidate Ranking</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-secondary">Target Environment (JD)</label>
              <textarea 
                placeholder="Paste the Job Description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full h-32 bg-white/5 border border-border rounded-xl p-4 text-sm focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="font-mono text-[10px] uppercase tracking-widest text-secondary">Upload Resumes</label>
              <div className="relative group">
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-border group-hover:border-accent/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all bg-white/[0.02]">
                  <Upload size={20} className="text-secondary group-hover:text-accent" />
                  <p className="text-[10px] font-medium text-secondary italic">Click to add PDF/DOCX files</p>
                </div>
              </div>

              {/* File Queue */}
              {files.length > 0 && (
                <div className="space-y-2 max-h-[150px] overflow-y-auto scrollbar-hide pt-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-[10px] truncate max-w-[150px] text-secondary">{file.name}</span>
                      <button onClick={() => removeFile(i)} className="text-accent hover:text-red-400 text-[10px] font-bold">REMOVE</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              className="w-full bg-white text-black py-4 rounded-xl font-bold transition-all hover:bg-white/90 disabled:opacity-50"
              onClick={handleUpload} 
              disabled={files.length === 0 || loading}
            >
              {loading ? "ANALYZING 1-BY-1..." : "RANK CANDIDATES"}
            </button>
          </div>

          {/* Ranking Sidebar */}
          {results.length > 0 && (
            <div className="premium-card p-4 space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary border-b border-white/5 pb-2">Ranked Results</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                {results.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedIndex === idx ? 'bg-accent/10 border-accent text-white' : 'bg-white/5 border-transparent text-secondary hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold truncate pr-2">#{idx + 1} {res.name}</span>
                      <span className="text-[10px] font-mono text-accent">{res.score}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Display */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top 5 Summary Section */}
          {top5Summary && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="premium-card bg-accent/5 border-accent/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-accent" />
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Batch Intelligence Insight (Top 5 Comparison)</h4>
              </div>
              <p className="text-sm leading-relaxed text-secondary/90 italic">
                {top5Summary}
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!selectedResult ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-2xl bg-white/[0.01]">
                <Activity size={32} className="text-secondary/20 mb-4" />
                <h3 className="text-xl font-bold text-secondary/40">Neural Analysis Ready</h3>
                <p className="text-sm text-secondary/30 mt-2 font-mono">Upload multiple resumes to see ranked comparisons and batch insights.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="premium-card border-accent/20 bg-accent/[0.02] flex items-center justify-between p-6 md:p-8">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent flex items-center justify-center shrink-0">
                        <span className="text-2xl font-bold">{selectedResult.score}%</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedResult.name}</h3>
                        <p className="text-xs text-secondary font-mono uppercase">Neural Rank Alignment</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="premium-card border-green-400/20">
                    <h4 className="font-bold text-sm mb-4 text-green-400 uppercase tracking-widest">Matched Skills</h4>
                    <div className="flex flex-wrap gap-2">
                       {selectedResult.comparison?.top_skills?.map((s: string, i: number) => (
                         <span key={i} className="px-2 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg text-[10px] font-mono uppercase">{s}</span>
                       ))}
                    </div>
                  </div>
                  <div className="premium-card border-red-400/20">
                    <h4 className="font-bold text-sm mb-4 text-red-400 uppercase tracking-widest">Identified Gaps</h4>
                    <div className="flex flex-wrap gap-2">
                       {selectedResult.comparison?.gaps?.map((s: string, i: number) => (
                         <span key={i} className="px-2 py-1 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg text-[10px] font-mono uppercase">{s}</span>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="premium-card">
                  <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-accent">Analysis Justification</h4>
                  <p className="text-sm text-secondary italic leading-relaxed">"{selectedResult.comparison?.justification}"</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
