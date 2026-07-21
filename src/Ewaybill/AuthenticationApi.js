import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AuthenticationApi = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "sherfuddin.phd@gmail.com",
    username: "Btg",
    password: "Btg@123",
    ip_address: "103.88.236.42",
    client_id: "PEWAYS3ad9cc820da802c1265893161c36b3cd",
    client_secret: "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
    gstin: "36AARFB4347G037",
    env: "sandbox",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [statusType, setStatusType] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const authenticate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setApiResponse(null);
    setStatusType(null);

    try {
      const res = await axios.get("http://localhost:5000/api/authenticate", {
        params: {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        },
        headers: {
          ip_address: formData.ip_address,
          client_id: formData.client_id,
          client_secret: formData.client_secret,
          gstin: formData.gstin,
          env: formData.env,
        },
      });

      setApiResponse(res.data);

      if (res.data.status_cd === "1") {
        setStatusType("success");
        if (login) login(formData.gstin);
      } else {
        setStatusType("error");
      }
    } catch (err) {
      const errorPayload = err.response?.data || {
        status_cd: "0",
        status_desc: "Network/Server Connection Error",
        details: "Could not reach local server at http://localhost:5000",
      };
      setApiResponse(errorPayload);
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.card}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>Perione API Sandbox</div>
          <h1 style={styles.title}>E-Way Bill Authentication</h1>
          <p style={styles.subtitle}>Enter credentials to execute real-time authentication call</p>
        </div>

        {/* Form Body */}
        <form onSubmit={authenticate} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          {/* Collapsible Advanced Section */}
          <div style={{ marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={styles.accordionToggle}
            >
              <span>{showAdvanced ? "▲ Hide" : "▼ Show"} Developer Headers & Client Keys</span>
            </button>

            {showAdvanced && (
              <div style={styles.advancedBox}>
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>GSTIN</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      style={styles.smallInput}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>IP Address</label>
                    <input
                      type="text"
                      name="ip_address"
                      value={formData.ip_address}
                      onChange={handleChange}
                      style={styles.smallInput}
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.smallLabel}>Client ID</label>
                  <input
                    type="text"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    style={styles.smallInput}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.smallLabel}>Client Secret</label>
                  <input
                    type="text"
                    name="client_secret"
                    value={formData.client_secret}
                    onChange={handleChange}
                    style={styles.smallInput}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Execute Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>

        {/* Live Response Panel in UI */}
        {apiResponse && (
          <div
            style={{
              ...styles.responseCard,
              backgroundColor: statusType === "success" ? "#f0fdf4" : "#fef2f2",
              borderColor: statusType === "success" ? "#bbf7d0" : "#fecaca",
            }}
          >
            <div style={styles.responseHeader}>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: statusType === "success" ? "#16a34a" : "#dc2626",
                }}
              >
                {statusType === "success" ? "✓ 200 SUCCESS" : "✕ FAILED"}
              </span>
              <span style={styles.responseDesc}>
                {apiResponse.status_desc || "Response details below:"}
              </span>
            </div>

            <pre style={styles.jsonViewer}>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};

// --- Modern Pure CSS Inline Styles ---
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
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
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
    backgroundColor: "#e0e7ff",
    color: "#4338ca",
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
  row: {
    display: "flex",
    gap: "12px",
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
    transition: "border 0.2s ease",
  },
  accordionToggle: {
    background: "none",
    border: "none",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "4px 0",
    textAlign: "left",
  },
  advancedBox: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "14px",
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  smallLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: "4px",
    display: "block",
  },
  smallInput: {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "monospace",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "8px",
    transition: "background-color 0.2s ease",
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

export default AuthenticationApi;