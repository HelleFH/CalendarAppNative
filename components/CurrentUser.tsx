// hooks/useCurrentUser.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user ? user.uid : null);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return { currentUserId, isLoading };
};
