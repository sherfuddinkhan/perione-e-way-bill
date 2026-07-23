import React, { useState } from "react";
import axios from "axios";

const RejectEwayBill = () => {
  const [formData, setFormData] = useState({
    email: "sherfuddin.phd@gmail.com",
    ip_address: "0.0.0.0",
    client_id: "",
    client_secret: "",
    gstin: "36AARFB4347G037",
    env: "sandbox",
    ewbNo: "311009282644",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const rejectEwayBill = async () => {
    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const res = await axios.post(
        "http://localhost:5000/api/ewaybill/reject",
        formData
      );

      setResponse(res.data);
    } catch (err) {
      setError("Failed to reject E-Way Bill");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

return (
  <div style={styles.container}>
    <h2 style={styles.heading}>Reject E-Way Bill</h2>

    <div style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>IP Address</label>
        <input
          type="text"
          name="ip_address"
          value={formData.ip_address}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Client ID</label>
        <input
          type="text"
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Client Secret</label>
        <input
          type="text"
          name="client_secret"
          value={formData.client_secret}
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
        <input
          type="text"
          name="env"
          value={formData.env}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>E-Way Bill Number</label>
        <input
          type="number"
          name="ewbNo"
          value={formData.ewbNo}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <button onClick={rejectEwayBill} style={styles.button}>
        {loading ? "Rejecting..." : "Reject E-Way Bill"}
      </button>
    </div>

    {error && <p style={styles.error}>{error}</p>}

    {response && (
      <div style={styles.response}>
        <h3>API Response</h3>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    )}
  </div>
);
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#1A73E8",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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
    padding: "12px",
    backgroundColor: "#1A73E8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  response: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
  },
};

export default RejectEwayBill;