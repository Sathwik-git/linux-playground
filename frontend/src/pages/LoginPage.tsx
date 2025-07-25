import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { notifyError, notifySuccess } from '../components/common/Toast';
import { ButtonColorful } from '../components/ui/button-colorful';
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Card from '../components/common/Card';
import { Spotlight } from '../components/ui/spotlight';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        notifySuccess('Login successful!');
        navigate('/');
      } else {
        notifyError(response.message || 'Login failed');
      }
    } catch (error) {
      notifyError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/[0.96] px-4 relative overflow-hidden">
      <Spotlight />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <Card className="w-full max-w-md p-8 animate-fade-in backdrop-blur-sm bg-black/40">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to access your terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary-400 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white
                         transition-all duration-200 placeholder-gray-500
                         hover:border-gray-600 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary-400 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-black/40 border border-gray-700 rounded-lg 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white
                         transition-all duration-200 placeholder-gray-500
                         hover:border-gray-600 focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                         hover:text-primary-400 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <ButtonColorful
            type="submit"
            disabled={isLoading}
            className="w-full mt-8"
            label={isLoading ? "Signing in..." : "Sign In"}
          />
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;