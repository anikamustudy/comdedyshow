import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const { data } = await api.post('/auth/login', formData);
      login(data.user, data.token);
      
      // Redirect based on role or go to dashboard
      window.location.href = '/shows';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/20 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
        <div className="text-center mb-12">
          <LogIn className="w-24 h-24 mx-auto mb-6 text-white drop-shadow-lg" />
          <h1 className="text-4xl font-black text-white mb-4">Welcome Back</h1>
          <p className="text-xl text-white/90">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-100 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-6 py-4 bg-white/30 border border-white/40 rounded-2xl text-xl focus:ring-4 ring-purple-400/50 focus:outline-none focus:border-transparent transition-all placeholder-white/70"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-6 py-4 bg-white/30 border border-white/40 rounded-2xl text-xl focus:ring-4 ring-purple-400/50 focus:outline-none focus:border-transparent transition-all placeholder-white/70"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/80">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-yellow-300 hover:text-yellow-200 transition">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-white/70 text-sm">Or continue as guest to book tickets</p>
          <Link 
            to="/shows" 
            className="inline-flex items-center gap-2 mt-4 text-yellow-300 hover:text-yellow-200 font-semibold transition"
          >
            Browse Shows → 
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

