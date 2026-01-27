import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  description: string;
  starter_code: string;
}

const Assessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/assessment/questions/')
      .then(res => {
        setQuestions(res.data);
        const initialAnswers: any = {};
        res.data.forEach((q: any) => initialAnswers[q.id] = q.starter_code);
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch(() => alert('Failed to load assessment.'));
  }, []);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(curr => curr + 1);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = async () => {
    setSubmitting(true);
    const payload = questions.map(q => ({
      question: q.description,
      code: answers[q.id]
    }));

    try {
      await api.post('/assessment/submit/', { submissions: payload });
      navigate('/dashboard');
    } catch (err) {
      alert('Error submitting assessment');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Assessment...</div>;

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Question */}
        <div className="flex flex-col justify-center">
          <motion.div 
            key={currentQ.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-sm text-blue-400 font-bold uppercase tracking-wider">
              Diagnostic Question {currentIdx + 1}/{questions.length}
            </div>
            <h1 className="text-3xl font-bold">{currentQ.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">{currentQ.description}</p>
            
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg text-blue-200 text-sm">
              <p>Solve this to the best of your ability. Our AI analyzes your logic, not just syntax.</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Editor */}
        <div className="flex flex-col bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="bg-slate-800 p-3 border-b border-white/5 flex justify-between items-center">
            <span className="text-xs text-gray-400 font-mono">main.py</span>
            <span className="text-xs text-green-400">Auto-save enabled</span>
          </div>
          <textarea
            value={answers[currentQ.id]}
            onChange={(e) => setAnswers({...answers, [currentQ.id]: e.target.value})}
            className="flex-1 bg-slate-950 p-4 font-mono text-sm text-gray-300 focus:outline-none resize-none"
            spellCheck={false}
          />
          <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-end">
            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" /> : null}
              {currentIdx === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
