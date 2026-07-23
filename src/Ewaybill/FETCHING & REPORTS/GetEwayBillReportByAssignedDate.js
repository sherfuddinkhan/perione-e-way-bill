import React, { useState } from "react";
import axios from "axios";

const EwayBillsByDate = () => {
  const [formData, setFormData] = useState({
    email: "sherfuddin.phd@gmail.com",
    date: "2026-07-22",
    stateCode: "36",
    gstin: "36AARFB4347G037",
    client_id: "",
    client_secret: "",
    ip_address: "0.0.0.0",
    env: "sandbox",
  });

  const [ewayBills, setEwayBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const GetEwayBillReportByAssignedDate = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/ewaybill/by-date",
        {
          params: {
            email: formData.email,
            date: formatDate(formData.date),
            stateCode: formData.stateCode,
            gstin: formData.gstin,
            client_id: formData.client_id,
            client_secret: formData.client_secret,
            ip_address: formData.ip_address,
            env: formData.env,
          },
        }
      );

      setEwayBills(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch E-Way Bills by Date");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Get E-Way Bills by Date</h2>

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
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="stateCode"
          placeholder="State Code"
          value={formData.stateCode}
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

        <button onClick={fetchEwayBills} style={styles.button}>
          {loading ? "Loading..." : "Fetch Bills"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {ewayBills.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>EWB No</th>
              <th>EWB Date</th>
              <th>Status</th>
              <th>Doc No</th>
              <th>Doc Date</th>
              <th>Place</th>
              <th>Pin Code</th>
              <th>Valid Upto</th>
            </tr>
          </thead>
          <tbody>
            {ewayBills.map((bill, index) => (
              <tr key={index}>
                <td>{bill.ewbNo}</td>
                <td>{bill.ewbDate}</td>
                <td>{bill.status}</td>
                <td>{bill.docNo}</td>
                <td>{bill.docDate}</td>
                <td>{bill.delPlace}</td>
                <td>{bill.delPinCode}</td>
                <td>{bill.validUpto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
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
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
    minWidth: "200px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#1A73E8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default GetEwayBillReportByAssignedDate;