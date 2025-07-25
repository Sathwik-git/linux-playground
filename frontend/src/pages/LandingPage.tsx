import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, ArrowRight, Terminal as Terminal2, MousePointerClick, DollarSign, Cloud, Share2, HelpCircle, Settings, Heart, Clock, Github, Twitter } from 'lucide-react';
import { sessionService } from '../services/api';
import { notifyError } from '../components/common/Toast';
import { Spotlight, GridBackground } from '../components/ui/spotlight';
import { ButtonColorful } from '../components/ui/button-colorful';
import { RainbowButton } from '../components/ui/rainbow-button';
import { authService } from '../services/auth';
import { cn } from '../lib/utils';

const features = [
  {
    title: "Full Terminal Access",
    description: "Get complete access to a Linux environment with all standard tools and utilities pre-installed.",
    icon: <Terminal2 className="w-6 h-6" />,
  },
  {
    title: "Easy to Use",
    description: "Intuitive interface designed for both beginners and experienced developers.",
    icon: <MousePointerClick className="w-6 h-6" />,
  },
  {
    title: "Free to Start",
    description: "Begin experimenting with Linux right away, no credit card required.",
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    title: "Cloud-Powered",
    description: "High-performance cloud infrastructure ensures reliable access.",
    icon: <Cloud className="w-6 h-6" />,
  },
  {
    title: "Collaborative",
    description: "Share your terminal sessions and work together in real-time.",
    icon: <Share2 className="w-6 h-6" />,
  },
  {
    title: "24/7 Support",
    description: "Get help whenever you need it with our always-available support.",
    icon: <HelpCircle className="w-6 h-6" />,
  },
  {
    title: "Customizable",
    description: "Configure your environment exactly how you want it.",
    icon: <Settings className="w-6 h-6" />,
  },
  {
    title: "Developer First",
    description: "Built by developers, for developers, with love.",
    icon: <Heart className="w-6 h-6" />,
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleLaunchPlayground = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await sessionService.createSession();
      
      if (response) {
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 60);
        
        navigate('/terminal', { 
          state: { 
            terminalUrl: response.data.InstanceIP,
            startTime: new Date(),
            endTime,
          } 
        });
      } else {
        notifyError('Failed to create session');
      }
    } catch (error) {
      notifyError('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black/[0.96] relative overflow-hidden">
      <GridBackground />
      <Spotlight />
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Terminal size={48} className="text-primary-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Linux Playground
          </h1>
          
          <div className="h-12 overflow-hidden">
            <p className="text-xl text-gray-300 mb-8 animate-typing">
              Instant access to your own cloud Linux terminal
            </p>
          </div>
          
          {isAuthenticated ? (
            <ButtonColorful
              onClick={handleLaunchPlayground}
              disabled={isLoading}
              className="mt-6"
              label={isLoading ? "Loading..." : "Launch Playground"}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 mt-6">
              <RainbowButton onClick={() => navigate('/signup')} className="px-8">
                Get Started
              </RainbowButton>
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-12">
            Everything you need for Linux experimentation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10">
            {features.map((feature, index) => (
              <Feature key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-4">
                <Terminal size={24} className="text-primary-500 mr-2" />
                <span className="text-white font-semibold text-lg">Linux Playground</span>
              </div>
              <p className="text-sm text-gray-400 text-center md:text-left">
                Experience Linux development in your browser. No installation required.
              </p>
            </div>
            
            {/* Session Info */}
            <div className="flex flex-col items-center">
              <h3 className="text-white font-semibold mb-4">Session Information</h3>
              <div className="flex items-center text-sm text-gray-400">
                <Clock size={16} className="mr-2" />
                <span>Sessions expire after 1 hour</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Linux Playground
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;