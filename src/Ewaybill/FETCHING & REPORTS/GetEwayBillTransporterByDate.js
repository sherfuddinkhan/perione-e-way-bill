import React, { useState,useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../../AuthContext";
const GetEwayBillTransporterByDate = () => {
  const [date, setDate] = useState("2026-07-21");
  const [ewayBills, setEwayBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };
useEffect(() => {
  const savedDate = localStorage.getItem("transporter_by_date");

  if (savedDate) {
    setDate(savedDate);
  }
}, []);
  const fetchEwayBills = async () => {
    try {
      setLoading(true);
      setMessage("");

      const formattedDate = formatDate(date);

      const response = await axios.get(
  "http://localhost:5000/api/ewaybill/transporter-by-date",
  {
    params: {
      date: formattedDate,
    },
    headers: {
      ConnectionType: connectionType,
      // or:
      // ConnectionType: localStorage.getItem("ConnectionType"),
    },
  }
);

      if (response.data.status_cd === "1") {
        setEwayBills(response.data.data || []);
        setMessage(response.data.status_desc);
      } else {
        setEwayBills([]);
        setMessage(response.data.status_desc || "No data found");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to fetch E-Way Bills"
      );
      setEwayBills([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Get E-Way Bills for Transporter by Date</h2>

      <div style={styles.formRow}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        <button onClick={fetchEwayBills} style={styles.button}>
          {loading ? "Loading..." : "Fetch E-Way Bills"}
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {ewayBills.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>EWB No</th>
                <th>EWB Date</th>
                <th>Status</th>
                <th>Doc No</th>
                <th>Doc Date</th>
                <th>Place</th>
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
                  <td>{bill.validUpto}</td>
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
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#1A73E8",
    marginBottom: "20px",
  },
  formRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#1A73E8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default GetEwayBillTransporterByDate;