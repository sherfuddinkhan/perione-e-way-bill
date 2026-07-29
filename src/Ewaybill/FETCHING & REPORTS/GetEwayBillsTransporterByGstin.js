import React, { useState,useEffect } from 'react';
import { useAuth } from "../../AuthContext";
const GetEwayBillsTransporterByGstin= () => {
   const {
    isLoggedIn,
    authData,
    logout,
    connectionType,
    setConnectionType,
  } = useAuth();
  const [formData, setFormData] = useState({
    Gen_gstin: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
  const auth = JSON.parse(localStorage.getItem("eway_auth"));

  const today = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

  setFormData((prev) => ({
    ...prev,
    Gen_gstin: auth?.gstin || prev.Gen_gstin,
    date: today,
  }));
}, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setResponse(null);
  setErrorMsg("");

  try {
    const authString = localStorage.getItem("eway_auth");
    const auth = authString ? JSON.parse(authString) : null;

    const email = auth?.email || "";

    let ipAddress = auth?.ip_address || "";

    if (!ipAddress) {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      ipAddress = ipData.ip;
    }

    const params = new URLSearchParams({
      email: email,
      date: formData.date,
      Gen_gstin: formData.Gen_gstin,
    });

    const res = await fetch(
      `https://einvoice.fcssoftwares.com/api/perione/ewaybill/transporter-by-gstin?${params.toString()}`,
      {
        method: "GET",
        headers: {
          gstin: auth?.gstin || "",
          client_id: auth?.client_id || "",
          client_secret: auth?.client_secret || "",
          ip_address: ipAddress,
          env: auth?.env || "sandbox",
          ConnectionType: connectionType,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      setResponse(data);
    } else {
      setErrorMsg(
        data.message ||
        data.status_desc ||
        "Failed to fetch E-Way Bills."
      );
    }
  } catch (err) {
    console.error(err);
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
        <span style={styles.badge}>REPORT</span>

        <h1 style={styles.title}>
          Get E-Way Bills for Transporter by GSTIN
        </h1>

        <p style={styles.subtitle}>
          Fetch transporter E-Way Bills using Generator GSTIN and Date
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>

        {/* API Connection Details */}

        <div style={styles.authBox}>
          <h4>API Connection Details</h4>

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
            <label style={styles.label}>Client Secret</label>
            <input
              type="password"
              value={authData?.client_secret || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>IP Address</label>
            <input
              type="text"
              value={authData?.ip_address || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Environment</label>
            <input
              type="text"
              value={authData?.env || ""}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Connection Type</label>
            <input
              type="text"
              value={connectionType || ""}
              readOnly
              style={styles.input}
            />
          </div>
        </div>

        {/* Email */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>

          <input
            type="email"
            value={authData?.email || ""}
            readOnly
            style={styles.input}
          />
        </div>

        {/* Generator GSTIN */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Generator GSTIN
          </label>

          <input
            type="text"
            name="Gen_gstin"
            value={formData.Gen_gstin}
            onChange={handleChange}
            placeholder="36AARFB4347G037"
            style={styles.input}
            required
          />
        </div>

        {/* Date */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Date (DD/MM/YYYY)
          </label>

          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="29/07/2026"
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Fetching..."
            : "Get E-Way Bills"}
        </button>
      </form>

      {/* Error */}

      {errorMsg && (
        <div
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 8,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontWeight: "600",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Response */}

      {response && (
        <div style={styles.responseCard}>
          <div style={styles.responseHeader}>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: "#16a34a",
              }}
            >
              SUCCESS
            </span>

            <span style={styles.responseDesc}>
              Response Details
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
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    border: "1px solid #e2e8f0",
    width: "100%",
    maxWidth: "650px",
    padding: "32px",
  },

  header: {
    textAlign: "center",
    marginBottom: "20px",
  },

  badge: {
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "12px",
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
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
    marginBottom: "10px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "14px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },

  button: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },

  responseCard: {
    marginTop: "24px",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #bbf7d0",
    backgroundColor: "#f0fdf4",
  },

  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },

  statusBadge: {
    color: "#fff",
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
    maxHeight: "500px",
    fontSize: "12px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};
export default GetEwayBillsTransporterByGstin;