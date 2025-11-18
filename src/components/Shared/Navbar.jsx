import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Vote, User, Shield, LogOut, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 py-4 px-4" style={{ backgroundColor: '#e0e5ec' }}>
      <div className="max-w-7xl mx-auto">
        <div 
          className="flex justify-between items-center h-16 px-6 rounded-2xl"
          style={{
            background: '#e0e5ec',
            boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
          }}
        >
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
                boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
              }}
            >
              <Vote className="w-6 h-6 text-white" />
            </div>
            <h1 
              className="text-2xl font-bold hidden sm:block"
              style={{ 
                background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              IndabaX Elections
            </h1>
          </div>

          {/* User Info & Actions */}
          {currentUser && (
            <div className="flex items-center space-x-4">
              {/* User Info Card */}
              <div 
                className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl"
                style={{
                  background: '#e0e5ec',
                  boxShadow: 'inset 4px 4px 8px #b8bec5, inset -4px -4px 8px #ffffff'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    boxShadow: '2px 2px 4px #b8bec5'
                  }}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 text-xs">Logged in as</p>
                  <p className="font-semibold text-gray-700">{currentUser.email}</p>
                </div>
              </div>
              
              {/* Admin Badge */}
              {isAdmin && (
                <div 
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                  }}
                >
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold hidden sm:inline">ADMIN</span>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #991b1b, inset -4px -4px 8px #f87171';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;