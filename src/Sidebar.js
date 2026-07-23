const menuSections = [
  {
    title: "EwayBillClients",
    path: "/Ewaybillclients",
  },

  // Generate & Manage E-Way Bills
  {
    title: "Generate & Manage E-Way Bills",
    items: [
      { path: "/ewaybill/generate-eway-bill", label: "Generate E-Way Bill" },
      { path: "/ewaybill/cancel-eway-bill", label: "Cancel E-Way Bill" },
      { path: "/ewaybill/close-eway-bill", label: "Close E-Way Bill" },
      { path: "/ewaybill/reject-ewaybill", label: "Reject E-Way Bill" },
      { path: "/ewaybill/extend-validity", label: "Extend Validity" },
    ],
  },

  // Transporter & Vehicle Operations
  {
    title: "Transporter & Vehicle Operations",
    items: [
      { path: "/ewaybill/update-partb", label: "Update PART-B / Vehicle Number" },
      { path: "/ewaybill/update-transporter", label: "Update Transporter" },
      { path: "/ewaybill/get-transporter-details", label: "Get Transporter Details" },
    ],
  },

  // Consolidated EWB & Trip Sheets
  {
    title: "Consolidated EWB & Trip Sheets",
    items: [
      { path: "/ewaybill/generate-consolidated", label: "Generate Consolidated E-Way Bill" },
      { path: "/ewaybill/get-consolidated", label: "Get Consolidated E-Way Bill" },
      { path: "/ewaybill/regenerate-consolidated", label: "Regenerate Consolidated E-Way Bill" },
    ],
  },

  // Fetching & Reports
  {
    title: "Fetching & Reports",
    items: [
      { path: "/ewaybill/get-ewaybill-details", label: "Get E-Way Bill Details" },
      { path: "/ewaybill/get-transporter-by-date", label: "Get E-Way Bills for Transporter by Date" },
      { path: "/ewaybill/get-transporter-by-gstin", label: "Get E-Way Bills for Transporter by GSTIN" },
      { path: "/ewaybill/get-report-assigned-date", label: "Get E-Way Bill Report by Assigned Date" },
      { path: "/ewaybill/get-by-date", label: "Get E-Way Bills by Date" },
      { path: "/ewaybill/get-rejected", label: "Get Rejected E-Way Bills" },
      { path: "/ewaybill/get-by-parties", label: "Get E-Way Bills by Parties" },
      { path: "/ewaybill/get-by-consigner", label: "Get E-Way Bill by Consigner" },
    ],
  },

  // Masters
  {
    title: "Masters",
    items: [
      { path: "/ewaybill/get-error-list", label: "Get Error List" },
      { path: "/ewaybill/get-gstin-details", label: "Get GSTIN Details" },
      { path: "/ewaybill/get-transporter-details", label: "Get Transporter Details" },
      { path: "/ewaybill/get-hsn-details", label: "Get HSN Details" },
    ],
  },

  // Multi-Vehicle Operations
  {
    title: "Multi-Vehicle Operations",
    items: [
      { path: "/ewaybill/initiate-multi-vehicle", label: "Initiate Multi Vehicle Movement" },
      { path: "/ewaybill/add-multi-vehicles", label: "Add Multi Vehicles" },
      { path: "/ewaybill/change-multi-vehicles", label: "Change Multi Vehicles" },
    ],
  },

  // Logout
  {
    title: "Logout",
    icon: <LogoutOutlined />,
    onClick: handleLogout,
  },
];