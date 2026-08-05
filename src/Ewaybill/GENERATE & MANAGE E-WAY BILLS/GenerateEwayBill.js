import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";
//import '../GenerateEwayBill.css';
import { useAuth } from "../../AuthContext";
// --- Helper Form Components ---

const FormField = ({ label, name, value, onChange, type = "text", placeholder, uppercase, selectOptions }) => {
  return (
    <div style={styles.formGroup}>
      {label && <label style={styles.formLabel}>{label}</label>}
      {selectOptions ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={styles.formInput}
        >
          <option value="">Select Option</option>
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Enter details..."}
          style={{
            ...styles.formInput,
            ...(uppercase ? styles.uppercaseInput : {}),
          }}
        />
      )}
    </div>
  );
};

const AddressGroup = ({ title, prefix, data, onChange }) => (
  <div className="address-card">
    <h3 className="address-title">{title}</h3>
    <div className="form-grid-4">
      <FormField label="GSTIN" name={`${prefix}Gstin`} value={data[`${prefix}Gstin`]} onChange={onChange} uppercase />
      <FormField label="Trade Name" name={`${prefix}TrdName`} value={data[`${prefix}TrdName`]} onChange={onChange} />
      <FormField label="Address 1" name={`${prefix}Addr1`} value={data[`${prefix}Addr1`]} onChange={onChange} />
      <FormField label="Address 2" name={`${prefix}Addr2`} value={data[`${prefix}Addr2`]} onChange={onChange} />
      <FormField label="Place" name={`${prefix}Place`} value={data[`${prefix}Place`]} onChange={onChange} />
      <FormField label="Pincode" name={`${prefix}Pincode`} value={data[`${prefix}Pincode`]} onChange={onChange} type="number" />
      <FormField label="State Code" name={`${prefix}StateCode`} value={data[`${prefix}StateCode`]} onChange={onChange} type="number" />
      <FormField label="Act State Code" name={`act${prefix.charAt(0).toUpperCase() + prefix.slice(1)}StateCode`} value={data[`act${prefix.charAt(0).toUpperCase() + prefix.slice(1)}StateCode`]} onChange={onChange} type="number" />
    </div>
  </div>
);

