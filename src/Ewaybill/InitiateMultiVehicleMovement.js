import React, { useState } from "react";

const InitiateMultiVehicleMovement= () => {
  const [formData, setFormData] = useState({
    ewbNo: "181012149102",
    fromPlace: "FRAZER TOWN",
    fromState: "36",
    toPlace: "Beml Nagar",
    toState: "36",
    reasonCode: "1",
    reasonRem: "Due to Break Down",
    totalQuantity: "1",
    unitCode: "BOX",
    transMode: "1",
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
      const res = await fetch("http://localhost:5000/api/ewaybill/initmulti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status_cd === "1") setResponse(data);
      else setErrorMsg(data.status_desc || "Failed to initialize multi vehicle.");
    } catch (err) {
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1A73E8" }}>Initialize Multi Vehicle</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Add all fields similarly */}
        <input name="ewbNo" value={formData.ewbNo} onChange={handleChange} style={inputStyle} placeholder="EWB No" required />
        <input name="fromPlace" value={formData.fromPlace} onChange={handleChange} style={inputStyle} placeholder="From Place" required />
        {/* ... other fields */}
        <button type="submit" disabled={loading} style={buttonStyle}>{loading ? "Processing..." : "Initialize Multi"}</button>
      </form>

      {errorMsg && <div style={errorStyle}><strong>Error:</strong> {errorMsg}</div>}
      {response && <div style={successStyle}>✅ Multi Vehicle Group Created: Group No {response.data?.groupNo}</div>}
    </div>
  );
};

const inputStyle = { width: "100%", padding: "10px", border: "1px solid #CCC", borderRadius: "6px", boxSizing: "border-box" };
const buttonStyle = { padding: "12px", background: "#1A73E8", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };
const errorStyle = { marginTop: "20px", padding: "12px", background: "#FFEBE9", color: "#D93025", border: "1px solid #FFC1C0", borderRadius: "6px" };
const successStyle = { marginTop: "20px", padding: "16px", background: "#E6F4EA", color: "#137333", border: "1px solid #CEEAD6", borderRadius: "6px" };

export default InitiateMultiVehicleMovement;