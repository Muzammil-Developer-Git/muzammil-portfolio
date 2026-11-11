import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../lib/firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const same = (a, b) => !!a && !!b && a.toLowerCase() === b.toLowerCase();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const isAdmin = !!user && same(user.email, ADMIN_EMAIL);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!same(cred.user.email, ADMIN_EMAIL)) {
      await signOut(auth);
      throw new Error("not-admin");
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}