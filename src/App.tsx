import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Cart from './pages/Cart';
import Library from './pages/Library';
import { useEffect } from 'react';
import { seedDatabase } from './lib/seed';

export default function App() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brand-100 selection:bg-brand-300 selection:text-brand-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-brand-900 text-brand-100 py-20 px-4">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
              <div className="col-span-2">
                <h2 className="text-3xl font-serif font-bold mb-6">Lumina</h2>
                <p className="text-brand-400 max-w-sm leading-relaxed">
                  A premium global platform for discovering, exploring, and purchasing literature that stays with you.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-brand-500">Explore</h4>
                <ul className="space-y-4 text-brand-300">
                  <li><a href="#" className="hover:text-amber-400 transition-colors">Trending</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">New Releases</a></li>
                  <li><a href="#" className="hover:text-violet-400 transition-colors">Editor's Picks</a></li>
                  <li><a href="#" className="hover:text-rose-400 transition-colors">Genres</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-brand-500">Support</h4>
                <ul className="space-y-4 text-brand-300">
                  <li><a href="#" className="hover:text-sky-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Shipping</a></li>
                  <li><a href="#" className="hover:text-teal-400 transition-colors">Returns</a></li>
                  <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-brand-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-brand-500 text-sm">© 2026 Lumina Literature. All rights reserved.</p>
              <div className="flex space-x-8 text-sm text-brand-500">
                <a href="#" className="hover:text-brand-200 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-brand-200 transition-colors">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
