import React, { useState } from "react";
import axios from "axios";

const CloseEwayBill = () => {
  const [formData, setFormData] = useState({
    email: "sherfuddin.phd@gmail.com",
    gstin: "36AARFB4347G037",
    client_id: "",
    client_secret: "",
    ip_address: "103.88.236.42",
    env: "sandbox",
    ewbNo: "181012149102",
    closureDate: "2026-05-21",
    remarks: "Delivered the order",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const closeEwayBill = async () => {
    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const res = await axios.post(
        "http://localhost:5000/api/ewaybill/close",
        {
          ...formData,
          closureDate: formatDate(formData.closureDate),
        }
      );

      setResponse(res.data);
    } catch (err) {
      setError("Failed to close E-Way Bill");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Close E-Way Bill</h2>

      <div style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

        <input
          type="text"
          name="client_id"
          placeholder="Client ID"
          value={formData.client_id}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="client_secret"
          placeholder="Client Secret"
          value={formData.client_secret}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="ip_address"
          placeholder="IP Address"
          value={formData.ip_address}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="env"
          placeholder="Environment"
          value={formData.env}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="ewbNo"
          placeholder="E-Way Bill Number"
          value={formData.ewbNo}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="date"
          name="closureDate"
          value={formData.closureDate}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={closeEwayBill} style={styles.button}>
          {loading ? "Closing..." : "Close E-Way Bill"}
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
    padding: "10px",
    fontSize: "14px",
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

export default CloseEwayBill;