import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/HomeScreen');
  }, []);

  return null; // or a loading spinner if you want
}
