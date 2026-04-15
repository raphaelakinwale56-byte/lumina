import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  price: number;
  coverImage: string;
  rating?: number;
  trending?: boolean;
  newRelease?: boolean;
  editorsPick?: boolean;
}

export function useBooks(filters?: { genre?: string; trending?: boolean; newRelease?: boolean; editorsPick?: boolean }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'books'));

    if (filters?.genre) {
      q = query(q, where('genre', '==', filters.genre));
    }
    if (filters?.trending) {
      q = query(q, where('trending', '==', true));
    }
    if (filters?.newRelease) {
      q = query(q, where('newRelease', '==', true));
    }
    if (filters?.editorsPick) {
      q = query(q, where('editorsPick', '==', true));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
      setBooks(booksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'books');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [JSON.stringify(filters)]);

  return { books, loading };
}
