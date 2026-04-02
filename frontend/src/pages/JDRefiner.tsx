import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { jdApi } from '../api/client';

const JDRefiner = () => {
  const [rawRequirements, setRawRequirements] = useState('');
  const [refinedJD, setRefinedJD] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRefine = async () => {
    if (!rawRequirements) return;
    setLoading(true);
    try {
      const response = await jdApi.refine(rawRequirements);
      setRefinedJD(response.data);
    } catch (error) {
      console.error('Refinement failed', error);
      alert('Refinement failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">LLM Layer (Groq GPT-OSS 120B)</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">JD Standardizer</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Input Panel */}
        <div className="premium-card flex flex-col gap-6 p-6 md:p-8">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <h3 className="font-bold text-sm tracking-tight text-secondary/40">INPUT_REQUIREMENTS</h3>
          </div>
          <textarea 
            className="flex-1 w-full min-h-[300px] lg:min-h-[400px] bg-transparent text-secondary font-mono text-sm leading-relaxed outline-none resize-none scrollbar-hide"
            placeholder="Paste raw requirements..."
            value={rawRequirements}
            onChange={(e) => setRawRequirements(e.target.value)}
          />
          <button 
            className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-white/90 disabled:opacity-50"
            onClick={handleRefine}
            disabled={!rawRequirements || loading}
          >
            {loading ? "PROCESSING..." : "GENERATE PREMIUM JD"}
          </button>
        </div>

        {/* Output Panel */}
        <div className="premium-card flex flex-col gap-6 bg-black/40 border-accent/20 p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-accent/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <h3 className="font-bold text-sm tracking-tight text-accent">STRUCTURED_OUTPUT.JSON</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
            {refinedJD ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{refinedJD.job_title}</h4>
                  <p className="text-secondary text-sm leading-relaxed">{refinedJD.role_summary}</p>
                </div>

                <div className="space-y-4">
                  <h5 className="font-mono text-[10px] uppercase tracking-widest text-accent">Responsibilities</h5>
                  <ul className="grid grid-cols-1 gap-2">
                    {refinedJD.responsibilities?.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-secondary">
                        <span className="text-accent mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-mono text-[10px] uppercase tracking-widest text-green-400">Must Have</h5>
                    <div className="flex flex-wrap gap-2">
                      {refinedJD.must_have_skills?.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded text-[10px] font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-mono text-[10px] uppercase tracking-widest text-blue-400">Preferred</h5>
                    <div className="flex flex-wrap gap-2">
                      {refinedJD.preferred_skills?.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded text-[10px] font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-2">Experience Required</p>
                   <p className="text-sm font-bold text-white">{refinedJD.experience_required}</p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                 <Sparkles size={48} className="mb-4" />
                 <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Awaiting JD Transformation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDRefiner;
