import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { jdApi } from '../api/client';

const JDRefiner = () => {
  const [rawRequirements, setRawRequirements] = useState('');
  const [refinedJD, setRefinedJD] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefine = async () => {
    if (!rawRequirements) return;
    setLoading(true);
    try {
      const response = await jdApi.refine(rawRequirements);
      setRefinedJD(response.data.refined_jd);
    } catch (error) {
      console.error('Refinement failed', error);
      alert('Refinement failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">LLM Layer</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">JD Standardizer</h2>
        </div>
        <div className="bg-white/5 border border-border px-4 py-2 rounded-xl">
           <p className="text-[10px] font-mono text-secondary uppercase tracking-widest leading-none mb-1">Target Persona</p>
           <p className="text-xs font-bold font-sans">Professional Engineering Standard</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Input Panel */}
        <div className="premium-card flex flex-col gap-6 p-6 md:p-8">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <h3 className="font-bold text-sm tracking-tight">RAW_REQUIREMENTS.MD</h3>
          </div>
          <textarea 
            className="flex-1 w-full min-h-[300px] lg:min-h-[400px] bg-transparent text-secondary font-mono text-sm leading-relaxed outline-none resize-none scrollbar-hide"
            placeholder="Paste your raw, messy job requirements here..."
            value={rawRequirements}
            onChange={(e) => setRawRequirements(e.target.value)}
          />
          <button 
            className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-white/90 disabled:opacity-50"
            onClick={handleRefine}
            disabled={!rawRequirements || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                STANDARDIZING...
              </span>
            ) : (
              <>EXECUTE REFINEMENT <ChevronRight size={18} /></>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="premium-card flex flex-col gap-6 bg-black/40 border-accent/20 border-x-accent/10 p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-accent/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <h3 className="font-bold text-sm tracking-tight text-accent">REFINED_OUTPUT.LOG</h3>
            </div>
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
               <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div className="flex-1 text-sm font-sans text-secondary leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[400px] lg:max-h-none">
            {refinedJD ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="prose prose-invert prose-sm"
              >
                {refinedJD}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20 lg:py-0">
                 <Sparkles size={48} className="mb-4" />
                 <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Awaiting Input Signal</p>
              </div>
            )}
          </div>

          {refinedJD && (
            <div className="pt-6 mt-auto border-t border-white/5 flex gap-3">
               <button className="flex-1 bg-white/5 hover:bg-white/10 border border-border py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">Copy</button>
               <button className="flex-1 bg-white/5 hover:bg-white/10 border border-border py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">Export</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JDRefiner;
