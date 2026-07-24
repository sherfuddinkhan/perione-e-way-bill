import React, { useState,useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../../AuthContext";
const GetTransporterDetails = () => {
   const {
    isLoggedIn,
    authData,
    logout,
    connectionType,
    setConnectionType,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [trnNo, setTrnNo] = useState("");

  // Dynamic header fields
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [gstin, setGstin] = useState("");
  const [env, setEnv] = useState("");

  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
  const auth = JSON.parse(localStorage.getItem("eway_auth"));

  if (auth) {
    setEmail(auth.email || "");
    setTrnNo(auth.gstin || "");
    setClientId(auth.client_id || "");
    setClientSecret(auth.client_secret || "");
    setGstin(auth.gstin || "");
    setEnv(auth.env || "sandbox");
  }
}, []);

  const fetchTransporterDetails = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch public IP dynamically
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipRes.data.ip;

      const response = await axios.get(
        "http://localhost:5000/api/gettransporterdetails",
        {
          params: {
            email,
            trn_no: trnNo,
          },
          headers: {
            ip_address: ipAddress,
            client_id: clientId,
            client_secret: clientSecret,
            gstin: gstin,
            env: env,
            ConnectionType: connectionType,
          },
        }
      );

      setTransporter(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transporter details");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div style={styles.container}>
    <h2 style={styles.heading}>Get Transporter Details</h2>

    <div style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Transporter GSTIN / ID (trn_no)</label>
        <input
          type="text"
          value={trnNo}
          onChange={(e) => setTrnNo(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Client ID</label>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Client Secret</label>
        <input
          type="text"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>GSTIN</label>
        <input
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Environment</label>
        <select
          value={env}
          onChange={(e) => setEnv(e.target.value)}
          style={styles.input}
        >
          <option value="sandbox">Sandbox</option>
          <option value="live">Live</option>
        </select>
      </div>

      <button
        onClick={fetchTransporterDetails}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Transporter Details"}
      </button>
    </div>

    {error && <p style={styles.error}>{error}</p>}

    {transporter && (
      <div style={styles.result}>
        <h3>Transporter Information</h3>

        <p>
          <strong>Transporter GSTIN / ID:</strong> {trnNo}
        </p>

        <pre style={styles.response}>
          {JSON.stringify(transporter, null, 2)}
        </pre>
      </div>
    )}
  </div>
);
};

const styles = {
  container: {
    maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "700px",
  },
  heading: {
    color: "#1A73E8",
  marginBottom: "25px",
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "left",
  },
  form: {
    display: "grid",
    gap: "15px",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
  padding: "14px 16px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#1A73E8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
  result: {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  response: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    fontSize: "14px",
  },
};

export default GetTransporterDetails;