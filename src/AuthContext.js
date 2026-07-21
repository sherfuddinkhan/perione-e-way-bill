import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGstin, setUserGstin] = useState("");

  const login = (gstin) => {
    setIsLoggedIn(true);
    setUserGstin(gstin);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserGstin("");
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userGstin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);