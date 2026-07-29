import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

// ---------------- Response Viewer ----------------

const ResponseViewer = ({ response }) => {
  if (!response) return null;

  const isSuccess = response.success;

  return (
    <div
      style={{
        ...styles.responseCard,
        backgroundColor: isSuccess ? "#f0fdf4" : "#fef2f2",
        borderColor: isSuccess ? "#bbf7d0" : "#fecaca",
      }}
    >
      <div style={styles.responseHeader}>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: isSuccess ? "#16a34a" : "#dc2626",
          }}
        >
          {isSuccess ? "SUCCESS" : "FAILED"}
        </span>

        <span style={styles.responseDesc}>
          {response.data?.status_desc || "Response Details"}
        </span>
      </div>

      <pre style={styles.jsonViewer}>
        {JSON.stringify(response.data, null, 2)}
      </pre>
    </div>
  );
};

// ---------------- Main Component ----------------

const InitiateMultiVehicleMovement = () => {
  const { authData, connectionType } = useAuth();

  const [headers, setHeaders] = useState({
    gstin: "",
    client_id: "",
    client_secret: "",
    ip_address: "",
    env: "sandbox",
    ConnectionType: "",
  });

  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    ewbNo: "",
    fromPlace: "",
    fromState: "",
    toPlace: "",
    toState: "",
    reasonCode: "",
    reasonRem: "",
    totalQuantity: "",
    unitCode: "",
    transMode: "",
  });

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const authString = localStorage.getItem("eway_auth");

    const auth = authString ? JSON.parse(authString) : {};

    const ewayString = localStorage.getItem("ewaybill_response");

    const ewayBill = ewayString ? JSON.parse(ewayString) : {};

    const tripString = localStorage.getItem("trip_sheet_data");

    const tripSheet = tripString ? JSON.parse(tripString) : {};

    setEmail(authData?.email || auth.email || "");

    setHeaders({
      gstin: authData?.gstin || auth.gstin || "",
      client_id: authData?.client_id || auth.client_id || "",
      client_secret:
        authData?.client_secret || auth.client_secret || "",
      ip_address: authData?.ip_address || auth.ip_address || "",
      env: authData?.env || auth.env || "sandbox",
      ConnectionType: connectionType || "",
    });

    setFormData((prev) => ({
      ...prev,

      ewbNo:
        ewayBill.eWayBillNumber ||
        ewayBill.ewbNo ||
        "",

      fromPlace:
        tripSheet.fromPlace ||
        "",

      fromState:
        tripSheet.fromState ||
        "",

      toPlace:
        tripSheet.toPlace ||
        "",

      toState:
        tripSheet.toState ||
        "",
    }));
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
    let ipAddress = headers.ip_address;

    // Get Public IP if not available
    if (!ipAddress) {
      const ipRes = await axios.get(
        "https://api.ipify.org?format=json"
      );

      ipAddress = ipRes.data.ip;
    }

    const res = await axios.post(
      `https://einvoice.fcssoftwares.com/api/perione/init-multi`,
      formData,
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
          "Content-Type": "application/json",
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
          Initialize Multi Vehicle Movement
        </h1>

        <p style={styles.subtitle}>
          Create Multi Vehicle Group for an E-Way Bill
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        {/* API Connection */}

        <div style={styles.authBox}>

          <h4 style={{marginTop:0}}>
            API Connection Details
          </h4>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>

            <input
              type="email"
              value={email}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>GSTIN</label>

            <input
              type="text"
              name="gstin"
              value={headers.gstin}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Client ID</label>

            <input
              type="text"
              name="client_id"
              value={headers.client_id}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Client Secret
            </label>

            <input
              type="password"
              name="client_secret"
              value={headers.client_secret}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              IP Address
            </label>

            <input
              type="text"
              name="ip_address"
              value={headers.ip_address}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Environment
            </label>

            <select
              name="env"
              value={headers.env}
              onChange={handleHeaderChange}
              style={styles.input}
            >
              <option value="sandbox">
                Sandbox
              </option>

              <option value="live">
                Live
              </option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Connection Type
            </label>

            <input
              type="text"
              name="ConnectionType"
              value={headers.ConnectionType}
              onChange={handleHeaderChange}
              style={styles.input}
            />
          </div>

        </div>

        {/* EWB Number */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            E-Way Bill Number
          </label>

          <input
            type="text"
            name="ewbNo"
            value={formData.ewbNo}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* From Place */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            From Place
          </label>

          <input
            type="text"
            name="fromPlace"
            value={formData.fromPlace}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* From State */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            From State
          </label>

          <input
            type="text"
            name="fromState"
            value={formData.fromState}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* To Place */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            To Place
          </label>

          <input
            type="text"
            name="toPlace"
            value={formData.toPlace}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* To State */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            To State
          </label>

          <input
            type="text"
            name="toState"
            value={formData.toState}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Reason Code */}

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
            <option value="">Select</option>
            <option value="1">Transshipment</option>
            <option value="2">Vehicle Breakdown</option>
            <option value="3">Natural Calamity</option>
            <option value="4">Law & Order</option>
            <option value="5">Others</option>
          </select>
        </div>

        {/* Reason Remark */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Reason Remark
          </label>

          <input
            type="text"
            name="reasonRem"
            value={formData.reasonRem}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Quantity */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Total Quantity
          </label>

          <input
            type="number"
            name="totalQuantity"
            value={formData.totalQuantity}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Unit */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Unit Code
          </label>

          <select
            name="unitCode"
            value={formData.unitCode}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Unit</option>
            <option value="KGS">KGS</option>
            <option value="NOS">NOS</option>
            <option value="PCS">PCS</option>
            <option value="BOX">BOX</option>
            <option value="BAG">BAG</option>
            <option value="CTN">CTN</option>
            <option value="LTR">LTR</option>
            <option value="MTR">MTR</option>
            <option value="MTS">MTS</option>
          </select>
        </div>

        {/* Transport */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Transport Mode
          </label>

          <select
            name="transMode"
            value={formData.transMode}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select</option>
            <option value="1">Road</option>
            <option value="2">Rail</option>
            <option value="3">Air</option>
            <option value="4">Ship</option>
          </select>
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading
            ? "Initializing..."
            : "Initialize Multi Vehicle"}
        </button>

      </form>

      {errorMsg && (
        <div style={styles.errorCard}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      <ResponseViewer response={response} />

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

export default InitiateMultiVehicleMovement;