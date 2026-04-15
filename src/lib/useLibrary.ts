import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './AuthContext';

export interface SavedBook {
  id: string;
  userId: string;
  bookId: string;
  status: 'wishlist' | 'reading' | 'finished';
  savedAt: any;
}

export function useLibrary() {
  const { user } = useAuth();
  const [library, setLibrary] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLibrary([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/savedBooks`));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedBook));
      setLibrary(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/savedBooks`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { library, loading };
}
