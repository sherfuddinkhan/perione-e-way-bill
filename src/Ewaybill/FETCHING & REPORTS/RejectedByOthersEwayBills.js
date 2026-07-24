import React, { useState,useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../../AuthContext";
const RejectedByOthersEwayBills = () => {
   const {
    isLoggedIn,
    authData,
    logout,
    connectionType,
    setConnectionType,
  } = useAuth();
  const [date, setDate] = useState("");
  const [ewayBills, setEwayBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const auth = JSON.parse(localStorage.getItem("eway_auth"));

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (auth) {
    setFormData((prev) => ({
      ...prev,
      email: auth.email ,
      gstin: auth.gstin ,
      client_id: auth.client_id ,
      client_secret: auth.client_secret ,
      ip_address: auth.ip_address ,
      env: auth.env ,
      date: today,
    }));
  }
}, []);
  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };
  const [formData, setFormData] = useState({
  email: "sherfuddin.phd@gmail.com",
  fromDate: "",
  toDate: "",
  gstin: "",
  status: "",
  page: "1",
  limit: "10"
});

 const fetchRejectedBills = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await axios.get(
      "http://localhost:5000/api/ewaybill/rejected-by-others",
      {
        params: {
          email: formData.email,
          date: formatDate(formData.date),
          gstin: formData.gstin,
          client_id: formData.client_id,
          client_secret: formData.client_secret,
          ip_address: formData.ip_address,
          env: formData.env,
        },
         headers: {
        ConnectionType: connectionType,
      },
      }
    );

    setEwayBills(response.data.data || []);
  } catch (err) {
    setError("Failed to fetch rejected E-Way Bills");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Get E-Way Bills Rejected by Others</h2>

      <div style={styles.form}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        <button onClick={fetchRejectedBills} style={styles.button}>
          {loading ? "Loading..." : "Fetch Rejected Bills"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {ewayBills.length > 0 ? (
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
              <th>Rejected Date</th>
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
                <td>{bill.rejectedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No rejected E-Way Bills found.</p>
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
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
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

export default RejectedByOthersEwayBills;