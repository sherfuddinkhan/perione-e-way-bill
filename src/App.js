import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Sidebar from "./Sidebar";

// AUTHENTICATION
import AuthenticationApi from "./Ewaybill/AUTHENTICATION/AuthenticationApi";

// CONSOLIDATED EWB & TRIP SHEETS
import GenerateConsolidatedEwayBill from "./Ewaybill/CONSOLIDATED EWB & TRIP SHEETS/GenerateConsolidatedEwayBill";
import GetConsolidatedEwayBill from "./Ewaybill/CONSOLIDATED EWB & TRIP SHEETS/GetConsolidatedEwayBill";
import RegenerateConsolidatedEwaybill from "./Ewaybill/CONSOLIDATED EWB & TRIP SHEETS/RegenerateConsolidatedEwaybill";

// FETCHING & REPORTS
import GetEwayBillTransporterByDate from "./Ewaybill/FETCHING & REPORTS/GetEwayBillTransporterByDate";
import GetEwayBillsTransporterByGstin from "./Ewaybill/FETCHING & REPORTS/GetEwayBillsTransporterByGstin";
import GetEwayBillReportByAssignedDate from "./Ewaybill/FETCHING & REPORTS/GetEwayBillReportByAssignedDate";
import GetEwayBillsByDate from "./Ewaybill/FETCHING & REPORTS/GetEwayBillsByDate";
import GetGstinDetails from "./Ewaybill/FETCHING & REPORTS/GetGstinDetails";
import RejectedByOthersEwayBills from "./Ewaybill/FETCHING & REPORTS/RejectedByOthersEwayBills";
import GetEwayBillsByParties from "./Ewaybill/FETCHING & REPORTS/GetEwayBillsByParties";
import GetEwayBillByConsigner from "./Ewaybill/FETCHING & REPORTS/GetEwayBillByConsigner";
import GetErrorList from "./Ewaybill/FETCHING & REPORTS/GetErrorList";
import GetGstinDetails from "./Ewaybill/FETCHING & REPORTS/GetGstinDetails";
import GetHsnDetails from "./Ewaybill/FETCHING & REPORTS/GetHsnDetails";

// GENERATE & MANAGE E-WAY BILLS
import GenerateEwayBill from "./Ewaybill/GENERATE & MANAGE E-WAY BILLS/GenerateEwayBill";
import CancelEwayBill from "./Ewaybill/GENERATE & MANAGE E-WAY BILLS/CancelEwayBill";
import CloseEwayBill from "./Ewaybill/GENERATE & MANAGE E-WAY BILLS/CloseEwayBill";
import ExtendValidityEwayBill from "./Ewaybill/GENERATE & MANAGE E-WAY BILLS/ExtendValidityEwayBill";
import RejectEwayBill from "./Ewaybill/GENERATE & MANAGE E-WAY BILLS/RejectEwayBill";

// MULTI-VEHICLE OPERATIONS
import InitiateMultiVehicleMovement from "./Ewaybill/MULTI-VEHICLE OPERATIONS/InitiateMultiVehicleMovement";
import AddMultiVehicles from "./Ewaybill/MULTI-VEHICLE OPERATIONS/AddMultiVehicles";
import ChangeMultiVehicles from "./Ewaybill/MULTI-VEHICLE OPERATIONS/ChangeMultiVehicles";

// TRANSPORTER & VEHICLE OPERATIONS
import GetTransporterDetails from "./Ewaybill/TRANSPORTER & VEHICLE OPERATIONS/GetTransporterDetails";
import UpdatePartBVehicleNumber from "./Ewaybill/TRANSPORTER & VEHICLE OPERATIONS/UpdatePartBVehicleNumber";
import UpdateTransporter from "./Ewaybill/TRANSPORTER & VEHICLE OPERATIONS/UpdateTransporter";

// MAIN COMPONENT
import Ewaybillclients from "./Ewaybill/Ewaybillclients";
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
  return (
    <Routes>
      {/* Authentication Route */}
      <Route path="/" element={<AuthenticationApi />} />

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

        {/* Generate & Manage E-Way Bills */}
        <Route path="generate-eway-bill" element={<GenerateEwayBill />} />
        <Route path="cancel-eway-bill" element={<CancelEwayBill />} />
        <Route path="close-eway-bill" element={<CloseEwayBill />} />
        <Route path="reject-ewaybill" element={<RejectEwayBill />} />
        <Route path="extend-validity" element={<ExtendValidityEwayBill />} />

        {/* Transporter & Vehicle Operations */}
        <Route path="update-partb" element={<UpdatePartBVehicleNumber />} />
        <Route path="update-transporter" element={<UpdateTransporter />} />
        <Route path="get-transporter-details" element={<GetTransporterDetails />} />

        {/* Consolidated EWB & Trip Sheets */}
        <Route path="generate-consolidated" element={<GenerateConsolidatedEwayBill />} />
        <Route path="get-consolidated" element={<GetConsolidatedEwayBill />} />
        <Route path="regenerate-consolidated" element={<RegenerateConsolidatedEwaybill />} />

        {/* Fetching & Reports */}
        <Route path="get-ewaybill-details" element={<GetEwayBillDetails />} />
        <Route path="get-transporter-by-date" element={<GetEwayBillTransporterByDate />} />
        <Route path="get-transporter-by-gstin" element={<GetEwayBillsTransporterByGstin />} />
        <Route path="get-report-assigned-date" element={<GetEwayBillReportByAssignedDate />} />
        <Route path="get-by-date" element={<GetEwayBillsByDate />} />
        <Route path="get-by-parties" element={<GetEwayBillsByParties />} />
        <Route path="get-by-consigner" element={<GetEwayBillByConsigner />} />
        <Route path="get-error-list" element={<GetErrorList />} />
        <Route path="get-hsn-details" element={<GetHsnDetails />} />
        <Route path="/get-gstin-details" element={<GetGstinDetails />} />
        <Route path="/rejected-eway-bills" element={<RejectedByOthersEwayBills />} />

        {/* Multi-Vehicle Operations */}
        <Route path="initiate-multi-vehicle" element={<InitiateMultiVehicleMovement />} />
        <Route path="add-multi-vehicles" element={<AddMultiVehicles />} />
        <Route path="change-multi-vehicles" element={<ChangeMultiVehicles />} />
      </Route>
    </Routes>
  );
}

export default App;
