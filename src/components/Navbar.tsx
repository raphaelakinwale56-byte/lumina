import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { LogIn, LogOut, User as UserIcon, BookOpen, ShoppingCart, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, signIn, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Discover', path: '/' },
    { name: 'Library', path: '/library' },
    { name: 'Assistant', path: '/assistant' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-brand-600" />
            <span className="text-2xl font-serif font-bold tracking-tight text-brand-900">Lumina</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  location.pathname === link.path ? 'text-brand-600' : 'text-brand-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-brand-200">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/cart" className="relative p-2 text-brand-500 hover:text-emerald-600 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-sm font-medium text-brand-500 hover:text-rose-600 transition-colors"
                  >
                    <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-brand-200" referrerPolicy="no-referrer" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="flex items-center space-x-2 bg-brand-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-all shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <Link to="/cart" className="p-2 text-brand-500">
                <ShoppingCart className="w-5 h-5" />
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-brand-500">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-50 border-b border-brand-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-lg font-medium text-brand-700 border-b border-brand-100 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
              {!user ? (
                <button
                  onClick={() => { signIn(); setIsOpen(false); }}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-brand-800 text-white px-4 py-3 rounded-xl text-lg font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              ) : (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full mt-4 flex items-center justify-center space-x-2 border border-brand-200 text-brand-700 px-4 py-3 rounded-xl text-lg font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
