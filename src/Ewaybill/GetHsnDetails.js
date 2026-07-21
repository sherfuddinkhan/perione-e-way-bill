import React, { useState } from 'react';
import axios from 'axios';

const GetHsnDetails=()=> {
  const [hsncode, setHsncode] = useState('100610');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get('http://localhost:5000/api/ewaybill/hsn-details', {
        params: { hsncode },
      });
      setResponse({ success: true, data: res.data });
    } catch (err) {
      setResponse({
        success: false,
        data: err.response?.data || { message: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>2. Get HSN Details</h3>
      <form onSubmit={handleSearch} style={formStyle}>
        <div>
          <label>HSN Code:</label>
          <input
            type="text"
            value={hsncode}
            onChange={(e) => setHsncode(e.target.value)}
            placeholder="e.g. 100610"
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Fetching...' : 'Get Details'}
        </button>
      </form>
      <ResponseViewer response={response} />
    </div>
  );
}
// --- Styles ---
const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
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
    margin: "0",
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
    borderWidth: "1px",
    borderStyle: "solid",
  },
  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  statusBadge: {
    color: "#ffffff",
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
    margin: "0",
    padding: "12px",
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    borderRadius: "6px",
    fontSize: "11px",
    fontFamily: "monospace",
    overflowX: "auto",
    maxHeight: "180px",
  },
};
export default GetHsnDetails;