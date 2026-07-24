import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authData, setAuthData] = useState({
    email: "",
    username: "",
    client_id: "",
    client_secret: "",
    gstin: "",
    env: "sandbox",
    ip_address: "",
  });

  const login = (data) => {
    setIsLoggedIn(true);
    setAuthData(data);

    // Persist across refreshes
    localStorage.setItem("eway_auth", JSON.stringify(data));
  };

  const logout = () => {
    setIsLoggedIn(false);

    setAuthData({
      email: "",
      username: "",
      client_id: "",
      client_secret: "",
      gstin: "",
      env: "sandbox",
      ip_address: "",
    });

    localStorage.removeItem("eway_auth");
    localStorage.removeItem("trip_sheet_data");
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        authData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);