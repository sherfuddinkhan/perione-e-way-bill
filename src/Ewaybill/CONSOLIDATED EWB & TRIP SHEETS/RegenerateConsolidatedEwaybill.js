import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
const RegenerateConsolidatedEwaybill = () => {
  const [formData, setFormData] = useState({
    email: "sherfuddin.phd@gmail.com",
    tripSheetNo: "161012149685",
    vehicleNo: "TS09AB1234",
    fromPlace: "FRAZER TOWN",
    fromState: "36",
    reasonCode: "1",
    reasonRem: "Natural Calamity",
    transDocNo: "12",
    transDocDate: "11/07/2026",
    transMode: "1",
    clientId: "",
    clientSecret: "",
    gstin: "36AARFB4347G037",
    env: "sandbox",
  });

  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
  const auth = JSON.parse(localStorage.getItem("eway_auth"));
  const tripSheet = JSON.parse(localStorage.getItem("trip_sheet_data"));
  console.log("auth",auth)
   console.log("tripsheet",tripSheet)
  setFormData((prev) => ({
    ...prev,

    // Authentication Details
    email: auth?.email || prev.email,
    clientId: auth?.client_id || prev.clientId,
    clientSecret: auth?.client_secret || prev.clientSecret,
    gstin: auth?.gstin || prev.gstin,
    env: auth?.env || prev.env,

    // Trip Sheet Details
    tripSheetNo: tripSheet?.tripSheetNo || prev.tripSheetNo,
    vehicleNo: tripSheet?.vehicleNo || prev.vehicleNo,
    fromPlace: tripSheet?.fromPlace || prev.fromPlace,
    fromState: tripSheet?.fromState || prev.fromState,
    transDocNo: tripSheet?.transDocNo || prev.transDocNo,
    transDocDate: tripSheet?.transDocDate || prev.transDocDate,
    transMode: tripSheet?.transMode || prev.transMode,
  }));
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const regenerateTripSheet = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch public IP dynamically
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipRes.data.ip;

      const response = await axios.post(
        "http://localhost:5000/api/regentripsheet",
        {
          tripSheetNo: Number(formData.tripSheetNo),
          vehicleNo: formData.vehicleNo,
          fromPlace: formData.fromPlace,
          fromState: Number(formData.fromState),
          reasonCode: formData.reasonCode,
          reasonRem: formData.reasonRem,
          transDocNo: formData.transDocNo,
          transDocDate: formData.transDocDate,
          transMode: formData.transMode,
        },
        {
          params: { email: formData.email },
          headers: {
            ip_address: ipAddress,
            client_id: formData.clientId,
            client_secret: formData.clientSecret,
            gstin: formData.gstin,
            env: formData.env,
          },
        }
      );

      setResponseData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to regenerate Trip Sheet");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div style={styles.container}>
    <h2 style={styles.heading}>Regenerate Trip Sheet E-Way Bill</h2>

    <div style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Trip Sheet No</label>
        <input
          type="text"
          name="tripSheetNo"
          value={formData.tripSheetNo}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Vehicle Number</label>
        <input
          type="text"
          name="vehicleNo"
          value={formData.vehicleNo}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>From Place</label>
        <input
          type="text"
          name="fromPlace"
          value={formData.fromPlace}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>From State</label>
        <input
          type="number"
          name="fromState"
          value={formData.fromState}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Reason Code</label>
        <input
          type="text"
          name="reasonCode"
          value={formData.reasonCode}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Reason Remark</label>
        <input
          type="text"
          name="reasonRem"
          value={formData.reasonRem}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Transport Doc No</label>
        <input
          type="text"
          name="transDocNo"
          value={formData.transDocNo}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Transport Doc Date (DD/MM/YYYY)</label>
        <input
          type="text"
          name="transDocDate"
          value={formData.transDocDate}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Transport Mode</label>
        <select
          name="transMode"
          value={formData.transMode}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="1">Road</option>
          <option value="2">Rail</option>
          <option value="3">Air</option>
          <option value="4">Ship</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Client ID</label>
        <input
          type="text"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Client Secret</label>
        <input
          type="text"
          name="clientSecret"
          value={formData.clientSecret}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>GSTIN</label>
        <input
          type="text"
          name="gstin"
          value={formData.gstin}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Environment</label>
        <select
          name="env"
          value={formData.env}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="sandbox">Sandbox</option>
          <option value="live">Live</option>
        </select>
      </div>

      <button
        onClick={regenerateTripSheet}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Regenerating..." : "Regenerate Trip Sheet"}
      </button>
    </div>

    {error && <p style={styles.error}>{error}</p>}

    {responseData && (
      <div style={styles.successBox}>
        <h3>Trip Sheet Regenerated Successfully!</h3>
        <pre style={styles.response}>
          {JSON.stringify(responseData, null, 2)}
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
    maxWidth: "800px",
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
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
  padding: "14px 25px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1A73E8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "15px",
  },
  successBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#e8f5e8",
    borderRadius: "6px",
  },
  response: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

export default RegenerateConsolidatedEwaybill;