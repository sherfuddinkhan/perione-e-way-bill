import React, { useState } from "react";
import axios from "axios";

const RegenerateTripSheet = () => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const RegenerateConsolidatedEwaybill = async () => {
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
      <div style={styles.card}>
        <h2 style={styles.heading}>Regenerate Trip Sheet E-Way Bill</h2>

        <div style={styles.form}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="tripSheetNo"
            placeholder="Trip Sheet No"
            value={formData.tripSheetNo}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="vehicleNo"
            placeholder="Vehicle Number"
            value={formData.vehicleNo}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="fromPlace"
            placeholder="From Place"
            value={formData.fromPlace}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="fromState"
            placeholder="From State"
            value={formData.fromState}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="reasonCode"
            placeholder="Reason Code"
            value={formData.reasonCode}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="reasonRem"
            placeholder="Reason Remark"
            value={formData.reasonRem}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="transDocNo"
            placeholder="Transport Doc No"
            value={formData.transDocNo}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="transDocDate"
            placeholder="Transport Doc Date (DD/MM/YYYY)"
            value={formData.transDocDate}
            onChange={handleChange}
            style={styles.input}
          />

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

          <input
            type="text"
            name="clientId"
            placeholder="Client ID"
            value={formData.clientId}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="clientSecret"
            placeholder="Client Secret"
            value={formData.clientSecret}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="gstin"
            placeholder="GSTIN"
            value={formData.gstin}
            onChange={handleChange}
            style={styles.input}
          />

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
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
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
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "25px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
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