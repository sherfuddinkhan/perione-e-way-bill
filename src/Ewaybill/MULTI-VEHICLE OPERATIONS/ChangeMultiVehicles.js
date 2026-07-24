import React, { useState } from "react";

const ChangeMultiVehicles = () => {
  const [formData, setFormData] = useState({
    ewbNo: "181012149102",
    groupNo: "1",
    oldvehicleNo: "TS09AB1264",
    newVehicleNo: "TS09AB1261",
    oldTranNo: "12",
    newTranNo: "125",
    fromPlace: "FRAZER TOWN",
    fromState: "36",
    reasonCode: "1",
    reasonRem: "Due to Break Down",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
  const ewayBill = JSON.parse(localStorage.getItem("ewaybill_response"));
  const tripSheet = JSON.parse(localStorage.getItem("trip_sheet_data"));

  setFormData((prev) => ({
    ...prev,

    // From Generate E-Way Bill
    ewbNo: ewayBill?.eWayBillNumber || prev.ewbNo,

    // Existing vehicle details
    oldvehicleNo: ewayBill?.vehicleNo || tripSheet?.vehicleNo || prev.oldvehicleNo,
    oldTranNo: tripSheet?.transDocNo || prev.oldTranNo,

    // Trip Sheet details
    fromPlace: tripSheet?.fromPlace || prev.fromPlace,
    fromState: tripSheet?.fromState || prev.fromState,

    // Leave these for user input
    groupNo: prev.groupNo,
    newVehicleNo: prev.newVehicleNo,
    newTranNo: prev.newTranNo,
    reasonCode: prev.reasonCode,
    reasonRem: prev.reasonRem,
  }));
}, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/ewaybill/updtmulti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status_cd === "1") setResponse(data);
      else setErrorMsg(data.status_desc || "Update failed.");
    } catch (err) {
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1A73E8" }}>Update Multi Vehicle</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input name="ewbNo" value={formData.ewbNo} onChange={handleChange} style={inputStyle} placeholder="EWB No" required />
        <input name="oldvehicleNo" value={formData.oldvehicleNo} onChange={handleChange} style={inputStyle} placeholder="Old Vehicle No" required />
        <input name="newVehicleNo" value={formData.newVehicleNo} onChange={handleChange} style={inputStyle} placeholder="New Vehicle No" required />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Updating..." : "Update Vehicle"}
        </button>
      </form>

      {errorMsg && <div style={errorStyle}><strong>Error:</strong> {errorMsg}</div>}
      {response && <div style={successStyle}>✅ Vehicle Updated Successfully!</div>}
    </div>
  );
};

const inputStyle = { width: "100%", padding: "10px", border: "1px solid #CCC", borderRadius: "6px", boxSizing: "border-box" };
const buttonStyle = { padding: "12px", background: "#1A73E8", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };
const errorStyle = { marginTop: "20px", padding: "12px", background: "#FFEBE9", color: "#D93025", border: "1px solid #FFC1C0", borderRadius: "6px" };
const successStyle = { marginTop: "20px", padding: "16px", background: "#E6F4EA", color: "#137333", border: "1px solid #CEEAD6", borderRadius: "6px" };

export default ChangeMultiVehicles;