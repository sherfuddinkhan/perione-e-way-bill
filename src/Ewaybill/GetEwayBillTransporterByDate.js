import React, { useState } from "react";

const GetEwayBillTransporterByDate = () => {
  const [formData, setFormData] = useState({
    date: "21/07/2026",
    stateCode: "36",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setErrorMsg("");

    try {
      const res = await fetch(`http://localhost:5000/api/ewaybill/getewaybillsbydate?date=${encodeURIComponent(formData.date)}&stateCode=${formData.stateCode}`);
      const data = await res.json();
      if (res.ok && data.status_cd === "1") {
        setResponse(data);
      } else {
        setErrorMsg(data.status_desc || "Failed to fetch list.");
      }
    } catch (err) {
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1A73E8" }}>E-Way Bills by Date</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Date (DD/MM/YYYY) *</label>
          <input type="text" name="date" value={formData.date} onChange={handleChange} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>State Code</label>
          <input type="text" name="stateCode" value={formData.stateCode} onChange={handleChange} style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Loading..." : "Fetch E-Way Bills"}
        </button>
      </form>

      {errorMsg && <div style={errorStyle}><strong>Error:</strong> {errorMsg}</div>}
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results ({response.data?.length || 0})</h3>
          <pre style={{ background: "#f8f9fa", padding: "15px", borderRadius: "6px", overflow: "auto", maxHeight: "500px" }}>
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #CCC", borderRadius: "6px", boxSizing: "border-box" };
const buttonStyle = { padding: "12px", background: "#1A73E8", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };
const errorStyle = { marginTop: "20px", padding: "12px", background: "#FFEBE9", color: "#D93025", border: "1px solid #FFC1C0", borderRadius: "6px" };

export default GetEwayBillTransporterByDate;