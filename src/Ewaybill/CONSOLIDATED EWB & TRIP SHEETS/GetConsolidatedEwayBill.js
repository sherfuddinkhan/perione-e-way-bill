import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const GetConsolidatedEwayBill = () => {
  const [tripSheetNo, setTripSheetNo] = useState("1510012169");
  const [email, setEmail] = useState("sherfuddin.phd@gmail.com");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [gstin, setGstin] = useState("36AARFB4347G037");
  const [env, setEnv] = useState("sandbox");

  const [tripSheet, setTripSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { authData } = useAuth();
useEffect(() => {
  if (authData?.email) {
    setEmail(authData.email);
    setClientId(authData.client_id);
    setClientSecret(authData.client_secret);
    setGstin(authData.gstin);
    setEnv(authData.env);
  } else {
    // Restore after page refresh
    const savedAuth = JSON.parse(localStorage.getItem("eway_auth"));

    if (savedAuth) {
      setEmail(savedAuth.email || "");
      setClientId(savedAuth.client_id || "");
      setClientSecret(savedAuth.client_secret || "");
      setGstin(savedAuth.gstin || "");
      setEnv(savedAuth.env || "sandbox");
    }
  }
}, [authData]);

useEffect(() => {
  const savedTripSheet = JSON.parse(localStorage.getItem("trip_sheet_data"));

  if (savedTripSheet) {
    setTripSheet(savedTripSheet);
    setTripSheetNo(savedTripSheet.tripSheetNo || "");
  }
}, []);
  const fetchTripSheet = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch dynamic public IP address
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipRes.data.ip;

      const response = await axios.get(
        "http://localhost:5000/api/gettripsheet",
        {
          params: {
            email,
            tripSheetNo,
          },
          headers: {
            ip_address: ipAddress,
            client_id: clientId,
            client_secret: clientSecret,
            gstin: gstin,
            env: env,
          },
        }
      );

      setTripSheet(response.data.data);
      localStorage.setItem("trip_sheet_data",JSON.stringify(response.data.data));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Trip Sheet details");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div style={styles.container}>
    <h2 style={styles.heading}>Get Trip Sheet E-Way Bill</h2>

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
        <label style={styles.label}>Trip Sheet No</label>
        <input
          type="text"
          value={tripSheetNo}
          onChange={(e) => setTripSheetNo(e.target.value)}
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
        onClick={fetchTripSheet}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Trip Sheet"}
      </button>
    </div>

    {error && <p style={styles.error}>{error}</p>}

    {tripSheet && (
      <div style={styles.card}>
        <h3>Trip Sheet Information</h3>

        <p><strong>Trip Sheet No:</strong> {tripSheet.tripSheetNo}</p>
        <p><strong>From Place:</strong> {tripSheet.fromPlace}</p>
        <p><strong>From State:</strong> {tripSheet.fromState}</p>
        <p><strong>Vehicle No:</strong> {tripSheet.vehicleNo}</p>
        <p><strong>Transport Mode:</strong> {tripSheet.transMode}</p>
        <p><strong>Transport Doc No:</strong> {tripSheet.transDocNo}</p>
        <p><strong>Transport Doc Date:</strong> {tripSheet.transDocDate}</p>
        <p><strong>GSTIN:</strong> {tripSheet.userGstin}</p>
        <p><strong>Entered Date:</strong> {tripSheet.enteredDate}</p>
        <p><strong>Status:</strong> {tripSheet.status}</p>

        <h3 style={{ marginTop: "25px" }}>Trip Sheet E-Way Bills</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>EWB No</th>
              <th style={styles.th}>Doc No</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Valid Upto</th>
            </tr>
          </thead>
          <tbody>
            {tripSheet.tripSheetEwbBills.map((bill, index) => (
              <tr key={index}>
                <td style={styles.td}>{bill.ewbNo}</td>
                <td style={styles.td}>{bill.docNo}</td>
                <td style={styles.td}>{bill.fromTradeName}</td>
                <td style={styles.td}>{bill.toTradeName}</td>
                <td style={styles.td}>₹{bill.totInvValue.toLocaleString()}</td>
                <td style={styles.td}>{bill.validUpto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#1A73E8",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
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
    gridColumn: "1 / span 2",
    padding: "12px",
    backgroundColor: "#1A73E8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  th: {
    backgroundColor: "#1A73E8",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
  },
};

export default GetConsolidatedEwayBill;