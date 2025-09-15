import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

// auth.ts
export const logoutUser = async (navigation: any) => {
  try {
    await signOut(auth);
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen', params: { loggedOutMessage: 'You have been logged out.' } }],
    });
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout failed. Please try again.');
  }
};
