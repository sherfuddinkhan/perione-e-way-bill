import React, { useState,useEffect } from 'react';
import axios from "axios";
import { useAuth } from "../../AuthContext";
const GetEwayBillsDetailsTransporterByGstin= () => {
   const {
    isLoggedIn,
    authData,
    logout,
    connectionType,
    setConnectionType,
  } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    Gen_gstin: "",
    date: "",
    gstin: "",
    client_id: "",
    client_secret: "",
    ip_address: "",
    env: "",
  });

  const [ewayBills, setEwayBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

useEffect(() => {
  const auth = JSON.parse(localStorage.getItem("eway_auth"));

  if (auth) {
    setFormData((prev) => ({
      ...prev,
      email: auth.email || prev.email,
      Gen_gstin: auth.gstin || prev.Gen_gstin,
      gstin: auth.gstin || prev.gstin,
      date: today,
      client_id: auth.client_id || prev.client_id,
      client_secret: auth.client_secret || prev.client_secret,
      ip_address: auth.ip_address || prev.ip_address,
      env: auth.env || prev.env,
    }));
  }
}, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchTransporterBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/ewaybill/transporter-by-gstin",
        {
          params: {
            email: formData.email,
            Gen_gstin: formData.Gen_gstin,
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
      setError("Failed to fetch E-Way Bills for Transporter by GSTIN");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

return (
    <div style={styles.cardWrapper}>
      {/* Header Section */}
      <div style={styles.header}>
        <h2 style={styles.title}>Get E-Way Bills for Transporter by GSTIN</h2>
        <p style={styles.subtitle}>
          Enter transporter and generator details below to retrieve active records.
        </p>
      </div>

      {/* Form Fields */}
      <div style={styles.formGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. user@example.com"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Generator GSTIN</label>
          <input
            type="text"
            name="Gen_gstin"
            placeholder="Generator GSTIN"
            value={formData.Gen_gstin}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Transporter GSTIN</label>
          <input
            type="text"
            name="gstin"
            placeholder="Transporter GSTIN"
            value={formData.gstin}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Client ID</label>
          <input
            type="text"
            name="client_id"
            placeholder="Client ID"
            value={formData.client_id}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Client Secret</label>
          <input
            type="password"
            name="client_secret"
            placeholder="Client Secret"
            value={formData.client_secret}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={fetchTransporterBills}
        disabled={loading}
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
      >
        {loading ? "Fetching Bills..." : "Fetch Bills"}
      </button>

      {/* Error Message */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Results Table */}
      {ewayBills && ewayBills.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>EWB No</th>
                <th style={styles.th}>EWB Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Doc No</th>
                <th style={styles.th}>Doc Date</th>
                <th style={styles.th}>Place</th>
                <th style={styles.th}>Pin Code</th>
                <th style={styles.th}>Valid Upto</th>
              </tr>
            </thead>
            <tbody>
              {ewayBills.map((bill, index) => (
                <tr
                  key={index}
                  style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                >
                  <td style={{ ...styles.td, fontWeight: "600" }}>
                    {bill.ewbNo}
                  </td>
                  <td style={styles.td}>{bill.ewbDate}</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge}>{bill.status}</span>
                  </td>
                  <td style={styles.td}>{bill.docNo}</td>
                  <td style={styles.td}>{bill.docDate}</td>
                  <td style={styles.td}>{bill.delPlace}</td>
                  <td style={styles.td}>{bill.delPinCode}</td>
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
  cardWrapper: {
    maxWidth: "850px",
    margin: "40px auto",
    padding: "32px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    border: "1px solid #e2e8f0",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#64748b",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  button: {
    width: "100%",
    padding: "12px 20px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed",
  },
  errorBox: {
    marginTop: "16px",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    fontSize: "14px",
  },
  tableWrapper: {
    marginTop: "32px",
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },
  tableHeaderRow: {
    backgroundColor: "#f1f5f9",
    borderBottom: "1px solid #e2e8f0",
  },
  th: {
    padding: "12px 16px",
    fontWeight: "600",
    color: "#475569",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 16px",
    color: "#1e293b",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  },
  trEven: {
    backgroundColor: "#ffffff",
  },
  trOdd: {
    backgroundColor: "#f8fafc",
  },
  statusBadge: {
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
};

export default GetEwayBillsDetailsTransporterByGstin;