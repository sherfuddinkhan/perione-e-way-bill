import React, { useState } from "react";

const GenerateConsolidatedEwayBill = () => {
  const [formData, setFormData] = useState({
    fromPlace: "FRAZER TOWN",
    fromState: "36",
    vehicleNo: "TS09AB1231",
    transMode: "1",
    transDocNo: "12",
    transDocDate: "",
  });

  // Dynamic array for multiple EWB Numbers
  const [ewbList, setEwbList] = useState([{ ewbNo: "171012148940" }]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEwbChange = (index, value) => {
    const updatedList = [...ewbList];
    updatedList[index].ewbNo = value;
    setEwbList(updatedList);
  };

  const addEwbField = () => {
    setEwbList([...ewbList, { ewbNo: "" }]);
  };

  const removeEwbField = (index) => {
    if (ewbList.length === 1) return;
    const updatedList = ewbList.filter((_, i) => i !== index);
    setEwbList(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setErrorMsg("");

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    let formattedDate = "";
    if (formData.transDocDate) {
      const [year, month, day] = formData.transDocDate.split("-");
      formattedDate = `${day}/${month}/${year}`;
    }

    const payload = {
      fromPlace: formData.fromPlace,
      fromState: Number(formData.fromState),
      vehicleNo: formData.vehicleNo,
      transMode: formData.transMode,
      transDocNo: formData.transDocNo,
      transDocDate: formattedDate,
      tripSheetEwbBills: ewbList.filter((item) => item.ewbNo.trim() !== ""),
    };

    try {
      const res = await fetch("/api/ewaybill/generate-consolidated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status_cd === "1") {
        setResponse(data);
      } else {
        setErrorMsg(data.status_desc || "Failed to generate Consolidated E-Way Bill.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "750px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1A73E8", marginBottom: "20px", marginTop: 0 }}>Generate Consolidated E-Way Bill</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>From Place *</label>
            <input type="text" name="fromPlace" value={formData.fromPlace} onChange={handleChange} required style={inputStyle} placeholder="e.g. FRAZER TOWN" />
          </div>

          <div>
            <label style={labelStyle}>From State Code *</label>
            <select name="fromState" value={formData.fromState} onChange={handleChange} style={inputStyle}>
              <option value="36">36 - Telangana</option>
              <option value="27">27 - Maharashtra</option>
              <option value="29">29 - Karnataka</option>
              <option value="33">33 - Tamil Nadu</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Vehicle Number *</label>
            <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} required style={inputStyle} placeholder="e.g. TS09AB1231" />
          </div>

          <div>
            <label style={labelStyle}>Transport Mode *</label>
            <select name="transMode" value={formData.transMode} onChange={handleChange} style={inputStyle}>
              <option value="1">1 - Road</option>
              <option value="2">2 - Rail</option>
              <option value="3">3 - Air</option>
              <option value="4">4 - Ship</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Transport Doc No *</label>
            <input type="text" name="transDocNo" value={formData.transDocNo} onChange={handleChange} required style={inputStyle} placeholder="e.g. 12" />
          </div>

          <div>
            <label style={labelStyle}>Transport Doc Date *</label>
            <input type="date" name="transDocDate" value={formData.transDocDate} onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        {/* Dynamic Trip Sheet E-Way Bills Section */}
        <div style={{ marginTop: "24px", padding: "16px", background: "#F8F9FA", borderRadius: "6px", border: "1px solid #E0E0E0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h4 style={{ margin: 0, color: "#333" }}>Trip Sheet E-Way Bills</h4>
            <button type="button" onClick={addEwbField} style={{ padding: "6px 12px", background: "#34A853", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              + Add EWB
            </button>
          </div>

          {ewbList.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
              <input
                type="text"
                value={item.ewbNo}
                onChange={(e) => handleEwbChange(index, e.target.value)}
                placeholder="E-Way Bill Number (e.g. 171012148940)"
                required
                style={{ ...inputStyle, flex: 1 }}
              />
              {ewbList.length > 1 && (
                <button type="button" onClick={() => removeEwbField(index)} style={{ padding: "10px 14px", background: "#EA4335", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "20px", padding: "12px", background: "#1A73E8", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
          {loading ? "Generating..." : "Generate Consolidated EWB"}
        </button>
      </form>

      {errorMsg && (
        <div style={{ marginTop: "20px", padding: "12px", background: "#FFEBE9", color: "#D93025", border: "1px solid #FFC1C0", borderRadius: "6px" }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {response && (
        <div style={{ marginTop: "20px", padding: "16px", background: "#E6F4EA", color: "#137333", border: "1px solid #CEEAD6", borderRadius: "6px" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Consolidated EWB Generated Successfully!</h3>
          <p style={{ margin: "4px 0" }}><strong>Consolidated EWB No:</strong> {response.data?.cEwbNo}</p>
          <p style={{ margin: "4px 0" }}><strong>Generation Date:</strong> {response.data?.cEwbDate}</p>
          <p style={{ margin: "4px 0" }}><strong>Status Description:</strong> {response.status_desc}</p>
        </div>
      )}
    </div>
  );
};

const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #CCC", borderRadius: "6px", boxSizing: "border-box" };

export default GenerateConsolidatedEwayBill;