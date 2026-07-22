import React, { useState } from "react";

const AddMultiVehicles= () => {
  const [formData, setFormData] = useState({
    ewbNo: "181012149102",
    vehicleNo: "TS09AB1264",
    groupNo: "1",
    transDocNo: "12",
    transDocDate: "30/06/2026",
    quantity: "1",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/ewaybill/addmulti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status_cd === "1") setResponse(data);
      else setErrorMsg(data.status_desc || "Failed to add vehicle.");
    } catch (err) {
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1A73E8" }}>Add Vehicle to Multi Group</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input name="ewbNo" value={formData.ewbNo} onChange={handleChange} style={inputStyle} placeholder="EWB No" required />
        <input name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} style={inputStyle} placeholder="Vehicle Number" required />
        <input name="groupNo" value={formData.groupNo} onChange={handleChange} style={inputStyle} placeholder="Group No" required />
        <input name="transDocNo" value={formData.transDocNo} onChange={handleChange} style={inputStyle} placeholder="Transport Doc No" />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>

      {errorMsg && <div style={errorStyle}><strong>Error:</strong> {errorMsg}</div>}
      {response && <div style={successStyle}>✅ Vehicle Added Successfully!</div>}
    </div>
  );
};

const inputStyle = { width: "100%", padding: "10px", border: "1px solid #CCC", borderRadius: "6px", boxSizing: "border-box" };
const buttonStyle = { padding: "12px", background: "#1A73E8", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };
const errorStyle = { marginTop: "20px", padding: "12px", background: "#FFEBE9", color: "#D93025", border: "1px solid #FFC1C0", borderRadius: "6px" };
const successStyle = { marginTop: "20px", padding: "16px", background: "#E6F4EA", color: "#137333", border: "1px solid #CEEAD6", borderRadius: "6px" };

export default AddMultiVehicles;