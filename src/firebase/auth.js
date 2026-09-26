import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./config";

export const loginAdmin = async (email, password) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

export const logoutAdmin = async () => {
  await signOut(auth);
};

export const listenAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const isAdminEmail = (email) => {
  return (
    email?.toLowerCase() ===
    import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase()
  );
};