const SuccessModal = ({ result }) => {
  const { ewayBillNo, ewayBillDate, validUpto } = result?.data || {};
  return (
    <div className="success-banner">
      <div className="success-card">
        <div className="success-header">
          <span style={{ fontSize: '1.5rem' }}>🎉</span>
          <h3>E-Way Bill Generated Successfully!</h3>
        </div>
        <div className="success-details">
          <div>
            <span className="detail-label">E-Way Bill No</span>
            <span className="detail-val" style={{ fontFamily: 'monospace' }}>{ewayBillNo}</span>
          </div>
          <div>
            <span className="detail-label">Generated Date</span>
            <span className="detail-val">{ewayBillDate}</span>
          </div>
          <div>
            <span className="detail-label">Valid Until</span>
            <span className="detail-val" style={{ color: '#15803d' }}>{validUpto}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Payload Definition ---

const DEFAULT_PAYLOAD = {

  // =====================================================
  // DOCUMENT DETAILS
  // =====================================================

  supplyType: "O",              // Outward Supply
  subSupplyType: "1",            // Supply Type
  subSupplyDesc: "",

  docType: "INV",                // Invoice
  docNo: "Perione-1",
  docDate: "05/06/2026",


  // =====================================================
  // SUPPLIER / CONSIGNOR DETAILS
  // =====================================================

  fromGstin: "36AARFB4347G037",
  fromTrdName: "Welton",

  fromAddress1: "2ND CROSS NO 59 19 A",
  fromAddress2: "GROUND FLOOR OSBORNE ROAD",

  fromPlace: "Hyderabad",
  fromPincode: 500081,

  fromStateCode: 36,
  actualFromStateCode: 36,


  // =====================================================
  // BUYER / CONSIGNEE DETAILS
  // =====================================================

  toGstin: "",
  toTrdName: "",

  toAddress1: "",
  toAddress2: "",

  toPlace: "",
  toPincode: "",

  toStateCode: "",
  actualToStateCode: "",


  // =====================================================
  // TRANSACTION DETAILS
  // =====================================================

  transactionType: 4,


  // =====================================================
  // SHIP TO DETAILS
  // =====================================================

  shipToGSTIN: "URP",

  shipToTradeName: "Perione",

  shipToAddress1: "Madhapur",
  shipToAddress2: "HITEC City",

  shipToPlace: "Hyderabad",
  shipToPincode: 500081,

  shipToStateCode: 36,


  // =====================================================
  // INVOICE VALUE SUMMARY
  // =====================================================

  mainHsnCode: 100610,

  taxableValue: 100,

  cgstValue: 2.5,
  sgstValue: 2.5,
  igstValue: 0,

  cessValue: 0,
  cessNonAdvolValue: 0,

  otherValue: 0,

  totalInvoiceValue: 105,


  // =====================================================
  // TRANSPORT DETAILS
  // =====================================================

  transporterId: "36AARFB4347G037",
  transporterName: "Welton Logistics",

  transportDocumentNo: "LR123456",
  transportMode: "1",

  transportDistance: "25",

  transportDocumentDate: "05/06/2026",

  vehicleNumber: "TS09AB1234",
  vehicleType: "R",


  // =====================================================
  // ITEM DETAILS
  // =====================================================

  itemList: [
    {
      productName: "Rice",
      productDescription: "Rice",

      hsnCode: 100610,

      quantity: 1,
      unit: "KGS",

      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,

      cessRate: 0,
      cessNonAdvolRate: 0,

      taxableAmount: 100
    }
  ]

};

// --- Main Component ---

const GenerateEwayBill = () => {
   const {
    isLoggedIn,
    authData,
    logout,
    connectionType,
    setConnectionType,
  } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_PAYLOAD);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  const location = useLocation();
  const { invoiceData } = location.state || {};
  console.log("invoicedata",invoiceData)

useEffect(() => {
  if (!invoiceData) return;

  setFormData((prev) => {
    // Prepare item list using actual invoice data
   const itemList =
  invoiceData.invoiceProductDetails?.map((item) => {

    const quantity = Number(item.quantity || 0);
    const hsnCode = Number(item.hsncode || 100610);
    const taxableAmount = Number(item.totalAmount || 0);

    const gstRate = Number(item.gstPer || 0);

    // Supplier State
    const fromState = Number(
      invoiceData.stateCode ||
      invoiceData.companyBranches?.stateCode ||
      invoiceData.fromStateCode ||
      0
    );

    // Buyer State
    const toState = Number(
      invoiceData.buyerClients?.masterStateNames?.stateCode ||
      invoiceData.toStateCode ||
      0
    );


    // Check transaction type
    const isIntraState = fromState === toState;
    const isInterState = fromState !== toState;


    let cgstRate = 0;
    let sgstRate = 0;
    let igstRate = 0;


    // INTRA STATE
    // Example: Telangana -> Telangana
    if (isIntraState) {

      cgstRate = gstRate / 2;
      sgstRate = gstRate / 2;
      igstRate = 0;

    }


    // INTER STATE
    // Example: Telangana -> Karnataka
    else if (isInterState) {

      cgstRate = 0;
      sgstRate = 0;
      igstRate = gstRate;

    }


    return {

      productName: item.description || "",
      productDesc: item.description || "",

      hsnCode,

      quantity,
      qtyUnit: item.uom || "NOS",

      // GST Rates
      cgstRate,
      sgstRate,
      igstRate,

      cessRate: 0,
      cessNonadvol: 0,

      taxableAmount
    };

  }) || prev.itemList;

    // Calculate invoice totals
    const totalValue = itemList.reduce(
      (sum, item) => sum + Number(item.taxableAmount || 0),
      0
    );

    const cgstValue = Number(
      invoiceData.invoiceProductDetails?.reduce(
        (sum, item) => sum + Number(item.cgstAmount || 0),
        0
      ) || 0
    );

    const sgstValue = Number(
      invoiceData.invoiceProductDetails?.reduce(
        (sum, item) => sum + Number(item.sgstAmount || 0),
        0
      ) || 0
    );

    const igstValue = Number(
      invoiceData.invoiceProductDetails?.reduce(
        (sum, item) => sum + Number(item.igstAmount || 0),
        0
      ) || 0
    );

    const cessValue = 0;

    const totInvValue = Number(invoiceData.invoiceProductDetails?.reduce((sum, item) => sum + Number(item.afterGSTAmount || 0),0) || totalValue + cgstValue + sgstValue + igstValue);

  return {
  ...prev,

  //========================================
  // DOCUMENT DETAILS
  //========================================
  docType: "INV",
  docNo: invoiceData.invoiceNumber || prev.docNo,
  docDate: invoiceData.deliveryNoteDate
    ? invoiceData.deliveryNoteDate.replace(/-/g, "/")
    : prev.docDate,

  //========================================
  // SUPPLIER (BILL FROM)
  //========================================
  fromGstin: invoiceData.gstin || prev.fromGstin,
  fromTrdName: invoiceData.company_Name || prev.fromTrdName,

  fromAddr1:
    invoiceData.company_Address ||
    invoiceData.companyBranches?.officeAddress ||
    prev.fromAddr1,

  fromAddr2:
    invoiceData.companyBranches?.address2 ||
    prev.fromAddr2,

  fromPlace:
    invoiceData.company_City ||
    prev.fromPlace,

  fromPincode: Number(
    invoiceData.company_PINCode ||
      prev.fromPincode
  ),

  actFromStateCode: Number(
    invoiceData.stateCode ||
      prev.actFromStateCode
  ),

  fromStateCode: Number(
    invoiceData.stateCode ||
      prev.fromStateCode
  ),

 //========================================
// BILL TO
//========================================
toGstin:
  invoiceData?.clients?.gstin||
  prev.toGstin,

toTrdName:
  invoiceData.clients?.companyName ||
  prev.toTrdName,

toAddr1:
  invoiceData.clients.officeAddress ||
  prev.toAddr1,

toAddr2:
  invoiceData.clients?.poBox ||
  prev.toAddr2,

toPlace:
  invoiceData.clients?.masterStateNames?.stateName ||
  invoiceData.clients?.city ||
  prev.toPlace,

toPincode: Number(
  invoiceData.clients?.pinCode ||
  invoiceData.clients?.poBox ||
  prev.toPincode
),

actToStateCode: Number(
  invoiceData.clients?.masterStateNames?.stateCode ||
  prev.actToStateCode
),

toStateCode: Number(
  invoiceData.clients?.masterStateNames?.stateCode ||
  prev.toStateCode
),


// ================= SHIP TO =================

...(invoiceData?.transactionType === "Bill To - Ship To" ||
   invoiceData?.transactionType === "COMBINED"
? {

    shipToGSTIN:invoiceData?.buyerClients?.gstin || "",
    shipToTradeName:invoiceData?.buyerClients?.companyName?.trim() || "",
    shipToAddr1:invoiceData?.buyerClients?.officeAddress?.trim() || "",
    shipToAddr2:invoiceData?.buyerClients?.poBox?.trim() ||"",
    shipToPlace:invoiceData?.buyerClients?.masterStateNames?.stateName || "",
    shipToPincode:invoiceData?.buyerClients?.pinCode ||
        invoiceData?.buyerClients?.poBox?.match(/\b\d{6}\b/)?.[0] ||
        "",
    shipToStateCode:invoiceData?.buyerClients?.masterStateNames?.stateCode ||
        ""

}
: {}),



  //========================================
  // TRANSPORT
  //========================================
  transporterId:
    invoiceData.transporterID ||
    prev.transporterId,

  transporterName:
    invoiceData.transporterName ||
    invoiceData.transport ||
    prev.transporterName,

  transDocNo:
    invoiceData.transporterDocNo ||
    prev.transDocNo,

  transMode:
    invoiceData.transportMode === "Road"
      ? "1"
      : prev.transMode,

  transDistance:
    invoiceData.distance ||
    prev.transDistance,

  vehicleNo:
    invoiceData.vehicleNo ||
    prev.vehicleNo,

  //========================================
  // ITEMS
  //========================================
  itemList,

  //========================================
  // TOTALS
  //========================================
  hsnCode: itemList[0]?.hsnCode || prev.hsnCode,

  totalValue,
  cgstValue,
  sgstValue,
  igstValue,
  cessValue,
  totInvValue,

  otherValue: 0,
  cessNonAdvolValue: 0,
};
  });
}, [invoiceData]);

const handleSaveEwayBillResponse = async (generatedResponse) => {
  try {
    if (!generatedResponse) {
      alert("No E-Way Bill response available.");
      return false;
    }

    // API response
    const apiData = generatedResponse.data || generatedResponse;

    // Get invoice details
    const invoiceData = JSON.parse(
      localStorage.getItem("selectedInvoice") || "{}"
    );

    const dynamicId =
      invoiceData?.keyID ||
      location.state?.pid ||
      0;

    // Payload for UpdateEWBetailsToInvoice API
    const payload = {
      id: Number(dynamicId),
      eWayBillNumber: String(apiData.ewayBillNo || ""),
      barcode: "",      // Update if your API returns barcode
      ewayQrCode: ""    // Update if your API returns QR Code
    };

    console.log("Updating Invoice with EWB:", payload);

    const response = await axios.put(
      "https://einvoice.fcssoftwares.com/api/OrderList/UpdateEWBetailsToInvoice",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      }
    );

    console.log("Update Response:", response.data);

    // Optional: Save locally also
    localStorage.setItem(
      "ewaybill_response",
      JSON.stringify({
        ...payload,
        ewayBillDate: apiData.ewayBillDate,
        validUpto: apiData.validUpto,
      })
    );

    alert("E-Way Bill details updated successfully.");

    return true;
  } catch (error) {
    console.error(
      "Error updating E-Way Bill:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      "Failed to update E-Way Bill details."
    );

    return false;
  }
};
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleItemChange = (index, field, value, type) => {
    const updatedItems = [...formData.itemList];
    updatedItems[index][field] = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFormData((prev) => ({ ...prev, itemList: updatedItems }));
  };
       const handleDownloadEWayBill = async () => {
  try {
    console.log("Download button clicked");

    const selectedInvoice = JSON.parse(
      localStorage.getItem("selectedInvoice") || "{}"
    );

    console.log("selectedInvoice:", selectedInvoice);

    const keyID = selectedInvoice?.keyID;

    console.log("keyID:", keyID);

    if (!keyID) {
      alert("keyID not found.");
      return;
    }

    console.log("Getting invoice details...");

    const latest = await axios.get(
      `https://einvoice.fcssoftwares.com/api/OrderList/GetInvoiceDetails/${keyID}/invoicecumchallan`
    );

    console.log("Invoice Details:", latest.data);

    console.log("Downloading PDF...");

    const pdf = await axios.get(
      `https://einvoice.fcssoftwares.com/api/OrderList/GetEWayBillReport/${keyID}`,
      {
        responseType: "blob",
      }
    );

    console.log("PDF Status:", pdf.status);
    console.log("Blob Size:", pdf.data.size);

    const blob = new Blob([pdf.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `EWayBill_${keyID}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Data:", err.response.data);
    }

    alert(err.message);
  }
      };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
  console.log("Received Body:", JSON.stringify(formData));

  const res = await fetch("https://einvoice.fcssoftwares.com/api/perione/generate-ewaybill", {
    method: "POST",
    headers: { "Content-Type": "application/json",
               ConnectionType: connectionType},
    body: JSON.stringify(formData),
  });

  const result = await res.json();

  if (res.ok && result.status_cd === "1") {
    setResponse(result);
// Save response to localStorage
  handleSaveEwayBillResponse(result);
    // Store complete response
    const ewayBillResponse = result;

    console.log("ewayBillResponse", ewayBillResponse);

    localStorage.setItem(
      "ewaybill_response",
      JSON.stringify(ewayBillResponse)
    );

   // Combine EWB response + original form data
  const ewayBillData = {
    // Response fields
    eWayBillNumber: result.data.ewayBillNo,
    ewayBillDate: result.data.ewayBillDate,
    validUpto: result.data.validUpto,
    alert: result.data.alert,

    // Original form fields needed for next components
    vehicleNo: formData.vehicleNo,
    fromPlace: formData.fromPlace,
    fromState: formData.fromStateCode,
    transDocNo: formData.transDocNo,
    transMode: formData.transMode,
    reasonCode: "1",
    reasonRem: "First Time Update"
  };

  localStorage.setItem(
    "ewayBillData",
    JSON.stringify(ewayBillData)
  );
  } else {
    setError(
      result.status_desc ||
      result.message ||
      "E-Way Bill Generation Failed"
    );
  }
} catch (err) {
  setError("Server unreachable. Make sure the Node backend is active.");
} finally {
  setLoading(false);
}
  }
return (
  <div style={styles.ewayContainer}>
    <div style={styles.ewayCard}>
      {/* Header */}
      <header style={styles.ewayHeader}>
        <div>
          <h1 style={styles.ewayTitle}>Generate E-Way Bill</h1>
          <p style={styles.ewaySubtitle}>
            Fill out the form below to generate a new electronic waybill
          </p>
        </div>
        <span style={styles.ewayBadge}>GST System</span>
      </header>

      {/* Form Body */}
      <form onSubmit={handleSubmit} style={styles.ewayForm}>
        {/* 1. Document Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Document Details</h2>
          <div style={styles.formGrid4}>
            <FormField
              label="Supply Type"
              name="supplyType"
              value={formData.supplyType}
              onChange={handleInputChange}
              selectOptions={[
                { label: "Outward", value: "O" },
                { label: "Inward", value: "I" },
              ]}
            />
            <FormField
              label="Sub Supply Type"
              name="subSupplyType"
              value={formData.subSupplyType}
              onChange={handleInputChange}
            />
            <FormField
              label="Sub Supply Desc"
              name="subSupplyDesc"
              value={formData.subSupplyDesc}
              onChange={handleInputChange}
            />
            <FormField
              label="Doc Type"
              name="docType"
              value={formData.docType}
              onChange={handleInputChange}
            />
            <FormField
              label="Doc No"
              name="docNo"
              value={formData.docNo}
              onChange={handleInputChange}
            />
            <FormField
              label="Doc Date"
              name="docDate"
              value={formData.docDate}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
            />
            <FormField
              label="Transaction Type"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="From GSTIN"
              name="fromGstin"
              value={formData.fromGstin}
              onChange={handleInputChange}
              type="text"
            />
          </div>
        </section>

       {/* ===========================================================
   2. Parties & Address Details
=========================================================== */}

<section style={styles.section}>
  <h2 style={styles.sectionTitle}>
    2. Parties & Address Details
  </h2>

  {/* ================= Bill From ================= */}

  <div style={styles.addressCard}>
    <h3 style={styles.addressTitle}>Bill From (Supplier)</h3>

    <div style={styles.formGrid4}>
      <AddressGroup
        title=""
        prefix="from"
        data={formData}
        onChange={handleInputChange}
      />
    </div>
  </div>

  {/* ================= Dispatch From ================= */}

  <div
    style={{
      ...styles.addressCard,
      marginTop: 20,
    }}
  >
    <h3 style={styles.addressTitle}>
      Dispatch From
    </h3>

    <div style={styles.formGrid4}>

      <FormField
        label="Dispatch GSTIN"
        name="dispatchFromGstin"
        value={formData.dispatchFromGstin}
        onChange={handleInputChange}
        uppercase
      />

      <FormField
        label="Trade Name"
        name="dispatchFromTradeName"
        value={formData.dispatchFromTradeName}
        onChange={handleInputChange}
      />

      <FormField
        label="Legal Name"
        name="dispatchFromLegalName"
        value={formData.dispatchFromLegalName}
        onChange={handleInputChange}
      />

      <FormField
        label="Address 1"
        name="dispatchFromAddr1"
        value={formData.dispatchFromAddr1}
        onChange={handleInputChange}
      />

      <FormField
        label="Address 2"
        name="dispatchFromAddr2"
        value={formData.dispatchFromAddr2}
        onChange={handleInputChange}
      />

      <FormField
        label="Place"
        name="dispatchFromPlace"
        value={formData.dispatchFromPlace}
        onChange={handleInputChange}
      />

      <FormField
        label="Pincode"
        name="dispatchFromPincode"
        value={formData.dispatchFromPincode}
        onChange={handleInputChange}
        type="number"
      />

      <FormField
        label="State Code"
        name="dispatchFromStateCode"
        value={formData.dispatchFromStateCode}
        onChange={handleInputChange}
        type="number"
      />

    </div>
  </div>


{/* ================= Bill To ================= */}

<div
  style={{
    ...styles.addressCard,
    marginTop: 20,
  }}
>
  <h3 style={styles.addressTitle}>
    Bill To (Buyer)
  </h3>

  <div style={styles.formGrid4}>


    <FormField
      label="Buyer GSTIN"
      name="toGstin"
      value={formData.toGstin || ""}
      onChange={handleInputChange}
      uppercase
    />


    <FormField
      label="Trade Name"
      name="toTrdName"
      value={formData.toTrdName || ""}
      onChange={handleInputChange}
    />


    <FormField
      label="Legal Name"
      name="buyerLegalName"
      value={formData.buyerLegalName || ""}
      onChange={handleInputChange}
    />


    <FormField
      label="Address 1"
      name="toAddr1"
      value={formData.toAddr1 || ""}
      onChange={handleInputChange}
    />


    <FormField
      label="Address 2"
      name="toAddr2"
      value={formData.toAddr2 || ""}
      onChange={handleInputChange}
    />


    <FormField
      label="Place"
      name="toPlace"
      value={formData.toPlace || ""}
      onChange={handleInputChange}
    />


    <FormField
      label="Pincode"
      name="toPincode"
      value={formData.toPincode || ""}
      onChange={handleInputChange}
      type="number"
    />


    <FormField
      label="State Code"
      name="toStateCode"
      value={formData.toStateCode || ""}
      onChange={handleInputChange}
      type="number"
    />


  </div>

</div>

  {/* ================= Ship To ================= */}

  <div
    style={{
      ...styles.addressCard,
      marginTop: 20,
    }}
  >
    <h3 style={styles.addressTitle}>
      Ship To (Consignee)
    </h3>

    <div style={styles.formGrid4}>

      <FormField
        label="Ship GSTIN"
        name="shipToGstin"
        value={formData.shipToGSTIN}
        onChange={handleInputChange}
        uppercase
      />

      <FormField
        label="Trade Name"
        name="shipToTradeName"
        value={formData.shipToTradeName}
        onChange={handleInputChange}
      />

      <FormField
        label="Legal Name"
        name="shipToLegalName"
        value={formData.shipToLegalName}
        onChange={handleInputChange}
      />

      <FormField
        label="Address 1"
        name="shipToAddr1"
        value={formData.shipToAddr1}
        onChange={handleInputChange}
      />

      <FormField
        label="Address 2"
        name="shipToAddr2"
        value={formData.shipToAddr2}
        onChange={handleInputChange}
      />

      <FormField
        label="Place"
        name="shipToPlace"
        value={formData.shipToPlace}
        onChange={handleInputChange}
      />

      <FormField
        label="Pincode"
        name="shipToPincode"
        value={formData.shipToPincode}
        onChange={handleInputChange}
        type="number"
      />

      <FormField
        label="State Code"
        name="shipToStateCode"
        value={formData.shipToStateCode}
        onChange={handleInputChange}
        type="number"
      />

    </div>
  </div>

</section>

        {/* 3. Invoice Summary */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Total Invoice Summary</h2>
          <div style={styles.formGrid4}>
            <FormField
              label="Total Value"
              name="totalValue"
              value={formData.totalValue}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="CGST Value"
              name="cgstValue"
              value={formData.cgstValue}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="SGST Value"
              name="sgstValue"
              value={formData.sgstValue}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="IGST Value"
              name="igstValue"
              value={formData.igstValue}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="Cess Value"
              name="cessValue"
              value={formData.cessValue}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="Cess Non-Advol Value"
              name="cessNonAdvolValue"
              value={formData.cessNonAdvolValue}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="Other Charges"
              name="otherValue"
              value={formData.otherValue}
              onChange={handleInputChange}
              type="number"
            />
            <FormField
              label="Total Invoice Value"
              name="totInvValue"
              value={formData.totInvValue}
              onChange={handleInputChange}
              type="number"
            />
          </div>
        </section>

        {/* 4. Item Details */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Item Details</h2>
          {formData.itemList.map((item, idx) => (
            <div key={idx} style={styles.itemCard}>
              <div style={styles.itemHeader}>Item #{idx + 1}</div>
              <div style={styles.formGrid4}>
                <FormField
                  label="Product Name"
                  name="productName"
                  value={item.productName}
                  onChange={(e) => handleItemChange(idx, "productName", e.target.value, "text")}
                />
                <FormField
                  label="Product Desc"
                  name="productDesc"
                  value={item.productDesc}
                  onChange={(e) => handleItemChange(idx, "productDesc", e.target.value, "text")}
                />
                <FormField
                  label="HSN Code"
                  name="hsnCode"
                  value={item.hsnCode}
                  onChange={(e) => handleItemChange(idx, "hsnCode", e.target.value, "number")}
                  type="number"
                />
                <FormField
                  label="Quantity"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, "quantity", e.target.value, "number")}
                  type="number"
                />
                <FormField
                  label="Unit"
                  name="qtyUnit"
                  value={item.qtyUnit}
                  onChange={(e) => handleItemChange(idx, "qtyUnit", e.target.value, "text")}
                />
                <FormField
                  label="Taxable Amount"
                  name="taxableAmount"
                  value={item.taxableAmount}
                  onChange={(e) => handleItemChange(idx, "taxableAmount", e.target.value, "number")}
                  type="number"
                />
                <FormField
                  label="CGST Rate (%)"
                  name="cgstRate"
                  value={item.cgstRate}
                  onChange={(e) => handleItemChange(idx, "cgstRate", e.target.value, "number")}
                  type="number"
                />
                <FormField
                  label="SGST Rate (%)"
                  name="sgstRate"
                  value={item.sgstRate}
                  onChange={(e) => handleItemChange(idx, "sgstRate", e.target.value, "number")}
                  type="number"
                />
                <FormField
                  label="IGST Rate (%)"
                  name="igstRate"
                  value={item.igstRate}
                  onChange={(e) => handleItemChange(idx, "igstRate", e.target.value, "number")}
                  type="number"
                />
                <FormField
                  label="Cess Rate (%)"
                  name="cessRate"
                  value={item.cessRate}
                  onChange={(e) => handleItemChange(idx, "cessRate", e.target.value, "number")}
                  type="number"
                />
              </div>
            </div>
          ))}
        </section>

        {/* 5. Logistics Section */}
     {/* 5. Logistics & Transportation Details */}
<section style={styles.section}>
  <h2 style={styles.sectionTitle}>5. Logistics & Transportation Details</h2>
  <div style={styles.formGrid4}>
    <FormField
      label="Transporter ID"
      name="transporterId"
      value={formData.transporterId}
      onChange={handleInputChange}
      uppercase
    />
    <FormField
      label="Transporter Name"
      name="transporterName"
      value={formData.transporterName}
      onChange={handleInputChange}
    />
    <FormField
      label="Transport Mode"
      name="transMode"
      value={formData.transMode}
      onChange={handleInputChange}
      selectOptions={[
        { label: "1 - Road", value: "1" },
        { label: "2 - Rail", value: "2" },
        { label: "3 - Air", value: "3" },
        { label: "4 - Ship", value: "4" },
      ]}
    />
    <FormField
      label="Trans Doc No / LR No"
      name="transDocNo"
      value={formData.transDocNo}
      onChange={handleInputChange}
    />
    <FormField
      label="Trans Doc Date"
      name="transDocDate"
      value={formData.transDocDate}
      onChange={handleInputChange}
      placeholder="DD/MM/YYYY"
    />
    <FormField
      label="Distance (KM)"
      name="transDistance"
      value={formData.transDistance}
      onChange={handleInputChange}
      type="number"
    />
    <FormField
      label="Vehicle No"
      name="vehicleNo"
      value={formData.vehicleNo}
      onChange={handleInputChange}
      uppercase
    />
    <FormField
      label="Vehicle Type"
      name="vehicleType"
      value={formData.vehicleType}
      onChange={handleInputChange}
      selectOptions={[
        { label: "Regular (R)", value: "R" },
        { label: "Over Dimensional Cargo (O)", value: "O" },
      ]}
    />
  </div>
</section>

        {/* Feedback Section */}
        {error && (
          <div style={styles.errorBanner}>
            <span>⚠️</span> {error}
          </div>
        )}
<div style={styles.formActions}>
  <button
    type="submit"
    disabled={loading}
    style={styles.btnSubmit}
  >
    {loading ? "Generating E-Way Bill..." : "Generate E-Way Bill"}
  </button>

  {response?.status_cd === "1" && (
    <div style={styles.downloadButtonGroup}>
      <button
        type="button"
        onClick={handleDownloadEWayBill}
        style={{
          ...styles.downloadButton,
          backgroundColor: "#198754",
        }}
      >
        🚚 Download E-Way Bill
      </button>
    </div>
  )}
</div>
{/* Success Modal */}
{response && <SuccessModal result={response} />}
      </form>
    </div>
  </div>
);
};

const styles = {
  // Main Canvas
  ewayContainer: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    padding: "32px 16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
    color: "#334155",
    boxSizing: "border-box",
  },

  // Main Card Wrapper
  ewayCard: {
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.02)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },

  // Header Component
  ewayHeader: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "28px 36px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ewayTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "-0.025em",
  },

  ewaySubtitle: {
    margin: "6px 0 0 0",
    color: "#94a3b8",
    fontSize: "0.875rem",
  },
  downloadButtonGroup: {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginTop: "20px",
  flexWrap: "wrap",
},

downloadButton: {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  minWidth: "190px",
},

  ewayBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "#34d399",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "6px 14px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },

  // Form Container
  ewayForm: {
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    gap: "36px",
  },

  section: {
    display: "flex",
    flexDirection: "column",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 20px 0",
    paddingBottom: "10px",
    borderBottom: "2px solid #f1f5f9",
  },

  // Grids
  formGrid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px 16px",
  },

  formGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  // Address Cards
  addressCard: {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },

  addressTitle: {
    fontSize: "0.80rem",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 16px 0",
  },

  // Form Controls
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  formLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  },

  formInput: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "0.875rem",
    color: "#0f172a",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    outline: "none",
  },

  formSelect: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "0.875rem",
    color: "#0f172a",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    outline: "none",
  },

  uppercaseInput: {
    textTransform: "uppercase",
    fontFamily: "monospace",
  },

  // Items
  itemCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },

  itemHeader: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: "16px",
  },

  // Actions & Alerts
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },

  btnSubmit: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    padding: "12px 32px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "background-color 0.15s ease",
  },

  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "14px 18px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },

  // Success Modal
  successBanner: {
    backgroundColor: "#f0fdf4",
    borderTop: "1px solid #bbf7d0",
    padding: "24px 36px",
  },

  successCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "20px",
  },

  successHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#166534",
    marginBottom: "16px",
  },

  successDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    backgroundColor: "#f8fafc",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  detailLabel: {
    display: "block",
    fontSize: "0.75rem",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: "4px",
  },

  detailVal: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
  },
};
export default GenerateEwayBill;