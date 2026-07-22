import React, { useState } from "react";

const UpdateTransporter = () => {
  const [formData, setFormData] = useState({
    ewbNo: "171012148940",
    transporterId: "36AARFB4347G037",
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

    const payload = {
      ewbNo: Number(formData.ewbNo),
      transporterId: formData.transporterId,
    };

    try {
      const res = await fetch("http://localhost:5000/api/ewaybill/update-transporter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status_cd === "1") {
        setResponse(data);
      } else {
        setErrorMsg(data.status_desc || "Failed to update transporter.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1A73E8", marginBottom: "20px", marginTop: 0 }}>Update Transporter ID</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>E-Way Bill Number *</label>
          <input
            type="number"
            name="ewbNo"
            value={formData.ewbNo}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g. 171012148940"
          />
        </div>

        <div>
          <label style={labelStyle}>Transporter ID / GSTIN *</label>
          <input
            type="text"
            name="transporterId"
            value={formData.transporterId}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g. 36AARFB4347G037"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "12px",
            background: "#1A73E8",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Updating Transporter..." : "Update Transporter"}
        </button>
      </form>

      {errorMsg && (
        <div style={{ marginTop: "20px", padding: "12px", background: "#FFEBE9", color: "#D93025", border: "1px solid #FFC1C0", borderRadius: "6px" }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {response && (
        <div style={{ marginTop: "20px", padding: "16px", background: "#E6F4EA", color: "#137333", border: "1px solid #CEEAD6", borderRadius: "6px" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Transporter Updated Successfully!</h3>
          <p style={{ margin: "4px 0" }}><strong>E-Way Bill No:</strong> {response.data?.ewayBillNo}</p>
          <p style={{ margin: "4px 0" }}><strong>New Transporter ID:</strong> {response.data?.transporterId}</p>
          <p style={{ margin: "4px 0" }}><strong>Updated Date:</strong> {response.data?.transUpdateDate}</p>
          <p style={{ margin: "4px 0" }}><strong>Status Description:</strong> {response.status_desc}</p>
        </div>
      )}
    </div>
  );
};

const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #CCC", borderRadius: "6px", boxSizing: "border-box" };

export default UpdateTransporter;