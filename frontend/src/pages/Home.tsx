import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Cpu, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block p-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold">
                Next-Gen Learning
              </span>
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Master Coding with <br />
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              An adaptive platform that evolves with you. From diagnostic assessments to real-time feedback, 
              experience a personalized curriculum tailored to your skills.
            </p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                Start Learning Now
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all border border-white/10">
                Explore Features
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Cpu className="text-cyan-400" size={32} />}
            title="Adaptive Engine"
            desc="Problems that adjust to your skill level automatically based on your performance."
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" size={32} />}
            title="Real-time AI Feedback"
            desc="Get instant explanations, optimization tips, and logic correction as you type."
          />
          <FeatureCard 
            icon={<Code className="text-purple-400" size={32} />}
            title="Smart Curriculum"
            desc="A structured learning path from Arrays to Advanced DP, curated just for you."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
  >
    <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;
