import { motion } from 'framer-motion';
import { Users, ClipboardCheck, Zap, BarChart3 } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend }: { label: string, value: string, icon: any, trend: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="premium-card p-4 md:p-6 relative overflow-hidden group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-white/5 border border-border">
        <Icon size={18} className="text-accent" />
      </div>
      <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">{trend}</span>
    </div>
    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-1">{label}</p>
    <h3 className="text-2xl font-bold tracking-tighter">{value}</h3>
  </motion.div>
);

const ActivityItem = ({ title, desc, time }: { title: string, desc: string, time: string }) => (
  <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
    <div className="w-2 h-2 rounded-full bg-accent mt-2" />
    <div className="flex-1">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-secondary mt-0.5">{desc}</p>
    </div>
    <span className="font-mono text-[10px] text-secondary/50 uppercase">{time}</span>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">System Overview</p>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Intelligence Hub</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-secondary bg-white/5 px-3 py-1.5 rounded-lg border border-border w-fit">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>REAL-TIME ANALYSIS ACTIVE</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={Users} label="Active Candidates" value="1,284" trend="+12.5%" />
        <StatCard icon={ClipboardCheck} label="Interviews Today" value="24" trend="3 Pending" />
        <StatCard icon={Zap} label="Average Match" value="84%" trend="+4.2%" />
        <StatCard icon={BarChart3} label="Hiring Velocity" value="12 Days" trend="-2 Days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Neural Activity Feed</h3>
              <button className="text-[10px] font-mono uppercase tracking-widest text-accent hover:text-white transition-colors">View All Logs</button>
            </div>
            
            <div className="space-y-4">
              <ActivityItem 
                title="Match Engine Analysis" 
                desc="Candidate #829 matched with 'Senior Dev' role at 94% confidence." 
                time="2m ago" 
              />
              <ActivityItem 
                title="JD Standardization" 
                desc="New 'Engineering Lead' JD processed and indexed into vector DB." 
                time="14m ago" 
              />
              <ActivityItem 
                title="Interview Intelligence" 
                desc="Transcript #104 analyzed. 3 critical gaps identified in Candidate #910." 
                time="1h ago" 
              />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <div className="premium-card bg-accent/5 border-accent/20">
            <h3 className="text-lg font-bold mb-4">AI Copilot Status</h3>
            <p className="text-sm text-secondary leading-relaxed mb-6">
              Our neural matching engine is currently processing the latest candidate pool for the <span className="text-white font-medium">Quant Engineer</span> position.
            </p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="h-full bg-accent"
              />
            </div>
            <p className="text-[10px] font-mono text-secondary uppercase tracking-widest">65% Sync Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
