import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔐 AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("🔥 AUTH STATE CHANGED:", currentUser);

      setUser(currentUser);

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            console.log("🆕 Creating new user in Firestore");

            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'user',
              createdAt: serverTimestamp()
            });

            setIsAdmin(false);
          } else {
            console.log("✅ Existing user found");

            setIsAdmin(userDoc.data()?.role === 'admin');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        console.log("🚫 No user signed in");
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🚀 SIGN IN (DEBUG ENABLED)
  const signIn = async () => {
    console.log("👉 SIGN IN BUTTON CLICKED");

    try {
      const result = await signInWithPopup(auth, googleProvider);

      console.log("✅ SIGN IN SUCCESS:", result.user);
    } catch (error) {
      console.error("❌ SIGN IN ERROR:", error);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    console.log("👉 LOGOUT CLICKED");

    try {
      await signOut(auth);
      console.log("✅ LOGGED OUT");
    } catch (error) {
      console.error("❌ LOGOUT ERROR:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🧠 HOOK
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}