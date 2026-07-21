import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";

// Import your components
import AuthenticationApi from "./Ewaybill/AuthenticationApi";
import Ewaybillclients from "./Ewaybill/Ewaybillclients";
import GenerateEwayBill from "./Ewaybill/GenerateEwayBill";
import UpdatePartBVehicleNumber from "./Ewaybill/UpdatePartBVehicleNumber";
import GenerateConsolidatedEwayBill from "./Ewaybill/GenerateConsolidatedEwayBill";
import CancelEwayBill from "./Ewaybill/CancelEwayBill";
import ClosureEwayBill from "./Ewaybill/ClosureEwayBill";
import RejectEwayBill from "./Ewaybill/RejectEwayBill";
import UpdateTransporter from "./Ewaybill/UpdateTransporter";
import ExtendValidityEwayBill from "./Ewaybill/ExtendValidityEwayBill";
import RegenerateConsolidatedEwayBill from "./Ewaybill/GenenerateConsolidatedEwayBill";
import GetEwayBillDetails from "./Ewaybill/GetEwayBillDetails";
import GetEwayBillTransporterByDate from "./Ewaybill/GetEwayBillTransporterByDate";
import GetEwayBillsTransporterByGstin from "./Ewaybill/GetEwayBillsTransporterByGstin";
import GetEwayBillReportByAssignedDate from "./Ewaybill/GetEwayBillReportByAssignedDate";
import GetEwayBillsByDate from "./Ewaybill/GetEwayBillsByDate";
import GetRejectedEwayBills from "./Ewaybill/GetRejectedEwayBills";
import GetEwayBillsByParties from "./Ewaybill/GetEwayBillsByParties";
import GetConsolidatedEwayBill from "./Ewaybill/GetConsolidatedEwayBill";
import GetEwayBillByConsigner from "./Ewaybill/GetEwayBillByConsigner";
import GetErrorList from "./Ewaybill/GetErrorList";
import GetGstinDetails from "./Ewaybill/GetGstinDetails";
import GetTransinDetails from "./Ewaybill/GetTransinDetails";
import GetHsnDetails from "./Ewaybill/GetHsnDetails";
import InitiateMultiVehicleMovement from "./Ewaybill/InitiateMultiVehicleMovement";
import AddMultiVehicles from "./Ewaybill/AddMultiVehicles";
import ChangeMultiVehicles from "./Ewaybill/ChangeMultiVehicles";

// Layout Shell containing Sidebar and nested Outlet
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

// Auth Guard Wrapper
const RequireAuth = ({ children }) => {
const { isLoggedIn } = useAuth();
return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
return ( <Router> <Routes>
{/* Authentication Route */}
<Route path="/" element={<AuthenticationApi />} />

```
    {/* Dashboard Redirect */}
    <Route path="/dashboard" element={<Navigate to="/Ewaybillclients" replace />} />

    {/* Main E-Way Bill Client Route */}
    <Route
      path="/Ewaybillclients"
      element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }
    >
      <Route index element={<Ewaybillclients />} />
    </Route>

    {/* E-Way Bill Routes */}
    <Route
      path="/ewaybill"
      element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }
    >
      <Route index element={<Navigate to="/Ewaybillclients" replace />} />

      <Route path="generate-eway-bill" element={<GenerateEwayBill />} />
      <Route path="update-partb" element={<UpdatePartBVehicleNumber />} />
      <Route path="generate-consolidated" element={<GenerateConsolidatedEwayBill/>} />
      <Route path="cancel-eway-bill" element={<CancelEwayBill />} />
      <Route path="closure-eway-bill" element={<ClosureEwayBill />} />
      <Route path="reject-ewaybill" element={<RejectEwayBill />} />

      <Route path="update-transporter" element={<UpdateTransporter />} />
      <Route path="extend-validity" element={<ExtendValidityEwayBill />} />
      <Route path="regenerate-consolidated" element={<RegenerateConsolidatedEwayBill />} />

      <Route path="get-ewaybill-details" element={<GetEwayBillDetails />} />
      <Route path="get-transporter-by-date" element={<GetEwayBillTransporterByDate />} />
      <Route path="get-transporter-by-gstin" element={<GetEwayBillsTransporterByGstin />} />
      <Route path="get-report-assigned-date" element={<GetEwayBillReportByAssignedDate />} />
      <Route path="get-by-date" element={<GetEwayBillsByDate />} />
      <Route path="get-rejected" element={<GetRejectedEwayBills />} />
      <Route path="get-by-parties" element={<GetEwayBillsByParties />} />
      <Route path="get-consolidated" element={<GetConsolidatedEwayBill />} />
      <Route path="get-by-consigner" element={<GetEwayBillByConsigner />} />

      <Route path="get-error-list" element={<GetErrorList />} />
      <Route path="get-gstin-details" element={<GetGstinDetails />} />
      <Route path="get-transin-details" element={<GetTransinDetails />} />
      <Route path="get-hsn-details" element={<GetHsnDetails />} />

      <Route path="initiate-multi-vehicle" element={<InitiateMultiVehicleMovement />} />
      <Route path="add-multi-vehicles" element={<AddMultiVehicles />} />
      <Route path="change-multi-vehicles" element={<ChangeMultiVehicles />} />
    </Route>
  </Routes>
</Router>
);
}

export default App;
