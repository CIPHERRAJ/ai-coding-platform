import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register/' : '/login/';
    try {
      const res = await api.post(endpoint, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Authentication failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {isRegister ? 'Join AI CodeMaster' : 'Welcome Back'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
