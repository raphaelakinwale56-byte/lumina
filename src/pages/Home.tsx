import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, TrendingUp, Sparkles, Clock, BookOpen, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { useBooks, Book } from '../lib/useBooks';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/useCart';
import { Link } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GENRES = [
  "Fiction", "Romance", "Mystery", "Fantasy", "Science Fiction", 
  "Thriller", "Historical", "Self-Development", "Poetry"
];

const GENRE_STYLES: Record<string, string> = {
  "Fiction": "hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700",
  "Romance": "hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700",
  "Mystery": "hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700",
  "Fantasy": "hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700",
  "Science Fiction": "hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700",
  "Thriller": "hover:border-red-400 hover:bg-red-50 hover:text-red-700",
  "Historical": "hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700",
  "Self-Development": "hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700",
  "Poetry": "hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700"
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { books, loading } = useBooks({ 
    genre: selectedGenre || undefined,
    trending: !selectedGenre ? true : undefined 
  });
  const { user, signIn } = useAuth();
  const { addToCart } = useCart();

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-16 pb-20 cinematic-gradient">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-brand-600 uppercase bg-brand-200/50 rounded-full">
            The Global Literary Universe
          </span>
          <div className="relative inline-block group">
            {/* Animated Streamlines */}
            <div className="absolute inset-0 -inset-y-4 pointer-events-none overflow-hidden flex flex-col justify-between py-2 opacity-70 mix-blend-multiply">
              <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent animate-streamline" style={{ animationDuration: '3.2s' }} />
              <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent animate-streamline" style={{ animationDuration: '2.4s', animationDelay: '-0.8s' }} />
              <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-streamline" style={{ animationDuration: '4.1s', animationDelay: '-1.6s' }} />
              <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent animate-streamline" style={{ animationDuration: '2.8s', animationDelay: '-0.4s' }} />
              <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent animate-streamline" style={{ animationDuration: '3.7s', animationDelay: '-1.2s' }} />
            </div>
            
            <h1 className="relative text-5xl md:text-7xl font-serif font-bold text-brand-900 mb-8 leading-tight tracking-tight z-10">
              Discover stories that <br />
              <span className="italic text-brand-600">stay with you.</span>
            </h1>
          </div>
          
          <div className="relative max-w-2xl mx-auto mt-12 group">
            <div className="absolute inset-0 bg-brand-500/10 blur-2xl rounded-full transition-all group-focus-within:bg-brand-500/20" />
            <div className="relative flex items-center bg-white/80 backdrop-blur-xl border border-brand-200 rounded-2xl shadow-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-brand-400 focus-within:border-transparent">
              <Search className="w-6 h-6 ml-6 text-brand-400" />
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                className="w-full px-6 py-5 bg-transparent text-lg outline-none placeholder:text-brand-300 text-brand-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="mr-3 px-6 py-3 bg-brand-800 text-white rounded-xl font-medium hover:bg-teal-600 transition-all shadow-lg active:scale-95">
                Explore
              </button>
            </div>
          </div>
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-brand-300/20 blur-3xl rounded-full -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-400/10 blur-3xl rounded-full translate-x-1/4" />
      </section>

      {/* Genre Shortcuts */}
      <section className="px-4 mb-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold text-brand-900">Explore Genres</h2>
          <button 
            onClick={() => setSelectedGenre(null)}
            className="text-sm font-medium text-brand-500 hover:text-rose-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-medium transition-all border shadow-sm",
                selectedGenre === genre 
                  ? "bg-brand-800 text-white border-brand-800 scale-105" 
                  : cn("bg-white text-brand-600 border-brand-200", GENRE_STYLES[genre])
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 space-y-24">
        {/* Trending / Results Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              {selectedGenre ? <Sparkles className="w-6 h-6 text-brand-600" /> : <TrendingUp className="w-6 h-6 text-brand-600" />}
              <h2 className="text-3xl font-serif font-bold text-brand-900">
                {selectedGenre ? `${selectedGenre} Collection` : "Trending Now"}
              </h2>
            </div>
            <Link to="/discover" className="flex items-center text-brand-500 font-medium hover:text-blue-600 transition-colors group">
              View All <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[2/3] bg-brand-200 rounded-2xl" />
                  <div className="h-4 bg-brand-200 rounded w-3/4" />
                  <div className="h-4 bg-brand-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} onAddToCart={() => addToCart(book)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Editor's Picks Banner */}
        {!selectedGenre && (
          <section className="relative overflow-hidden rounded-[2.5rem] bg-brand-800 text-white p-12 md:p-20 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="text-brand-300 font-mono text-sm tracking-widest uppercase mb-4 block">Curated Excellence</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">Editor's Choice: <br /> The Classics Reimagined</h2>
              <p className="text-brand-200 text-lg mb-10 leading-relaxed max-w-lg">
                Explore our hand-picked selection of timeless literature that continues to shape our understanding of the human experience.
              </p>
              <button className="px-8 py-4 bg-white text-brand-900 rounded-full font-bold hover:bg-violet-100 transition-all shadow-xl active:scale-95">
                Explore the Collection
              </button>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
              <img 
                src="https://picsum.photos/seed/library/800/800" 
                alt="" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-800" />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function BookCard({ book, index, onAddToCart }: { book: Book; index: number; onAddToCart: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button 
              onClick={(e) => { e.preventDefault(); onAddToCart(); }}
              className="p-3 bg-white text-brand-900 rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white text-brand-900 rounded-full hover:bg-rose-500 hover:text-white transition-colors shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
        {book.newRelease && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
            New
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-serif font-bold text-brand-900 line-clamp-1 group-hover:text-brand-600 transition-colors">{book.title}</h3>
        <p className="text-xs text-brand-500 font-medium">{book.author}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-bold text-brand-800">${book.price}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-brand-600">{book.rating || '4.5'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
