import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { Code, Trophy, Activity, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
}

interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  problems: Problem[];
}

interface Profile {
  skill_level: string;
  problems_solved: number;
  assessment_completed: boolean;
  topic_strength: {[key: string]: number};
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [learningPath, setLearningPath] = useState<Topic[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/');
        setProfile(res.data.profile);
        setLearningPath(res.data.learning_path);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      try {
        await api.post('/reset/');
        window.location.reload();
      } catch (err) {
        alert('Failed to reset profile.');
      }
    }
  };

  if (!profile) return <div className="p-10 text-center text-white">Loading your journey...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            AI CodeMaster
          </h1>
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-gray-400">v2.0 Beta</span>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
          className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-bold"
        >
          Logout
        </button>
      </header>

      {/* Assessment Prompt */}
      {!profile.assessment_completed && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Unlock Your Personalized Curriculum</h2>
              <p className="text-blue-100 max-w-xl">
                Take the AI Diagnostic Test to assess your logic patterns and generate a custom learning path tailored to your skill gaps.
              </p>
            </div>
            <button 
              onClick={() => navigate('/assessment')}
              className="px-8 py-3 bg-white text-blue-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Start Assessment
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        </motion.div>
      )}

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Stats & Profile */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-2xl bg-slate-900 border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                <UserIcon level={profile.skill_level} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile.skill_level}</h2>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Current Rank</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <StatRow label="Problems Solved" value={profile.problems_solved} color="text-green-400" />
              <div className="h-px bg-white/5 my-2" />
              <h3 className="text-sm font-bold text-gray-400 uppercase">Topic Strength</h3>
              {Object.entries(profile.topic_strength || {}).map(([topic, strength]) => (
                <div key={topic} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>{topic}</span>
                    <span>{Math.round(strength * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${strength * 100}%` }} />
                  </div>
                </div>
              ))}
              {Object.keys(profile.topic_strength).length === 0 && (
                <p className="text-xs text-gray-500 italic">No data yet. Solve problems to track progress.</p>
              )}
            </div>

            <button 
              onClick={handleReset}
              className="w-full mt-6 py-2 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Reset Progress
            </button>
          </motion.div>
        </div>

        {/* Right: Learning Path */}
        <div className="lg:col-span-3 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-400" /> Your Learning Path
          </h2>
          
          {learningPath.length === 0 ? (
             <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-gray-500">
               No topics found. (Did you run migrations?)
             </div>
          ) : (
            learningPath.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 bg-white/5">
                  <h3 className="text-xl font-bold text-white">{topic.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{topic.description}</p>
                </div>
                
                <div className="divide-y divide-white/5">
                  {topic.problems.map((problem) => (
                    <div 
                      key={problem.id}
                      onClick={() => navigate(`/solve/${problem.id}`)}
                      className="p-5 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColorDot(problem.difficulty)}`} />
                        <div>
                          <h4 className="font-medium group-hover:text-blue-400 transition-colors">
                            {problem.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-2 py-1 rounded bg-slate-800 ${getDifficultyTextColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                  {topic.problems.length === 0 && (
                    <div className="p-5 text-sm text-gray-500 italic">No problems in this topic yet.</div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const StatRow = ({ label, value, color }: any) => (
  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
    <span className="text-gray-300 text-sm">{label}</span>
    <span className={`font-mono text-lg font-bold ${color}`}>{value}</span>
  </div>
);

const UserIcon = ({ level }: { level: string }) => {
  if (level === 'Advanced') return <Trophy className="text-yellow-300" size={32} />;
  if (level === 'Intermediate') return <Activity className="text-blue-300" size={32} />;
  return <Code className="text-green-300" size={32} />;
};

const getDifficultyColorDot = (diff: string) => {
  switch(diff) {
    case 'Beginner': return 'bg-green-500';
    case 'Intermediate': return 'bg-yellow-500';
    case 'Advanced': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getDifficultyTextColor = (diff: string) => {
  switch(diff) {
    case 'Beginner': return 'text-green-400';
    case 'Intermediate': return 'text-yellow-400';
    case 'Advanced': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export default Dashboard;
