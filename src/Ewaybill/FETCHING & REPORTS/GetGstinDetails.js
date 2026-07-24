import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../AuthContext";
// --- ResponseViewer Component ---
const ResponseViewer = ({ response }) => {
  if (!response) return null;

  const isSuccess = response.success;

  return (
    <div
      style={{
        ...styles.responseCard,
        backgroundColor: isSuccess ? "#f0fdf4" : "#fef2f2",
        borderColor: isSuccess ? "#bbf7d0" : "#fecaca",
      }}
    >
      <div style={styles.responseHeader}>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: isSuccess ? "#16a34a" : "#dc2626",
          }}
        >
          {isSuccess ? "SUCCESS" : "FAILED"}
        </span>
        <span style={styles.responseDesc}>
          {response.data?.status_desc || "Response Details"}
        </span>
      </div>
      <pre style={styles.jsonViewer}>
        {JSON.stringify(response.data, null, 2)}
      </pre>
    </div>
  );
};

// --- Main GetGstinDetails Component ---
const GetGstinDetails = () => {
  const { connectionType } = useAuth();
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  useEffect(() => {
  const auth = JSON.parse(localStorage.getItem("eway_auth"));

  if (auth?.gstin) {
    setGstin(auth.gstin);
  }
}, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

  try {
  const res = await axios.get(
    "http://localhost:5000/api/ewaybill/gstin-details",
    {
      params: {
        gstin,
      },
      headers: {
        ConnectionType: connectionType,
      },
    }
  );

  setResponse({
    success: true,
    data: res.data,
  });
} catch (err) {
  setResponse({
    success: false,
    data: err.response?.data || { message: err.message },
  });
} finally {
  setLoading(false);
}
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>Lookup</span>
          <h2 style={styles.title}>3. Get GSTIN Details</h2>
          <p style={styles.subtitle}>Verify and fetch taxpayer profile info</p>
        </div>

        <form onSubmit={handleSearch} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>GSTIN</label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="e.g. 36AARFB4347G037"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Fetching...' : 'Get Details'}
          </button>
        </form>

        <ResponseViewer response={response} />
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    width: "100%",
    maxWidth: "480px",
    padding: "32px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  title: {
    margin: "0",
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: "700",
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  responseCard: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "10px",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  statusBadge: {
    color: "#ffffff",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
  },
  responseDesc: {
    fontSize: "12px",
    color: "#334155",
    fontWeight: "600",
  },
  jsonViewer: {
    margin: "0",
    padding: "12px",
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    borderRadius: "6px",
    fontSize: "11px",
    fontFamily: "monospace",
    overflowX: "auto",
    maxHeight: "180px",
  },
};

export default GetGstinDetails;