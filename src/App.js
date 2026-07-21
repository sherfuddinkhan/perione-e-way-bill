import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";
import AuthenticationApi from "./Ewaybill/AuthenticationApi";
import Ewaybillclients from "./Ewaybill/Ewaybillclients";

// Fallback component for routes that are still under development
const Placeholder = ({ title }) => (
  <div style={{ padding: "24px", background: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
    <h2 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>{title}</h2>
    <p style={{ margin: 0, color: "#666" }}>Component under construction.</p>
  </div>
);

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
        {/* 1. Public Authentication Route */}
        <Route path="/" element={<AuthenticationApi />} />

        {/* Protected Dashboard Shell & All 27 Sidebar Component Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Redirect */}
          <Route path="/dashboard" element={<Navigate to="/Ewaybillclients" replace />} />

          {/* 2. Primary Client Route */}
          <Route path="/Ewaybillclients" element={<Ewaybillclients />} />

          {/* E-Way Bill Core (6 Routes) */}
          <Route path="/ewaybill/generate-eway-bill" element={<Placeholder title="Generate Eway Bill" />} />
          <Route path="/ewaybill/update-partb" element={<Placeholder title="Update PART-B/Vehicle Number" />} />
          <Route path="/ewaybill/generate-consolidated" element={<Placeholder title="Generate Consolidated Ewaybill" />} />
          <Route path="/ewaybill/cancel-eway-bill" element={<Placeholder title="Cancel E-Way Bill" />} />
          <Route path="/ewaybill/closure-eway-bill" element={<Placeholder title="Closure E-Way Bill" />} />
          <Route path="/ewaybill/reject-ewaybill" element={<Placeholder title="Reject EwayBill" />} />

          {/* E-Way Bill Actions (3 Routes) */}
          <Route path="/ewaybill/update-transporter" element={<Placeholder title="Update Transporter" />} />
          <Route path="/ewaybill/extend-validity" element={<Placeholder title="Extend Validity of E-Way Bill" />} />
          <Route path="/ewaybill/regenerate-consolidated" element={<Placeholder title="Regenerate Consolidated E-Way Bill" />} />

          {/* Fetch E-Way Bills (9 Routes) */}
          <Route path="/ewaybill/get-ewaybill-details" element={<Placeholder title="Get EwayBill Details" />} />
          <Route path="/ewaybill/get-transporter-by-date" element={<Placeholder title="Get EWay bill for transporter by Date" />} />
          <Route path="/ewaybill/get-transporter-by-gstin" element={<Placeholder title="Get EwayBills For Transporter By Gstin" />} />
          <Route path="/ewaybill/get-report-assigned-date" element={<Placeholder title="Get EwayBill Report By Transporter assigned Date" />} />
          <Route path="/ewaybill/get-by-date" element={<Placeholder title="Get Eway Bills By Date" />} />
          <Route path="/ewaybill/get-rejected" element={<Placeholder title="Get Eway Bills Rejected By Others" />} />
          <Route path="/ewaybill/get-by-parties" element={<Placeholder title="Get Eway bills by parties" />} />
          <Route path="/ewaybill/get-consolidated" element={<Placeholder title="Get consolidated e-way bill" />} />
          <Route path="/ewaybill/get-by-consigner" element={<Placeholder title="Get EwayBill by Consigner" />} />

          {/* Masters (4 Routes) */}
          <Route path="/ewaybill/get-error-list" element={<Placeholder title="Get Error List" />} />
          <Route path="/ewaybill/get-gstin-details" element={<Placeholder title="Get GSTIN details" />} />
          <Route path="/ewaybill/get-transin-details" element={<Placeholder title="GET Transin details" />} />
          <Route path="/ewaybill/get-hsn-details" element={<Placeholder title="GET HSN details" />} />

          {/* Multi Vehicle (3 Routes) */}
          <Route path="/ewaybill/initiate-multi-vehicle" element={<Placeholder title="Initiate Multi Vehicle Movement" />} />
          <Route path="/ewaybill/add-multi-vehicles" element={<Placeholder title="Add Multi Vehicles" />} />
          <Route path="/ewaybill/change-multi-vehicles" element={<Placeholder title="Change Multi Vehicles" />} />
        </Route>

        {/* Fallback Catch-all Route for Undefined Paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;