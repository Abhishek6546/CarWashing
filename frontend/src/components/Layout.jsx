import { Link, useLocation } from 'react-router-dom';
import { Car, Calendar, Plus, Home, BarChart3, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/add-booking', label: 'New Booking', icon: Plus },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm"></div>
                <div className="relative p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                  <Car className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  CarWash Pro
                </span>
                <div className="text-xs text-gray-500 -mt-1">Premium Service</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.slice(0, 2).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform -translate-y-0.5' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive(item.path) ? 'text-white' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Quick Stats */}
              <div className="hidden xl:flex items-center space-x-4 ml-6 px-4 py-2 bg-white/60 rounded-xl">
                <div className="text-xs text-gray-500">Today</div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </nav>

            {/* Mobile menu button and Quick Add */}
            <div className="flex items-center space-x-3 lg:hidden">
              <Link
                to="/add-booking"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>New</span>
              </Link>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.slice(0, 2).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.path) 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with enhanced spacing */}
      <main className="flex-1 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Footer Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                <Car className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">CarWash Pro</p>
                <p className="text-xs text-gray-500">&copy; 2025 All rights reserved.</p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span>Built with</span>
                <span className="text-blue-600 font-medium">React & Node.js</span>
              </span>
              <div className="hidden sm:flex items-center space-x-4">
                <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;