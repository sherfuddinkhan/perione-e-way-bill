import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

// ==========================
// Response Viewer
// ==========================
const ResponseViewer = ({ response }) => {
  if (!response || !response.data) return null;

  const isSuccess = response.success;
  const rows = response.data.data || [];

  // Split into 3 equal groups
  const chunkSize = Math.ceil(rows.length / 3);

  const columns = [
    rows.slice(0, chunkSize),
    rows.slice(chunkSize, chunkSize * 2),
    rows.slice(chunkSize * 2),
  ];

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
          {response.data.status_desc}
        </span>
      </div>

      <div style={styles.columnsContainer}>
        {columns.map((column, colIndex) => (
          <table key={colIndex} style={styles.responseTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Error Code</th>
                <th style={styles.tableHeader}>Error Description</th>
              </tr>
            </thead>

            <tbody>
              {column.map((item, index) => (
                <tr key={index}>
                  <td style={styles.tableCellCode}>
                    {item.errorCode}
                  </td>

                  <td style={styles.tableCellDesc}>
                    {item.errorDesc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

// ==========================
// Main Component
// ==========================
const ErrorList = () => {
  const { connectionType } = useAuth();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get(
        "https://einvoice.fcssoftwares.com/api/perione/ewaybill/error-list",
        {
          headers: {
            ConnectionType: connectionType,
          },
        }
      );

      setResponse({
        success: true,
        data: res.data,
      });
    } catch (err) {
      setResponse({
        success: false,
        data: err.response?.data || {
          status_desc: err.message,
          data: [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.card}>

        <div style={styles.header}>
          <span style={styles.badge}>System</span>

          <h2 style={styles.title}>
            Get Error List
          </h2>

          <p style={styles.subtitle}>
            Load all E-Way Bill error codes and descriptions
          </p>
        </div>

        <button
          onClick={handleFetch}
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Loading Error List..."
            : "Fetch Error List"}
        </button>

        <ResponseViewer response={response} />

      </div>
    </div>
  );
  
};
const styles = {
  outerContainer: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "1800px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "30px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "25px",
  },

  badge: {
    display: "inline-block",
    padding: "5px 14px",
    borderRadius: "20px",
    background: "#dbeafe",
    color: "#2563eb",
    fontWeight: 700,
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "28px",
    fontWeight: 700,
  },

  subtitle: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "20px",
  },

  responseCard: {
    marginTop: "20px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "20px",
  },

  responseHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  statusBadge: {
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "4px",
    letterSpacing: "0.5px",
  },

  responseDesc: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },

  columnsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
    gap: "20px",
    width: "100%",
    alignItems: "start",
  },

  responseTable: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    backgroundColor: "#fff",
  },

  tableHeader: {
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "12px",
    border: "1px solid #d1d5db",
    textAlign: "left",
    fontWeight: 700,
    fontSize: 13,
  },

  tableCellCode: {
    width: "90px",
    padding: "10px",
    border: "1px solid #d1d5db",
    fontWeight: 700,
    textAlign: "center",
    verticalAlign: "top",
    backgroundColor: "#f9fafb",
    fontSize: 13,
  },

  tableCellDesc: {
    padding: "10px",
    border: "1px solid #d1d5db",
    verticalAlign: "top",
    wordBreak: "break-word",
    lineHeight: 1.5,
    fontSize: 13,
    color: "#374151",
  }
}
export default ErrorList;