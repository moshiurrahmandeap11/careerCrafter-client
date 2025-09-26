import React, { useEffect, useState } from "react";
import { AuthContext } from "../AuthContexts/AuthContexts";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../../firebase.config";

// google provider
const gooleProvider = new GoogleAuthProvider();
// facebook provider
const facebookProvider = new FacebookAuthProvider();
// github provider
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // google
  const useGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, gooleProvider);
  };

  // facebook
  const useFacebook = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookProvider);
  };

  // github
  const useGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  // email password sign up
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // email password login
  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // log out
  const userLogOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // user monitoring
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userInfo = {
    user,
    loading,
    useGoogle,
    useFacebook,
    useGithub,
    createUser,
    userLogin,
    userLogOut,
  };
  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
