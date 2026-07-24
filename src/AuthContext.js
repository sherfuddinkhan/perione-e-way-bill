import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

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

  // Connection Type
  const [connectionType, setConnectionType] = useState(
    localStorage.getItem("ConnectionType") || "DEFAULT"
  );

  // Load auth on refresh
  useEffect(() => {
    const savedAuth = localStorage.getItem("eway_auth");

    if (savedAuth) {
      setAuthData(JSON.parse(savedAuth));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (data) => {
    setIsLoggedIn(true);
    setAuthData(data);

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

     // Remove E-Way Bill related data
  localStorage.removeItem("trip_sheet_data");
  localStorage.removeItem("ewaybill_response");
  localStorage.removeItem("eway_auth");
  localStorage.removeItem("transporter_by_date");
  localStorage.removeItem("ewayBillData");
  
  // Remove login/config data
  localStorage.removeItem("userLoginRef");
  localStorage.removeItem("connectionType");
  localStorage.removeItem("yearName");
    // If you DON'T want to remember ConnectionType
    localStorage.removeItem("ConnectionType");

    localStorage.clear();
    sessionStorage.clear();

    setConnectionType("DEFAULT");
  };

  const changeConnectionType = (value) => {
    setConnectionType(value);
    localStorage.setItem("ConnectionType", value);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        authData,
        login,
        logout,
        connectionType,
        setConnectionType: changeConnectionType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);