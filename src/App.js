import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AuthenticationApi from "./Ewaybill/AuthenticationApi";

const Layout = () => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <div style={{ width: "270px", flexShrink: 0 }}>
      <Sidebar />
    </div>
    <div style={{ flex: 1, padding: 20, background: "#F5F5F7" }}>
      <Outlet />
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page = Authentication */}
        <Route path="/" element={<AuthenticationApi />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;