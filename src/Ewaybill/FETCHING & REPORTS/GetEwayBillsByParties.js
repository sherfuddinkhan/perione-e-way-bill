import React, { useState } from "react";
import axios from "axios";

const GetEwayBillsByParties = () => {
  const [formData, setFormData] = useState({
    email: "sherfuddin.phd@gmail.com",
    date: "2026-07-22",
    gstin: "29AARFB4347G000",
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

  const fetchOtherPartyBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/ewaybill/other-party",
        {
          params: {
            ...formData,
            date: formatDate(formData.date),
          },
        }
      );

      setEwayBills(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch E-Way Bills of Other Party");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Get E-Way Bills of Other Party</h2>

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

        <button onClick={fetchOtherPartyBills} style={styles.button}>
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
              <th>GSTIN</th>
              <th>Doc No</th>
              <th>Doc Date</th>
              <th>Valid Upto</th>
            </tr>
          </thead>
          <tbody>
            {ewayBills.map((bill, index) => (
              <tr key={index}>
                <td>{bill.ewbNo}</td>
                <td>{bill.ewbDate}</td>
                <td>{bill.status}</td>
                <td>{bill.genGstin}</td>
                <td>{bill.docNo}</td>
                <td>{bill.docDate}</td>
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
    minWidth: "220px",
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

export default GetEwayBillsByParties;