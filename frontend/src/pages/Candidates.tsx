import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, BarChart3, Target, Zap, ChevronRight, Search, Activity } from 'lucide-react';
import { candidateApi } from '../api/client';

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
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Search size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Neural Match</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Comparative Analysis</h2>
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
              <label className="font-mono text-[10px] uppercase tracking-widest text-secondary">Candidate Artifact (CV)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="file-upload"
                />
                <div className="border-2 border-dashed border-border group-hover:border-accent/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all bg-white/[0.02]">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Upload size={24} className="text-secondary group-hover:text-accent transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{file ? file.name : 'Upload PDF/DOCX'}</p>
                    <p className="text-[10px] text-secondary font-mono mt-1">MAX SIZE: 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-bold transition-all hover:bg-white/90 disabled:opacity-50"
              onClick={handleUpload} 
              disabled={!file || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  PROCESSING...
                </span>
              ) : (
                <>EXECUTE ANALYSIS <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-2xl bg-white/[0.01]"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Activity size={32} className="text-secondary/20" />
                </div>
                <h3 className="text-xl font-bold text-secondary/40">Awaiting Signal...</h3>
                <p className="text-sm text-secondary/30 max-w-xs mt-2 font-mono">
                  Input job requirements and candidate data to initialize neural comparison.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Header */}
                <div className="premium-card border-accent/20 bg-accent/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * (result.comparison?.matching_score || 0)) / 100} className="text-accent transition-all duration-1000" />
                      </svg>
                      <span className="absolute text-2xl font-bold tracking-tighter">{result.comparison?.matching_score}%</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Matching Index</h3>
                      <p className="text-sm text-secondary font-mono uppercase tracking-tighter">Candidate Fit Score</p>
                    </div>
                  </div>
                  <div className="hidden md:block max-w-md text-right">
                    <p className="text-xs text-secondary leading-relaxed italic">
                      "{result.comparison?.justification}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matching Skills */}
                  <div className="premium-card">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={18} className="text-green-400" />
                      <h4 className="font-bold">Neural Overlap</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.comparison?.top_skills?.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg text-xs font-mono uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Identified Gaps */}
                  <div className="premium-card">
                    <div className="flex items-center gap-2 mb-4">
                      <Target size={18} className="text-red-400" />
                      <h4 className="font-bold">Critical Gaps</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.comparison?.gaps?.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg text-xs font-mono uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="premium-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={18} className="text-accent" />
                      <h4 className="font-bold text-lg">Requirements Verification</h4>
                    </div>
                    <span className="font-mono text-[10px] text-secondary">SOURCE: JD_CORE_METADATA</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.comparison?.matched_requirements?.map((req: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-border group hover:border-accent/30 transition-all">
                        <CheckCircle size={16} className="text-accent mt-0.5" />
                        <span className="text-sm text-secondary group-hover:text-white transition-colors leading-snug">{req}</span>
                      </div>
                    ))}
                  </div>
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
