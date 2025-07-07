// src/utils/auth.ts
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

export const logoutUser = async (navigation: any) => {
  try {
    await signOut(auth);
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }], 
    });
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout failed. Please try again.');
  }
};
