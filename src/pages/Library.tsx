import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Bookmark, CheckCircle, Clock, Search, Filter, ChevronRight, Star } from 'lucide-react';
import { useLibrary } from '../lib/useLibrary';
import { useBooks } from '../lib/useBooks';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';

export default function Library() {
  const { user, signIn } = useAuth();
  const { library, loading: libraryLoading } = useLibrary();
  const { books, loading: booksLoading } = useBooks();
  const [filter, setFilter] = React.useState<'all' | 'wishlist' | 'reading' | 'finished'>('all');

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-brand-200 rounded-full flex items-center justify-center mb-8">
          <Bookmark className="w-12 h-12 text-brand-500" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-brand-900 mb-4">Your Personal Library</h1>
        <p className="text-brand-500 mb-8 max-w-md">Sign in to track your reading progress, save favorites, and access your purchased content.</p>
        <button 
          onClick={signIn}
          className="px-8 py-4 bg-brand-800 text-white rounded-full font-bold hover:bg-indigo-600 transition-all shadow-xl"
        >
          Sign In to Lumina
        </button>
      </div>
    );
  }

  const savedBooks = library.filter(item => filter === 'all' || item.status === filter);
  const libraryBooks = books.filter(book => library.some(item => item.bookId === book.id));

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-serif font-bold text-brand-900 mb-4">My Library</h1>
          <p className="text-brand-500 font-medium italic">Your collection of stories and wisdom.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/50 p-1.5 rounded-2xl border border-brand-200 shadow-sm">
          {(['all', 'wishlist', 'reading', 'finished'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                filter === f 
                  ? 'bg-brand-800 text-white shadow-lg' 
                  : 'text-brand-500 hover:text-orange-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {libraryLoading || booksLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[2/3] bg-brand-200 rounded-2xl" />
              <div className="h-4 bg-brand-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : libraryBooks.length === 0 ? (
        <div className="bg-white/40 border border-brand-200 rounded-[2.5rem] p-20 text-center">
          <BookOpen className="w-16 h-16 text-brand-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-brand-900 mb-4">No books saved yet</h2>
          <p className="text-brand-500 mb-8 max-w-md mx-auto">Start exploring the catalog and add books to your library to track your progress.</p>
          <Link to="/" className="text-brand-800 font-bold hover:underline">Browse the Catalog</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {libraryBooks.map((book) => (
            <LibraryCard key={book.id} book={book} status={library.find(item => item.bookId === book.id)?.status} />
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryCard({ book, status }: { book: any; status?: string }) {
  const statusIcon = {
    wishlist: <Bookmark className="w-4 h-4" />,
    reading: <Clock className="w-4 h-4" />,
    finished: <CheckCircle className="w-4 h-4" />
  }[status || 'wishlist'];

  const statusColor = {
    wishlist: 'bg-blue-100 text-blue-700',
    reading: 'bg-amber-100 text-amber-700',
    finished: 'bg-green-100 text-green-700'
  }[status || 'wishlist'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group"
    >
      <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute top-3 right-3 p-2 rounded-xl shadow-lg backdrop-blur-md ${statusColor}`}>
          {statusIcon}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-serif font-bold text-brand-900 line-clamp-1 group-hover:text-brand-600 transition-colors">{book.title}</h3>
        <p className="text-xs text-brand-500 font-medium">{book.author}</p>
        <div className="flex items-center space-x-1 pt-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${statusColor}`}>
            {status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
