import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

// ---------------- Response Viewer ----------------
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

// ---------------- Main Component ----------------

const GetEwayBillsByDate = () => {
  const { authData, connectionType } = useAuth();

  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    stateCode: "",
  });

  const [headers, setHeaders] = useState({
    gstin: "",
    client_id: "",
    client_secret: "",
    ip_address: "",
    env: "sandbox",
    ConnectionType: "",
  });

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);

  // ---------------- Load Auth ----------------

  useEffect(() => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-GB");

    if (authData) {
      setEmail(authData.email || "");

      setHeaders({
        gstin: authData.gstin || "",
        client_id: authData.client_id || "",
        client_secret: authData.client_secret || "",
        ip_address: authData.ip_address || "",
        env: authData.env || "sandbox",
        ConnectionType: connectionType || "",
      });

      setFormData({
        date: formattedDate,
        stateCode: authData.gstin
          ? authData.gstin.substring(0, 2)
          : "",
      });
    } else {
      const authString = localStorage.getItem("eway_auth");

      if (authString && authString !== "undefined") {
        try {
          const auth = JSON.parse(authString);

          setEmail(auth.email || "");

          setHeaders({
            gstin: auth.gstin || "",
            client_id: auth.client_id || "",
            client_secret: auth.client_secret || "",
            ip_address: auth.ip_address || "",
            env: auth.env || "sandbox",
            ConnectionType: connectionType || "",
          });

          setFormData({
            date: formattedDate,
            stateCode: auth.gstin
              ? auth.gstin.substring(0, 2)
              : "",
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [authData, connectionType]);

  // ---------------- Handlers ----------------

  const handleHeaderChange = (e) => {
    setHeaders({
      ...headers,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- Submit ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setResponse(null);

    try {
      let ipAddress = headers.ip_address;

      if (!ipAddress) {
        const ipRes = await axios.get(
          "https://api.ipify.org?format=json"
        );

        ipAddress = ipRes.data.ip;
      }

      const res = await axios.get(
        "https://einvoice.fcssoftwares.com/api/perione/ewaybill/by-date",
        {
          params: {
            email: email.trim(),
            date: formData.date,
            stateCode: formData.stateCode,
          },

          headers: {
            gstin: headers.gstin,
            client_id: headers.client_id,
            client_secret: headers.client_secret,
            ip_address: ipAddress,
            env: headers.env,
            ConnectionType: headers.ConnectionType,
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
        data:
          err.response?.data || {
            message: err.message,
          },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
  <div style={styles.outerContainer}>
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.badge}>REPORT</span>

        <h1 style={styles.title}>Get E-Way Bills By Date</h1>

        <p style={styles.subtitle}>
          Fetch E-Way Bills generated on a specific date
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* API Connection Details */}

        <div style={styles.authBox}>
          <h4>API Connection Details</h4>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>GSTIN</label>

            <input
              type="text"
              name="gstin"
              value={headers.gstin}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Client ID</label>

            <input
              type="text"
              name="client_id"
              value={headers.client_id}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Client Secret</label>

            <input
              type="password"
              name="client_secret"
              value={headers.client_secret}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>IP Address</label>

            <input
              type="text"
              name="ip_address"
              value={headers.ip_address}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Environment</label>

            <select
              name="env"
              value={headers.env}
              onChange={handleHeaderChange}
              style={styles.input}
            >
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Connection Type</label>

            <input
              type="text"
              name="ConnectionType"
              value={headers.ConnectionType}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>
        </div>

        {/* Email */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Registered Email"
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

        {/* State Code */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            State Code
          </label>

          <input
            type="text"
            name="stateCode"
            value={formData.stateCode}
            onChange={handleChange}
            placeholder="36"
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

      <ResponseViewer response={response} />
    </div>
  </div>
)

}
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
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    border: "1px solid #e2e8f0",
    width: "100%",
    maxWidth: "700px",
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
    marginBottom: "20px",
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
    color: "#334155",
    marginBottom: "6px",
  },

  input: {
    padding: "11px 14px",
    fontSize: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },

  button: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "13px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },

  responseCard: {
    marginTop: "24px",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid",
  },

  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },

  statusBadge: {
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  responseDesc: {
    fontWeight: "600",
    color: "#334155",
  },

  jsonViewer: {
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    padding: "14px",
    borderRadius: "8px",
    overflowX: "auto",
    maxHeight: "450px",
    fontSize: "12px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};

export default GetEwayBillsByDate;