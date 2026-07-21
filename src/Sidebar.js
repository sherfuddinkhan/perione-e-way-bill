import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LogoutOutlined, DashboardOutlined } from "@ant-design/icons";

const Sidebar = () => {
const location = useLocation();
const navigate = useNavigate();
const { logout, userGstin } = useAuth();

const [openSections, setOpenSections] = useState({});

const displayUser = userGstin || "Perione E-Way Bill";

const toggle = (title) => {
setOpenSections((prev) => ({
...prev,
[title]: !prev[title],
}));
};

const isActive = (path) =>
location.pathname === path ||
(path !== "/" && location.pathname.startsWith(path + "/"));

const handleLogout = () => {
  const confirmLogout = window.confirm("Are you willing to logout?");
  if (!confirmLogout) return;

  logout(); // Calls logout from AuthContext
  navigate("/", { replace: true }); // Redirect to home page
}

const menuSections = [
{
title: "Dashboard",
path: "/dashboard",
icon: <DashboardOutlined />,
},
{
title: "Authentication",
items: [
{ path: "/ewaybill/authentication-api", label: "Authentication API" },
],
},
{
title: "E-Way Bill Core",
items: [
{ path: "/ewaybill/generate-eway-bill", label: "Generate Eway Bill" },
{ path: "/ewaybill/update-partb", label: "Update PART-B/Vehicle Number" },
{ path: "/ewaybill/generate-consolidated", label: "Generate Consolidated Ewaybill" },
{ path: "/ewaybill/cancel-eway-bill", label: "Cancel E-Way Bill" },
{ path: "/ewaybill/closure-eway-bill", label: "Closure E-Way Bill" },
{ path: "/ewaybill/reject-ewaybill", label: "Reject EwayBill" },
],
},
{
title: "E-Way Bill Actions",
items: [
{ path: "/ewaybill/update-transporter", label: "Update Transporter" },
{ path: "/ewaybill/extend-validity", label: "Extend Validity of E-Way Bill" },
{ path: "/ewaybill/regenerate-consolidated", label: "Regenerate Consolidated E-Way Bill" },
],
},
{
title: "Fetch E-Way Bills",
items: [
{ path: "/ewaybill/get-ewaybill-details", label: "Get EwayBill Details" },
{ path: "/ewaybill/get-transporter-by-date", label: "Get EWay bill for transporter by Date" },
{ path: "/ewaybill/get-transporter-by-gstin", label: "Get EwayBills For Transporter By Gstin" },
{ path: "/ewaybill/get-report-assigned-date", label: "Get EwayBill Report By Transporter assigned Date" },
{ path: "/ewaybill/get-by-date", label: "Get Eway Bills By Date" },
{ path: "/ewaybill/get-rejected", label: "Get Eway Bills Rejected By Others" },
{ path: "/ewaybill/get-by-parties", label: "Get Eway bills by parties" },
{ path: "/ewaybill/get-consolidated", label: "Get consolidated e-way bill" },
{ path: "/ewaybill/get-by-consigner", label: "Get EwayBill by Consigner" },
],
},
{
title: "Masters",
items: [
{ path: "/ewaybill/get-error-list", label: "Get Error List" },
{ path: "/ewaybill/get-gstin-details", label: "Get GSTIN details" },
{ path: "/ewaybill/get-transin-details", label: "GET Transin details" },
{ path: "/ewaybill/get-hsn-details", label: "GET HSN details" },
],
},
{
title: "Multi Vehicle",
items: [
{ path: "/ewaybill/initiate-multi-vehicle", label: "Initiate Multi Vehicle Movement" },
{ path: "/ewaybill/add-multi-vehicles", label: "Add Multi Vehicles" },
{ path: "/ewaybill/change-multi-vehicles", label: "Change Multi Vehicles" },
],
},
{
title: "Logout",
icon: <LogoutOutlined />,
onClick: handleLogout,
},
];

useEffect(() => {
setOpenSections((prev) => {
const updated = { ...prev };
  menuSections.forEach((section) => {
    if (section.items?.some((i) => isActive(i.path))) {
      updated[section.title] = true;
    }
  });

  return updated;
});
}, [location.pathname]);

return (
<div
style={{
width: 270,
background: "#1A73E8",
color: "#fff",
height: "100vh",
padding: 20,
overflowY: "auto",
}}
>
<h3 style={{ textAlign: "center", marginBottom: 20 }}>
{displayUser} </h3>
  {menuSections.map((section) => (
    <div key={section.title}>
      <div
        onClick={() => {
          if (section.onClick) {
            section.onClick();
          } else if (section.path) {
            navigate(section.path);
          } else if (section.items) {
            toggle(section.title);
          }
        }}
        style={{
          padding: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {section.icon}
        {section.title}
      </div>

      {openSections[section.title] &&
        section.items?.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: "8px 18px",
              marginTop: 4,
              borderRadius: 6,
              fontSize: 14,
              cursor: "pointer",
              background: isActive(item.path) ? "#fff" : "transparent",
              color: isActive(item.path) ? "#1A73E8" : "#fff",
            }}
          >
            {item.label}
          </div>
        ))}
    </div>
  ))}
</div>
);
};

export default Sidebar;
