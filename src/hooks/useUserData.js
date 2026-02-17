import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';

export function useUserData(userId) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        // Initialize user data
        const initialData = {
          bookmarks: [],
          loops: {},
          playlists: [],
          progress: {},
          notes: {},
          settings: {
            defaultSpeed: 1
          },
          createdAt: new Date().toISOString()
        };
        setDoc(userDocRef, initialData);
        setUserData(initialData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const updateUserData = async (updates) => {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updates);
  };

  return { userData, loading, updateUserData };
}
