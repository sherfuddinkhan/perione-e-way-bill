import React, { useState ,useEffect} from 'react';
import axios from 'axios';
//import './ExtendValidityEwayBill.css';

const ExtendValidityEwayBill = () => {
  const [formData, setFormData] = useState({
    ewbNo: '181012149102',
    vehicleNo: 'TS09AB1234',
    fromPlace: 'Hyderabad',
    fromState: '36',
    remainingDistance: '5',
    transDocNo: 'LR123456',
    transDocDate: '05/06/2026',
    transMode: '1',
    extnRsnCode: '1',
    extnRemarks: 'Nature Calamity',
    fromPincode: '500081',
    consignmentStatus: 'M'
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
useEffect(() => {
  try {
    const savedRaw = localStorage.getItem("ewayBillData");
    if (!savedRaw) return;

    const savedEwb = JSON.parse(savedRaw);

    setFormData((prev) => ({
      ...prev,
      ewbNo: String(
        savedEwb.eWayBillNumber || savedEwb.ewayBillNo || prev.ewbNo
      ),
      vehicleNo: savedEwb.vehicleNo || prev.vehicleNo,
      fromPlace: savedEwb.fromPlace || prev.fromPlace,
      fromState: String(savedEwb.fromState || prev.fromState),
      remainingDistance: String(
        savedEwb.remainingDistance || prev.remainingDistance
      ),
      transDocNo: savedEwb.transDocNo || prev.transDocNo,
      transDocDate: savedEwb.transDocDate || prev.transDocDate,
      transMode: String(savedEwb.transMode || prev.transMode),
      fromPincode: savedEwb.fromPincode || prev.fromPincode,
      consignmentStatus:
        savedEwb.consignmentStatus || prev.consignmentStatus,
    }));
  } catch (err) {
    console.error("Error reading localStorage:", err);
  }
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/extend-validity',
        formData
      );
      setResponse(res.data);
    } catch (error) {
      setResponse(error.response?.data || { error: error.message });
    } finally {
      setLoading(false);
    }
  };

 return (
  <div style={styles.outerContainer}>
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.badge}>E-Way Bill</span>
        <h1 style={styles.title}>Extend Validity</h1>
        <p style={styles.subtitle}>
          Submit the form to extend the validity of an E-Way Bill
        </p>
      </div>

      {/* Form */}
      <form style={styles.form} onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={styles.fieldGroup}>
            <label style={styles.label}>{key}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading
              ? { backgroundColor: "#94a3b8", cursor: "not-allowed" }
              : {})
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Extend Validity"}
        </button>
      </form>

      {/* Response */}
      {response && (
        <div style={styles.responseCard}>
          <div style={styles.responseHeader}>
            <span style={styles.statusBadge}>RESPONSE</span>
            <span style={styles.responseDesc}>API Response</span>
          </div>

          <pre style={styles.jsonViewer}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  </div>
);
};
const styles = {
  // Main Container & Layout
  ewayContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "24px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#334155",
  },

  ewayCard: {
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },

  // Header
  ewayHeader: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "24px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ewayTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700",
  },

  ewaySubtitle: {
    margin: "4px 0 0 0",
    color: "#94a3b8",
    fontSize: "0.875rem",
  },

  ewayBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "#34d399",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  // Form Structure
  ewayForm: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 16px 0",
    paddingBottom: "8px",
    borderBottom: "2px solid #f1f5f9",
  },

  // Form Controls & Grids
  formGrid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  formGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },

  addressCard: {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  addressTitle: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 16px 0",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "12px",
  },

  formLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },

  formInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "0.875rem",
    color: "#1e293b",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    backgroundColor: "#ffffff",
  },

  formSelect: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "0.875rem",
    color: "#1e293b",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    backgroundColor: "#ffffff",
  },

  uppercaseInput: {
    textTransform: "uppercase",
    fontFamily: "monospace",
  },

  // Item List Styles
  itemCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },

  itemHeader: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: "12px",
  },

  // Buttons and Alerts
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },

  btnSubmit: {
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "600",
    padding: "12px 28px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  },

  errorBanner: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "14px 16px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },

  // Success Modal View
  successBanner: {
    backgroundColor: "#f0fdf4",
    borderTop: "1px solid #bbf7d0",
    padding: "24px 32px",
  },

  successCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "20px",
  },

  successHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#166534",
    marginBottom: "16px",
  },

  successDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    backgroundColor: "#f8fafc",
    padding: "16px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },

  detailLabel: {
    display: "block",
    fontSize: "0.75rem",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: "4px",
  },

  detailVal: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
  },

  // Additional Card Layout
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    width: "100%",
    maxWidth: "480px",
    padding: "32px",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
  },

  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },

  responseCard: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },

  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  statusBadge: {
    color: "#ffffff",
    backgroundColor: "#dc2626",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
  },

  responseDesc: {
    fontSize: "12px",
    color: "#334155",
    fontWeight: "600",
  },

  jsonViewer: {
    margin: 0,
    padding: "12px",
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    borderRadius: "6px",
    fontSize: "11px",
    fontFamily: "monospace",
    overflowX: "auto",
    maxHeight: "180px",
  },

  // Responsive
  cardMobile: {
    padding: "20px",
  },
};
export default ExtendValidityEwayBill;