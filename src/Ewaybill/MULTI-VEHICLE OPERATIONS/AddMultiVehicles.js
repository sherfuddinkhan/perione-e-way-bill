import React, { useState,useEffect } from 'react';
import { useAuth } from "../../AuthContext";
const AddMultiVehicles= () => {
  const {
    isLoggedIn,
    authData,
    logout,
    connectionType,
    setConnectionType,
  } = useAuth();
  const [formData, setFormData] = useState({
    ewbNo: "",
    vehicleNo: "",
    groupNo: "",
    transDocNo: "",
    transDocDate: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
 useEffect(() => {

  const ewayBill =
    JSON.parse(localStorage.getItem("ewaybill_response") || "{}");

  const tripSheet =
    JSON.parse(localStorage.getItem("trip_sheet_data") || "{}");

  setFormData({

    ewbNo:
      ewayBill.eWayBillNumber ||
      ewayBill.ewbNo ||
      "",

    vehicleNo:
      ewayBill.vehicleNo ||
      "",

    groupNo: "",

    transDocNo:
      tripSheet.transDocNo ||
      "",

    transDocDate:
      tripSheet.transDocDate ||
      "",

    quantity: 1,

  });

}, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setResponse(null);
  setErrorMsg("");

  try {

    let ipAddress = authData?.ip_address;

    if (!ipAddress) {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      ipAddress = ipData.ip;
    }

    const payload = {
      ewbNo: Number(formData.ewbNo),
      vehicleNo: formData.vehicleNo,
      groupNo: formData.groupNo,
      transDocNo: formData.transDocNo,
      transDocDate: formData.transDocDate,
      quantity: Number(formData.quantity),
    };

    console.log("Payload", payload);

    const res = await fetch(
      `https://einvoice.fcssoftwares.com/api/perione/add-multi?email=${encodeURIComponent(authData.email)}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          gstin: authData.gstin,
          client_id: authData.client_id,
          client_secret: authData.client_secret,
          ip_address: ipAddress,
          env: authData.env,
          ConnectionType: connectionType,
        },

        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setResponse(data);
    } else {
      setErrorMsg(
        data.message ||
        data.status_desc ||
        "Failed to add vehicle."
      );
    }

  } catch (err) {

    setErrorMsg(err.message);

  } finally {

    setLoading(false);

  }
};

 return (
  <div style={styles.outerContainer}>
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.badge}>MULTI VEHICLE</span>
        <h1 style={styles.title}>Add Multi Vehicle</h1>
        <p style={styles.subtitle}>
          Add Vehicle to Existing Multi Vehicle Group
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* API Connection Details */}

        <div style={styles.authBox}>

          <h4 style={{ marginTop: 0 }}>
            API Connection Details
          </h4>

          {/* Query Parameter */}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Email (Query)
            </label>

            <input
              type="email"
              value={authData?.email || ""}
              readOnly
              style={styles.input}
            />
          </div>

          {/* Headers */}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>GSTIN</label>

            <input
              type="text"
              value={authData?.gstin || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Client ID</label>

            <input
              type="text"
              value={authData?.client_id || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Client Secret
            </label>

            <input
              type="password"
              value={authData?.client_secret || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              IP Address
            </label>

            <input
              type="text"
              value={authData?.ip_address || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Environment
            </label>

            <input
              type="text"
              value={authData?.env || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Connection Type
            </label>

            <input
              type="text"
              value={connectionType || ""}
              readOnly
              style={styles.input}
            />
          </div>

        </div>

        {/* Request Body */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            E-Way Bill Number
          </label>

          <input
            type="number"
            name="ewbNo"
            value={formData.ewbNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Vehicle Number
          </label>

          <input
            type="text"
            name="vehicleNo"
            value={formData.vehicleNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Group Number
          </label>

          <input
            type="text"
            name="groupNo"
            value={formData.groupNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Transport Document Number
          </label>

          <input
            type="text"
            name="transDocNo"
            value={formData.transDocNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Transport Document Date
          </label>

          <input
            type="text"
            name="transDocDate"
            value={formData.transDocDate}
            onChange={handleChange}
            placeholder="DD/MM/YYYY"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Quantity
          </label>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Adding Vehicle..." : "Add Vehicle"}
        </button>

      </form>

      {errorMsg && (
        <div style={styles.errorCard}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {response && (
        <div style={styles.successCard}>

          <div style={styles.responseHeader}>
            <span style={styles.statusBadge}>
              SUCCESS
            </span>

            <span style={styles.responseDesc}>
              Vehicle Added Successfully
            </span>
          </div>

          <pre style={styles.jsonViewer}>
            {JSON.stringify(response, null, 2)}
          </pre>

        </div>
      )}

    </div>
  </div>
);
};
const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    border: "1px solid #e2e8f0",
    width: "100%",
    maxWidth: "700px",
    padding: "32px",
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
  },

  badge: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  title: {
    margin: "14px 0 8px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  authBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "8px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "14px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },

  select: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },

  button: {
    width: "100%",
    marginTop: "10px",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  errorCard: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "14px",
  },

  successCard: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "10px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
  },

  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },

  statusBadge: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: "4px 10px",
    borderRadius: "5px",
    fontSize: "11px",
    fontWeight: "700",
  },

  responseDesc: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },

  jsonViewer: {
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    padding: "14px",
    borderRadius: "8px",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "500px",
    fontSize: "12px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};


export default AddMultiVehicles;