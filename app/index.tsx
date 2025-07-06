import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Use a short timeout to ensure the router is ready
    const timeout = setTimeout(() => {
      router.replace('/Welcome');
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
