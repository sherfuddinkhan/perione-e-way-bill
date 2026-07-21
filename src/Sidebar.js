import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LogoutOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";

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
    path &&
    (location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path + "/")));

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you willing to logout?");
    if (!confirmLogout) return;

    if (logout) logout(); // Calls logout from AuthContext
    navigate("/", { replace: true }); // Redirect to home page
  };

  const menuSections = [
    {
      title: "EwayBillClients",
      path: "/Ewaybillclients",
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

  // Auto expand sections if child route is active
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
    <div style={styles.sidebarContainer}>
      <div style={styles.brandHeader}>
        <h3 style={styles.userTitle}>{displayUser}</h3>
      </div>

      <div style={styles.menuContainer}>
        {menuSections.map((section) => {
          const isSectionActive = section.path ? isActive(section.path) : false;

          return (
            <div key={section.title} style={{ marginBottom: 4 }}>
              {/* Section Header or Single Link */}
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
                  ...styles.sectionHeader,
                  background: isSectionActive ? "#ffffff" : "transparent",
                  color: isSectionActive ? "#1A73E8" : "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {section.icon && <span>{section.icon}</span>}
                  <span>{section.title}</span>
                </div>

                {/* Arrow for Accordion Sections */}
                {section.items && (
                  <span style={{ fontSize: 12 }}>
                    {openSections[section.title] ? <DownOutlined /> : <RightOutlined />}
                  </span>
                )}
              </div>

              {/* Collapsible Sub-items */}
              {openSections[section.title] &&
                section.items?.map((item) => {
                  const isItemActive = isActive(item.path);

                  return (
                    <div
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      style={{
                        ...styles.subMenuItem,
                        background: isItemActive ? "#ffffff" : "rgba(255, 255, 255, 0.1)",
                        color: isItemActive ? "#1A73E8" : "#ffffff",
                        fontWeight: isItemActive ? "bold" : "normal",
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  sidebarContainer: {
    width: 270,
    background: "#1A73E8",
    color: "#fff",
    height: "100vh",
    padding: "20px 15px",
    boxSizing: "border-box",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  brandHeader: {
    paddingBottom: 15,
    marginBottom: 15,
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
  },
  userTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
    wordBreak: "break-all",
  },
  menuContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  sectionHeader: {
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "8px",
    transition: "background 0.2s ease",
  },
  subMenuItem: {
    padding: "8px 16px",
    marginLeft: "12px",
    marginTop: 4,
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default Sidebar;