import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { Play, MessageSquare, ArrowLeft, Send, CheckCircle, XCircle, Terminal } from 'lucide-react';
import clsx from 'clsx';

interface Problem {
  id: number;
  title: string;
  description: string;
  starter_code: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get('/dashboard/'); 
        // Traverse learning path to find problem
        let found: Problem | undefined;
        for (const topic of res.data.learning_path) {
            found = topic.problems.find((p: any) => p.id === Number(id));
            if (found) break;
        }
        
        if (found) {
          setProblem(found);
          setCode(found.starter_code);
        } else {
            alert('Problem not found');
            navigate('/dashboard');
        }
      } catch (err) {
        navigate('/login');
      }
    };
    fetchProblem();
  }, [id, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.post(`/submit/${id}/`, { code, language });
      setFeedback({
        correct: res.data.is_correct,
        msg: res.data.feedback
      });
    } catch (err) {
      alert('Error submitting code');
    }
    setLoading(false);
  };

  const handleAskAI = async () => {
    if (!question.trim()) return;
    const newChat = [...chat, { role: 'user', text: question } as ChatMessage];
    setChat(newChat);
    setQuestion('');
    
    try {
      const res = await api.post('/ask/', {
        question,
        code,
        context: problem?.description
      });
      setChat([...newChat, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
      setChat([...newChat, { role: 'ai', text: 'Error connecting to AI.' }]);
    }
  };

  if (!problem) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg">{problem.title}</h1>
             <div className="flex gap-2 text-xs text-gray-400">
                <span>Problem ID: {problem.id}</span>
                <span>•</span>
                <span className="capitalize">{language}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
            </select>
            <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
            >
            {loading ? 'Running...' : <><Play size={18} /> Run & Submit</>}
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Description & Chat */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-slate-900/50">
          <div className="p-6 border-b border-white/10 overflow-y-auto max-h-[50%]">
            <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Problem Description</h3>
            <p className="leading-relaxed text-gray-200 whitespace-pre-line">{problem.description}</p>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 bg-slate-900 border-b border-white/10 flex items-center gap-2 text-blue-400">
              <MessageSquare size={16} />
              <span className="font-bold text-sm">AI Doubt Solver</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-10">
                    Ask a question about your code or the problem statement.
                </div>
              )}
              {chat.map((msg, idx) => (
                <div key={idx} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={clsx(
                    "max-w-[85%] p-3 rounded-xl text-sm",
                    msg.role === 'user' ? "bg-blue-600 text-white" : "bg-slate-800 text-gray-200"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-white/10 bg-slate-900">
              <div className="relative">
                <input 
                  type="text" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Ask AI about this problem..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button 
                  onClick={handleAskAI}
                  className="absolute right-2 top-2 text-blue-400 hover:text-blue-300"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="flex-1 flex flex-col bg-slate-950 relative">
          <div className="absolute top-0 right-0 bg-white/5 px-2 py-1 text-xs text-gray-500 rounded-bl-lg pointer-events-none">
            Editor
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-transparent p-6 font-mono text-sm text-gray-300 focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
          
          {feedback && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className={clsx(
                "absolute bottom-0 left-0 right-0 max-h-[40%] overflow-y-auto p-6 border-t shadow-xl",
                feedback.correct ? "bg-green-900/95 border-green-700" : "bg-red-900/95 border-red-700"
              )}
            >
              <div className="flex items-start gap-4">
                {feedback.correct ? <CheckCircle className="text-green-400 mt-1 shrink-0" /> : <XCircle className="text-red-400 mt-1 shrink-0" />}
                <div>
                  <h4 className={clsx("font-bold mb-1", feedback.correct ? "text-green-300" : "text-red-300")}>
                    {feedback.correct ? "Solution Accepted" : "Execution / Logic Error"}
                  </h4>
                  <div className="text-gray-200 text-sm font-mono whitespace-pre-wrap bg-black/20 p-3 rounded mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 uppercase tracking-wide">
                        <Terminal size={12} /> AI Feedback / Output
                    </div>
                    {feedback.msg}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
