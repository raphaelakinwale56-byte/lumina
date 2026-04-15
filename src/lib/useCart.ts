import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (book: CartItem) => {
    setCart(prev => {
      if (prev.find(item => item.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.id !== bookId));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return { cart, addToCart, removeFromCart, clearCart, total };
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const placeOrder = async (bookIds: string[], total: number) => {
    if (!user) throw new Error('User must be logged in');
    
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        bookIds,
        total,
        status: 'completed',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  return { orders, loading, placeOrder };
}
