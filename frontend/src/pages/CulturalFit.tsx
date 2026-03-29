import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Zap, Cpu, Award, Info, Dna, MessageCircle, Activity } from 'lucide-react';

const MetricBar = ({ label, value, delay }: { label: string, value: number, delay: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">{label}</span>
      <span className="text-sm font-bold">{value}%</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className="h-full bg-accent"
      />
    </div>
  </div>
);

const MetricCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: any }) => (
  <div className="premium-card flex flex-col gap-4 p-6">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center">
      <Icon size={20} className="text-accent" />
    </div>
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1">{title}</p>
      <h4 className="text-xl font-bold tracking-tight">{value}</h4>
    </div>
  </div>
);

const CulturalFit = () => {
  const [scores] = useState({
    Innovation: 85,
    Integrity: 92,
    Collaboration: 78,
    Agility: 88
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Dna size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Alignment Score</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Cultural Core Matching</h2>
        </div>
      </header>

      <div className="premium-card flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-6 md:p-10">
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shrink-0">
           <div className="absolute inset-0 rounded-full border border-dashed border-accent/30 animate-[spin_20s_linear_infinite]" />
           <div className="absolute inset-4 md:inset-6 rounded-full border border-accent/10" />
           <div className="text-center group">
              <p className="text-[10px] font-mono text-secondary group-hover:text-accent transition-colors">MATCH_IDX</p>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tighter">92%</h3>
           </div>
        </div>
        
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Optimal Alignment Found</h3>
            <p className="text-sm text-secondary leading-relaxed max-w-2xl">
              Based on the core principles of high autonomy and low-latency decision making, the candidate exhibits <span className="text-white font-medium">92% alignment</span> with the current engineering culture.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center lg:justify-start">
             <span className="px-4 py-1.5 bg-white/5 border border-border rounded-full text-[10px] font-mono uppercase tracking-wider">High Autonomy</span>
             <span className="px-4 py-1.5 bg-white/5 border border-border rounded-full text-[10px] font-mono uppercase tracking-wider">Open Source Contributor</span>
             <span className="px-4 py-1.5 bg-white/5 border border-border rounded-full text-[10px] font-mono uppercase tracking-wider">Fast Iteration</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <MetricCard title="Communication Depth" value="High" icon={MessageCircle} />
        <MetricCard title="Decision Speed" value="84/100" icon={Activity} />
        <MetricCard title="Tooling Proficiency" value="Expert" icon={Cpu} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="premium-card space-y-8 p-6 md:p-8">
           <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Target size={18} className="text-accent" />
              <h3 className="font-bold text-sm uppercase tracking-tight">Dimension Breakdown</h3>
           </div>
           <div className="space-y-6">
              {Object.entries(scores).map(([label, value], i) => (
                <MetricBar key={label} label={label} value={value} delay={0.2 + (i * 0.1)} />
              ))}
           </div>
        </div>

        <div className="premium-card flex flex-col gap-6 border-accent/10 bg-accent/[0.01] p-6 md:p-8">
           <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Cpu size={18} className="text-accent" />
              <h3 className="font-bold text-sm uppercase tracking-tight">Neural Inference</h3>
           </div>
           
           <div className="space-y-4 flex-1">
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Info size={16} className="text-secondary" />
                 </div>
                 <p className="text-sm text-secondary leading-relaxed">
                   John shows exceptional alignment with our core value of <strong className="text-white">Integrity</strong>. 
                   His responses suggest a high degree of accountability in systemic failures.
                 </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-border">
                 <p className="text-xs text-secondary leading-relaxed">
                   His <strong className="text-white">Collaboration</strong> score is slightly lower than the average, indicating a potential preference for deep-work focus periods over continuous synchronicity.
                 </p>
              </div>
           </div>

           <div className="pt-6">
              <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-border py-4 rounded-xl font-bold transition-all text-[10px] tracking-widest uppercase font-mono">
                 <Zap size={14} />
                 Generate Full Report
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalFit;
