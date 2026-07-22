import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Ewaybillclients = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState(null);
  const [invoiceData, setInvoiceData] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const getInvoiceData = async () => {
    setLoading(true);
    setError("");

    try {
      const companyValue = localStorage.getItem("userLoginRef") || "6";
      const currentConnectionType = localStorage.getItem("connectionType") || "DEFAULT";
      const currentYear = localStorage.getItem("yearName") || "26-27";

      const payload = {
        orderType: "invoicecumchallan",
        yearName: currentYear,
        companyValue: companyValue,
        customerName: "",
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "*/*",
        ConnectionType: currentConnectionType,
      };

      const response = await axios.post(
        "https://einvoice.fcssoftwares.com/api/OrderList/GetOrderList",
        payload,
        { headers }
      );

      setInvoiceData(response.data || []);
    } catch (err) {
      console.error("Full API Error:", err.response || err);
      setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        "Failed to fetch invoices. Please check connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceData();
  }, []);

  const handleGenerateEinvoice = async (invoice) => {
    // 1. BLOCK OPENING / NAVIGATION IF EWB NUMBER ALREADY EXISTS
    if (invoice?.eWayBillNumber) {
      alert(`E-Way Bill already generated for this invoice: ${invoice.eWayBillNumber}`);
      return; // Stop execution, don't open the next component
    }

    const pid = invoice?.pid;

    if (!pid) {
      alert("PID not found");
      return;
    }

    try {
      setRowLoading(pid);

      const currentConnectionType =
        localStorage.getItem("connectionType") || "DEFAULT";

      const { data } = await axios.get(
        `https://einvoice.fcssoftwares.com/api/OrderList/GetInvoiceDetails/${pid}/invoicecumchallan`,
        {
          headers: {
            accept: "*/*",
            ConnectionType: currentConnectionType,
          },
        }
      );

      localStorage.setItem("selectedInvoice", JSON.stringify(data));
      localStorage.setItem("Selected PID", JSON.stringify(data.pid));

      // 2. NAVIGATE TO SPECIFIED ROUTE ONLY IF EWB IS MISSING
      navigate("/ewaybill/generate-eway-bill", {
        state: {
          invoiceData: data,
          pid,
        },
      });
    } catch (err) {
      console.error("Invoice Details API Error:", err);
      alert("Failed to fetch invoice details.");
    } finally {
      setRowLoading(null);
    }
  };

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoiceData;
    const query = searchQuery.toLowerCase();
    return invoiceData.filter((inv) =>
      inv.clientCompanyName?.toLowerCase().includes(query) ||
      inv.invoiceNumber?.toLowerCase().includes(query) ||
      inv.pid?.toString().includes(query) ||
      inv.mobileNo?.includes(query) ||
      inv.eWayBillNumber?.toString().includes(query)
    );
  }, [invoiceData, searchQuery]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>E-Way Bill Clients</h2>
          <p style={styles.subtitle}>Manage, view, and generate E-Way bills</p>
        </div>
        <button
          onClick={getInvoiceData}
          disabled={loading}
          style={{
            ...styles.btnSecondary,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      <div style={styles.controlsBar}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search customer, invoice #, PID..."
          style={styles.searchInput}
        />
        <span style={styles.countBadge}>
          Showing <b>{filteredInvoices.length}</b> of <b>{invoiceData.length}</b>
        </span>
      </div>

      {error && (
        <div style={styles.errorAlert}>
          ⚠️ <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "50px" }}>#</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Invoice No</th>
              <th style={styles.th}>PID</th>
              <th style={styles.th}>EWB Status</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && invoiceData.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.centerMessage}>
                  Loading invoice data, please wait...
                </td>
              </tr>
            ) : filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, index) => {
                const hasEwb = Boolean(invoice.eWayBillNumber);
                const isProcessing = rowLoading === invoice.pid;

                return (
                  <tr key={invoice.refID || index} style={styles.tr}>
                    <td style={styles.tdMuted}>{index + 1}</td>

                    <td style={styles.td}>
                      <div style={styles.clientName}>
                        {invoice.clientCompanyName || "—"}
                      </div>
                      <div style={styles.clientMobile}>
                        {invoice.mobileNo ? `📱 ${invoice.mobileNo}` : "No Mobile"}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.invoiceBadge}>
                        {invoice.invoiceNumber || "—"}
                      </span>
                    </td>

                    <td style={{ ...styles.td, fontFamily: "monospace" }}>
                      {invoice.pid || "—"}
                    </td>

                    <td style={styles.td}>
                      {hasEwb ? (
                        <span style={styles.statusSuccess}>
                          ✓ {invoice.eWayBillNumber}
                        </span>
                      ) : (
                        <span style={styles.statusPending}>
                          ⏳ Pending
                        </span>
                      )}
                    </td>

                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <button
                        onClick={() => handleGenerateEinvoice(invoice)}
                        disabled={isProcessing || hasEwb}
                        style={{
                          ...(hasEwb ? styles.btnDisabled : styles.btnPrimary),
                          opacity: isProcessing ? 0.6 : 1,
                        }}
                      >
                        {isProcessing
                          ? "Processing..."
                          : hasEwb
                          ? "EWB Generated"
                          : "Generate EWB →"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={styles.centerMessage}>
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    minHeight: "100vh",
    boxSizing: "border-box",
    color: "#1e293b",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "20px 24px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
  },
  subtitle: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  controlsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
    flexWrap: "wrap",
  },
  searchInput: {
    width: "320px",
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  countBadge: {
    fontSize: "13px",
    color: "#64748b",
  },
  errorAlert: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontWeight: "600",
    padding: "12px 16px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "14px 16px",
    verticalAlign: "middle",
  },
  tdMuted: {
    padding: "14px 16px",
    color: "#94a3b8",
    fontSize: "12px",
  },
  clientName: {
    fontWeight: "600",
    color: "#1e293b",
  },
  clientMobile: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },
  invoiceBadge: {
    backgroundColor: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#334155",
  },
  statusSuccess: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-block",
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  btnDisabled: {
    backgroundColor: "#e2e8f0",
    color: "#94a3b8",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "not-allowed",
  },
  btnSecondary: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    border: "1px solid #cbd5e1",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  centerMessage: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },
};

export default Ewaybillclients;