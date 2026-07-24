import React, { useState,useEffect } from 'react';
import { useAuth } from "../../AuthContext";
const GetEwayBillsTransporterByGstin= () => {
  const [formData, setFormData] = useState({
    Gen_gstin: "36AARFB4347G037",
    date: "21/07/2026",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
  const auth = JSON.parse(localStorage.getItem("eway_auth"));

  const today = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

  setFormData((prev) => ({
    ...prev,
    Gen_gstin: auth?.gstin || prev.Gen_gstin,
    date: today,
  }));
}, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setErrorMsg("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/ewaybill/getewaybillsfortransporterbygstin?Gen_gstin=${encodeURIComponent(formData.Gen_gstin)}&date=${encodeURIComponent(formData.date)}`,
       {
      method: "GET",
      headers: {
        ConnectionType: connectionType,
        // or:
        // ConnectionType: localStorage.getItem("ConnectionType"),
      },
    }
      );
      const data = await res.json();

      if (res.ok && data.status_cd === "1") {
        setResponse(data);
      } else {
        setErrorMsg(data.status_desc || "Failed to fetch E-Way Bills by GSTIN.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "24px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#1A73E8", marginBottom: "20px" }}>E-Way Bills for Transporter by GSTIN</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Generator GSTIN (Gen_gstin) *</label>
          <input
            type="text"
            name="Gen_gstin"
            value={formData.Gen_gstin}
            onChange={handleChange}
            placeholder="36AARFB4347G037"
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Date (DD/MM/YYYY) *</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="21/07/2026"
            style={inputStyle}
            required
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
          {loading ? "Fetching..." : "Get E-Way Bills by GSTIN"}
        </button>
      </form>

      {errorMsg && (
        <div style={errorStyle}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {response && (
        <div style={{ marginTop: "25px" }}>
          <h3 style={{ color: "#137333" }}>
            Results ({response.data?.length || 0} E-Way Bills)
          </h3>
          <pre
            style={{
              background: "#f8f9fa",
              padding: "18px",
              borderRadius: "8px",
              overflow: "auto",
              maxHeight: "600px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          >
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #CCC", borderRadius: "6px", boxSizing: "border-box" };
const errorStyle = { marginTop: "20px", padding: "12px", background: "#FFEBE9", color: "#D93025", border: "1px solid #FFC1C0", borderRadius: "6px" };

export default GetEwayBillsTransporterByGstin;