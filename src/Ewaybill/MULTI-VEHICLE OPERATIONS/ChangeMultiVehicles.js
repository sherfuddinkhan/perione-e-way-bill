import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const ChangeMultiVehicles = () => {

  const { authData, connectionType } = useAuth();

  const [email, setEmail] = useState("");

  const [headers, setHeaders] = useState({
    gstin: "",
    client_id: "",
    client_secret: "",
    ip_address: "",
    env: "sandbox",
    ConnectionType: "",
  });

  const [formData, setFormData] = useState({
    ewbNo: "",
    groupNo: "",
    oldvehicleNo: "",
    newVehicleNo: "",
    oldTranNo: "",
    newTranNo: "",
    fromPlace: "",
    fromState: "",
    reasonCode: "",
    reasonRem: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {

    const auth =
      JSON.parse(localStorage.getItem("eway_auth") || "{}");

    const ewayBill =
      JSON.parse(localStorage.getItem("ewaybill_response") || "{}");

    const tripSheet =
      JSON.parse(localStorage.getItem("trip_sheet_data") || "{}");

    setEmail(authData?.email || auth.email || "");

    setHeaders({
      gstin: authData?.gstin || auth.gstin || "",
      client_id: authData?.client_id || auth.client_id || "",
      client_secret:
        authData?.client_secret || auth.client_secret || "",
      ip_address:
        authData?.ip_address || auth.ip_address || "",
      env:
        authData?.env || auth.env || "sandbox",
      ConnectionType: connectionType || "",
    });

    setFormData({

      ewbNo:
        ewayBill.eWayBillNumber ||
        ewayBill.ewbNo ||
        "",

      groupNo: "",

      oldvehicleNo:
        ewayBill.vehicleNo ||
        tripSheet.vehicleNo ||
        "",

      newVehicleNo: "",

      oldTranNo:
        tripSheet.transDocNo ||
        "",

      newTranNo: "",

      fromPlace:
        tripSheet.fromPlace ||
        "",

      fromState:
        tripSheet.fromStateCode ||
        tripSheet.fromState ||
        "",

      reasonCode: "",

      reasonRem: "",

    });

  }, [authData, connectionType]);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  const handleHeaderChange = (e) => {

    setHeaders({

      ...headers,

      [e.target.name]: e.target.value,

    });

  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setResponse(null);
  setErrorMsg("");

  try {

    // Get Public IP if not available
    let ipAddress = headers.ip_address;

    if (!ipAddress) {
      const ipRes = await axios.get(
        "https://api.ipify.org?format=json"
      );
      ipAddress = ipRes.data.ip;
    }

    const payload = {
      ewbNo: Number(formData.ewbNo),
      groupNo: Number(formData.groupNo),
      oldvehicleNo: formData.oldvehicleNo,
      newVehicleNo: formData.newVehicleNo,
      oldTranNo: formData.oldTranNo,
      newTranNo: formData.newTranNo,
      fromPlace: formData.fromPlace,
      fromState: Number(formData.fromState),
      reasonCode: formData.reasonCode,
      reasonRem: formData.reasonRem,
    };

    console.log("===== UPDATE MULTI VEHICLE REQUEST =====");
    console.log(payload);

    const res = await axios.post(
      "https://einvoice.fcssoftwares.com/api/perione/update-multi",
      payload,
      {
        params: {
          email: email,
        },

        headers: {
          gstin: headers.gstin,
          client_id: headers.client_id,
          client_secret: headers.client_secret,
          ip_address: ipAddress,
          env: headers.env,
          ConnectionType: headers.ConnectionType,
        },
      }
    );

    setResponse({
      success: true,
      data: res.data,
    });

  } catch (err) {

    console.error(err);

    setResponse({
      success: false,
      data:
        err.response?.data || {
          message: err.message,
        },
    });

    setErrorMsg(
      err.response?.data?.message ||
      err.response?.data?.status_desc ||
      err.message
    );

  } finally {

    setLoading(false);

  }
};
  return (
  <div style={styles.outerContainer}>
    <div style={styles.card}>

      {/* Header */}

      <div style={styles.header}>
        <span style={styles.badge}>
          MULTI VEHICLE
        </span>

        <h1 style={styles.title}>
          Change Multi Vehicle
        </h1>

        <p style={styles.subtitle}>
          Update Vehicle Details in Existing Multi Vehicle Group
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        {/* API Connection Details */}

        <div style={styles.authBox}>

          <h4 style={{ marginTop: 0 }}>
            API Connection Details
          </h4>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Email (Query)
            </label>

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          {Object.keys(headers).map((key)=>(

            <div
              key={key}
              style={styles.fieldGroup}
            >

              <label style={styles.label}>
                {key}
              </label>

              <input
                type={
                  key==="client_secret"
                  ? "password"
                  : "text"
                }
                name={key}
                value={headers[key]}
                onChange={handleHeaderChange}
                style={styles.input}
              />

            </div>

          ))}

        </div>

        {/* Request Body */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            E-Way Bill Number
          </label>

          <input
            name="ewbNo"
            value={formData.ewbNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Group Number
          </label>

          <input
            name="groupNo"
            value={formData.groupNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Old Vehicle Number
          </label>

          <input
            name="oldvehicleNo"
            value={formData.oldvehicleNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            New Vehicle Number
          </label>

          <input
            name="newVehicleNo"
            value={formData.newVehicleNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Old Transport Number
          </label>

          <input
            name="oldTranNo"
            value={formData.oldTranNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            New Transport Number
          </label>

          <input
            name="newTranNo"
            value={formData.newTranNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            From Place
          </label>

          <input
            name="fromPlace"
            value={formData.fromPlace}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            From State Code
          </label>

          <input
            name="fromState"
            value={formData.fromState}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Reason Code
          </label>

          <select
            name="reasonCode"
            value={formData.reasonCode}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">
              Select Reason
            </option>

            <option value="1">
              Vehicle Breakdown
            </option>

            <option value="2">
              Transshipment
            </option>

            <option value="3">
              Vehicle Not Available
            </option>

            <option value="4">
              Others
            </option>
          </select>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Reason Remarks
          </label>

          <textarea
            name="reasonRem"
            value={formData.reasonRem}
            onChange={handleChange}
            rows={3}
            style={{
              ...styles.input,
              resize:"vertical"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {
            loading
            ? "Updating..."
            : "Update Multi Vehicle"
          }
        </button>

      </form>

      {errorMsg && (

        <div style={styles.errorCard}>
          <strong>Error:</strong> {errorMsg}
        </div>

      )}

      {response && (

        <div style={styles.successCard}>

          <div style={styles.responseHeader}>

            <span style={styles.statusBadge}>
              {
                response.success
                ? "SUCCESS"
                : "FAILED"
              }
            </span>

            <span style={styles.responseDesc}>
              {
                response.data?.status_desc ||
                "Response"
              }
            </span>

          </div>

          <pre style={styles.jsonViewer}>
            {JSON.stringify(response.data,null,2)}
          </pre>

        </div>

      )}

    </div>
  </div>
);
};

const styles = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
    border: "1px solid #e2e8f0",
    width: "100%",
    maxWidth: "700px",
    padding: "32px",
  },

  header: {
    textAlign: "center",
    marginBottom: "24px",
  },

  badge: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  title: {
    margin: "14px 0 8px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  authBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "8px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "14px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },

  select: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },

  button: {
    width: "100%",
    marginTop: "10px",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  errorCard: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "14px",
  },

  successCard: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "10px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
  },

  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },

  statusBadge: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: "4px 10px",
    borderRadius: "5px",
    fontSize: "11px",
    fontWeight: "700",
  },

  responseDesc: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },

  jsonViewer: {
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    padding: "14px",
    borderRadius: "8px",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "500px",
    fontSize: "12px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};

export default ChangeMultiVehicles;