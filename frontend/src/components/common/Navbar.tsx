import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, LogOut, User } from 'lucide-react';
import { authService } from '../../services/auth';
import { notifySuccess } from '../common/Toast';
import { ButtonColorful } from '../ui/button-colorful';
import { RainbowButton } from '../ui/rainbow-button';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    notifySuccess('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-black/40 border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-primary-400 transition-colors">
              <Terminal size={24} className="text-primary-500" />
              <span className="font-semibold text-base sm:text-lg">Linux Playground</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/terminal"
                  className="text-gray-300 hover:text-white px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Terminal
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                    <User size={18} className="text-primary-400" />
                  </div>
                  <ButtonColorful
                    onClick={handleLogout}
                    className="hidden sm:flex items-center space-x-2 text-sm"
                    label={
                      <div className="flex items-center space-x-2">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </div>
                    }
                  />
                  <button
                    onClick={handleLogout}
                    className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              !(['/login', '/signup'].includes(location.pathname)) && (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link to="/signup">
                    <RainbowButton className="flex items-center space-x-2 text-sm px-4 sm:px-6">
                      <User size={16} />
                      <span className="hidden sm:inline">Sign Up</span>
                    </RainbowButton>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;