import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, CheckCircle2, AlertCircle, ListChecks, Terminal, Play, ShieldCheck, Brain } from 'lucide-react';

const InterviewCopilot = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript] = useState([
    { role: 'INT', text: "Can you explain your experience with distributed systems architecture and how you handle data consistency?" },
    { role: 'CAN', text: "In my previous project at X, we implemented an event-driven architecture using Kafka. For consistency, we utilized..." }
  ]);
  const [mustAsk] = useState([
    { label: "Verify CAP Theorem trade-offs", done: true },
    { label: "Ask about saga pattern specifics", done: false },
    { label: "Deep dive on partitioning logic", done: false },
    { label: "Validate infrastructure scaling model", done: false },
  ]);

  const CheckItem = ({ label, done }: { label: string, done: boolean }) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${done ? 'bg-green-400/5 border-green-400/10 grayscale' : 'bg-white/5 border-border'}`}>
      {done ? <CheckCircle2 size={16} className="text-green-400" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
      <span className={`text-sm ${done ? 'text-secondary line-through' : 'text-white'}`}>{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-secondary'}`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{isRecording ? 'Live Stream' : 'Neural Core'}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Interview Copilot</h2>
        </div>
        <button 
          onClick={() => setIsRecording(!isRecording)}
          className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white text-black hover:bg-white/90'}`}
        >
          {isRecording ? 'STOP_ANALYSIS' : 'START_COPILOT'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Live Feed Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="premium-card min-h-[400px] lg:h-[600px] flex flex-col p-6 md:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-tight">
                <Terminal size={18} className="text-secondary" />
                TRANSCRIPT_FEED.LOG
              </h3>
              <span className="text-[10px] font-mono text-secondary px-2 py-1 bg-white/5 rounded">LATENCY: 42MS</span>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto pr-4 scrollbar-hide">
              {isRecording ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {transcript.map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className={`text-[10px] font-mono mt-1 shrink-0 ${line.role === 'INT' ? 'text-accent' : 'text-secondary'}`}>{line.role}:</span>
                      <p className={`text-sm leading-relaxed ${line.role === 'INT' ? 'text-secondary/80' : 'text-white'}`}>{line.text}</p>
                    </div>
                  ))}
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex items-center gap-2 text-accent/50"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Processing Stream...</p>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Play size={48} className="mb-4" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Initialize Recording to Begin Stream</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card bg-accent/5 border-accent/20 p-6 md:p-8">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-sm uppercase tracking-tight">
              <ShieldCheck size={18} className="text-accent" />
              LIVE_SUGGESTIONS
            </h3>
            <div className="space-y-3">
              {mustAsk.map((item, i) => (
                <CheckItem key={i} label={item.label} done={item.done} />
              ))}
            </div>
          </div>

          <div className="premium-card p-6 md:p-8">
             <div className="flex items-center gap-2 mb-4">
                <Brain size={18} className="text-secondary" />
                <h4 className="text-sm font-bold uppercase tracking-tight">Neural Sentiment</h4>
             </div>
             <p className="text-xs text-secondary leading-relaxed font-mono">
               ANALYSIS: Candidate demonstrates high technical depth in backend patterns. Sentiment: <span className="text-green-400">Stable/Confident</span>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCopilot;
