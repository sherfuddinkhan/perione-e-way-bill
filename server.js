const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================================================
// MIDDLEWARE SETUP
// =========================================================================
app.use(cors());
app.use(express.json());

// Base Configuration Defaults
const BASE_URL = process.env.BASE_URL || "https://staging.perione.in/ewaybillapi/v1.03/ewayapi";
const AUTH_URL = process.env.AUTH_URL || "https://staging.perione.in/ewaybillapi/v1.03/authenticate";
const DEFAULT_EMAIL = process.env.EMAIL || "sherfuddin.phd@gmail.com";

// =========================================================================
// 1. AUTHENTICATION
// =========================================================================
app.get("/api/authenticate", async (req, res) => {
  try {
    const email = req.query.email || DEFAULT_EMAIL;
    const username = req.query.username || process.env.USERNAME || "Btg";
    const password = req.query.password || process.env.PASSWORD || "Btg@123";

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || process.env.IP_ADDRESS || "103.88.236.42",
      client_id: req.headers["client_id"] || process.env.CLIENT_ID || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || process.env.CLIENT_SECRET || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || process.env.GSTIN || "36AARFB4347G037",
      env: req.headers["env"] || process.env.ENVIRONMENT || "sandbox",
    };

    const response = await axios.get(AUTH_URL, {
      params: { email, username, password },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Auth API Upstream Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(
      error.response?.data || {
        status_cd: "0",
        status_desc: "Internal Proxy Authentication Failure",
        message: error.message,
      }
    );
  }
});

// =========================================================================
// 2. GENERATE & MANAGE E-WAY BILLS
// =========================================================================

// Generate E-Way Bill
app.post("/api/generate-ewaybill", async (req, res) => {
  try {
    const payload = req.body;
    const email = req.query.email || payload.email || process.env.EMAIL || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      "Content-Type": "application/json",
      accept: "*/*",
      ip_address: req.headers["ip_address"] || process.env.EWAY_IP || "103.88.236.42",
      client_id: req.headers["client_id"] || process.env.EWAY_CLIENT_ID || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || process.env.EWAY_CLIENT_SECRET || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: payload.fromGstin || req.headers["gstin"] || process.env.GSTIN || "36AARFB4347G037",
      env: req.headers["env"] || process.env.ENVIRONMENT || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/genewaybill?email=${encodeURIComponent(email)}`,
      payload,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("E-Way Bill Generation Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to generate E-Way Bill",
      error: error.response?.data || error.message,
    });
  }
});

// Extend EWB Validity
app.post("/api/extend-validity", async (req, res) => {
  try {
    const payload = req.body;
    const email = req.query.email || process.env.EWAY_EMAIL || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || process.env.EWAY_IP || "103.88.236.42",
      client_id: req.headers["client_id"] || process.env.EWAY_CLIENT_ID || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || process.env.EWAY_CLIENT_SECRET || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || process.env.EWAY_GSTIN || "36AARFB4347G037",
      env: req.headers["env"] || process.env.EWAY_ENV || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/extendvalidity?email=${encodeURIComponent(email)}`,
      payload,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Extend Validity Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to extend validity",
      error: error.response?.data || error.message,
    });
  }
});

// Reject E-Way Bill
app.post("/api/reject-ewaybill", async (req, res) => {
  try {
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/rejewb?email=${encodeURIComponent(email)}`,
      req.body,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Reject EWB Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// Cancel E-Way Bill
app.post("/api/ewaybill/cancel", async (req, res) => {
  try {
    const { ewbNo, cancelRsnCode, cancelRmrk } = req.body;
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/canewb?email=${encodeURIComponent(email)}`,
      {
        ewbNo: Number(ewbNo),
        cancelRsnCode: Number(cancelRsnCode),
        cancelRmrk,
      },
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Cancel EWB Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to cancel E-Way Bill",
      error: error.response?.data || error.message,
    });
  }
});

// Close E-Way Bill (Dynamic Credentials)
app.post("/api/ewaybill/close", async (req, res) => {
  try {
    const {
      email,
      gstin,
      client_id,
      client_secret,
      ip_address,
      env,
      ewbNo,
      closureDate,
      remarks,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !gstin ||
      !client_id ||
      !client_secret ||
      !ewbNo ||
      !closureDate ||
      !remarks
    ) {
      return res.status(400).json({
        error:
          "email, gstin, client_id, client_secret, ewbNo, closureDate and remarks are required",
      });
    }

    const response = await axios.post(
      "https://staging.perione.in/ewaybillapi/v1.03/ewayapi/clsewb",
      {
        ewbNo: Number(ewbNo),
        closureDate,
        remarks,
      },
      {
        params: { email },
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ip_address: ip_address || "0.0.0.0",
          client_id,
          client_secret,
          gstin,
          env: env || "sandbox",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to close E-Way Bill",
      details: error.response?.data || error.message,
    });
  }
});




// =========================================================================
// 3. TRANSPORTER & VEHICLE OPERATIONS
// =========================================================================

// Update Vehicle Details
app.post("/api/ewaybill/update-vehicle", async (req, res) => {
  try {
    const { ewbNo, vehicleNo, fromPlace, fromState, reasonCode, reasonRem, transDocNo, transDocDate, transMode } = req.body;
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/vehewb?email=${encodeURIComponent(email)}`,
      {
        ewbNo: Number(ewbNo),
        vehicleNo,
        fromPlace,
        fromState: Number(fromState),
        reasonCode: String(reasonCode),
        reasonRem,
        transDocNo,
        transDocDate,
        transMode: String(transMode),
      },
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Update Vehicle Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to update vehicle details",
      error: error.response?.data || error.message,
    });
  }
});

// Update Transporter
app.post("/api/ewaybill/update-transporter", async (req, res) => {
  try {
    const { ewbNo, transporterId } = req.body;
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/updatetransporter?email=${encodeURIComponent(email)}`,
      {
        ewbNo: Number(ewbNo),
        transporterId,
      },
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Update Transporter API Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to update transporter",
      error: error.response?.data || error.message,
    });
  }
});

// Get Transporter Details
app.get("/api/gettransporterdetails", async (req, res) => {
  try {
    const { email = DEFAULT_EMAIL, trn_no } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/gettransporterdetails`, {
      params: { email, trn_no },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Get Transporter Details Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to fetch transporter details",
    });
  }
});

// =========================================================================
// 4. CONSOLIDATED EWB & TRIP SHEETS
// =========================================================================

// Generate Consolidated EWB
app.post("/api/ewaybill/generate-consolidated", async (req, res) => {
  try {
    const { fromPlace, fromState, vehicleNo, transMode, transDocNo, transDocDate, tripSheetEwbBills } = req.body;
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/gencewb?email=${encodeURIComponent(email)}`,
      {
        fromPlace,
        fromState: Number(fromState),
        vehicleNo,
        transMode: String(transMode),
        transDocNo,
        transDocDate,
        tripSheetEwbBills,
      },
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Generate Consolidated EWB API Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to generate consolidated E-Way Bill",
      error: error.response?.data || error.message,
    });
  }
});

// Get Trip Sheet
app.get("/api/gettripsheet", async (req, res) => {
  try {
    const { tripSheetNo, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/gettripsheet`, {
      params: { email, tripSheetNo },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to fetch Trip Sheet",
    });
  }
});

// Regenerate Trip Sheet
app.post("/api/regentripsheet", async (req, res) => {
  try {
    const { email = DEFAULT_EMAIL } = req.query;
    const { tripSheetNo, vehicleNo, fromPlace, fromState, reasonCode, reasonRem, transDocNo, transDocDate, transMode } = req.body;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/regentripsheet`,
      {
        tripSheetNo: Number(tripSheetNo),
        vehicleNo,
        fromPlace,
        fromState: Number(fromState),
        reasonCode,
        reasonRem,
        transDocNo,
        transDocDate,
        transMode,
      },
      {
        params: { email },
        headers,
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Regenerate Trip Sheet Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to regenerate Trip Sheet",
    });
  }
});

// =========================================================================
// 5. MULTI-VEHICLE OPERATIONS
// =========================================================================

// Initiate Multi Vehicle
app.post("/api/init-multi", async (req, res) => {
  try {
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/initmulti?email=${encodeURIComponent(email)}`,
      req.body,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// Add Multi Vehicle
app.post("/api/add-multi", async (req, res) => {
  try {
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/addmulti?email=${encodeURIComponent(email)}`,
      req.body,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// Update Multi Vehicle
app.post("/api/update-multi", async (req, res) => {
  try {
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.post(
      `${BASE_URL}/updtmulti?email=${encodeURIComponent(email)}`,
      req.body,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// =========================================================================
// 6. LOOKUPS, FETCHING & REPORTS
// =========================================================================

// Get HSN Details
app.get("/api/ewaybill/hsn-details", async (req, res) => {
  try {
    const { hsncode, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/gethsndetailsbyhsncode`, {
      params: { email, hsncode },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("HSN Details Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to fetch HSN details",
      error: error.response?.data || error.message,
    });
  }
});

// Get GSTIN Details
app.get("/api/ewaybill/gstin-details", async (req, res) => {
  try {
    const { gstin, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/getgstindetails`, {
      params: { email, GSTIN: gstin },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("GSTIN Details Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to fetch GSTIN details",
      error: error.response?.data || error.message,
    });
  }
});

// Get Error List
app.get("/api/ewaybill/error-list", async (req, res) => {
  try {
    const email = req.query.email || DEFAULT_EMAIL;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/geterrorlist`, {
      params: { email },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error List Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to fetch error list",
      error: error.response?.data || error.message,
    });
  }
});

// Get E-Way Bill Generated by Consigner
app.get("/api/ewaybill/by-consigner", async (req, res) => {
  try {
    const { docType, docNo, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/getewaybillgeneratedbyconsigner`, {
      params: { email, docType, docNo },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Get By Consigner Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "Failed to fetch EWB by consigner",
      error: error.response?.data || error.message,
    });
  }
});

// Get Single E-Way Bill
app.get("/api/get-ewaybill", async (req, res) => {
  try {
    const { ewbNo, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/getewaybill`, {
      params: { email, ewbNo },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// Get E-Way Bills for Transporter
app.get("/api/get-ewaybills-transporter", async (req, res) => {
  try {
    const { date, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/getewaybillsfortransporter`, {
      params: { email, date },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// Get EWBs for Transporter by GSTIN
app.get("/api/get-ewaybills-transporter-gstin", async (req, res) => {
  try {
    const { Gen_gstin, date, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/getewaybillsfortransporterbygstin`, {
      params: { email, Gen_gstin, date },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// Get EWB Report by Transporter Assigned Date
app.get("/api/get-ewaybill-report-transporter", async (req, res) => {
  try {
    const { date, stateCode, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/getewaybillreportbytransporterassigneddate`, {
      params: { email, date, stateCode },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// Get EWBs by Date
app.get("/api/get-ewaybills-by-date", async (req, res) => {
  try {
    const { date, stateCode, email = DEFAULT_EMAIL } = req.query;

    // Individual Headers
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || "103.88.236.42",
      client_id: req.headers["client_id"] || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || "36AARFB4347G037",
      env: req.headers["env"] || "sandbox",
    };

    const response = await axios.get(`${BASE_URL}/getewaybillsbydate`, {
      params: { email, date, stateCode },
      headers,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(error.response?.data || error.message);
  }
});

// GET E-Way Bills Rejected by Others (Dynamic Credentials)
app.get("/api/ewaybill/rejected-by-others", async (req, res) => {
  try {
    const {
      email,
      date,
      gstin,
      client_id,
      client_secret,
      ip_address,
      env,
    } = req.query;

    // Validate required fields
    if (!email || !date || !gstin || !client_id || !client_secret) {
      return res.status(400).json({
        error:
          "email, date, gstin, client_id and client_secret are required",
      });
    }

    const response = await axios.get(
      "https://staging.perione.in/ewaybillapi/v1.03/ewayapi/getewaybillsrejectedbyothers",
      {
        params: {
          email,
          date,
        },
        headers: {
          accept: "*/*",
          ip_address: ip_address || "0.0.0.0",
          client_id,
          client_secret,
          gstin,
          env: env || "sandbox",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch rejected E-Way Bills",
      details: error.response?.data || error.message,
    });
  }
});

// GET E-Way Bills of Other Party 
app.get("/api/ewaybill/other-party", async (req, res) => {
  try {
    const {
      email,
      date,
      gstin,
      client_id,
      client_secret,
      ip_address,
      env,
    } = req.query;

    // Validate required fields
    if (!email || !date || !gstin || !client_id || !client_secret) {
      return res.status(400).json({
        error:
          "email, date, gstin, client_id and client_secret are required",
      });
    }

    const response = await axios.get(
      "https://staging.perione.in/ewaybillapi/v1.03/ewayapi/getewaybillsofotherparty",
      {
        params: {
          email,
          date,
        },
        headers: {
          accept: "*/*",
          ip_address: ip_address || "0.0.0.0",
          client_id,
          client_secret,
          gstin,
          env: env || "sandbox",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch E-Way Bills of Other Party",
      details: error.response?.data || error.message,
    });
  }
});


// GET E-Way Bills by Date (Dynamic Credentials)
app.get("/api/ewaybill/by-date", async (req, res) => {
  try {
    const {
      email,
      date,
      stateCode,
      gstin,
      client_id,
      client_secret,
      ip_address,
      env,
    } = req.query;

    // Validate required fields
    if (
      !email ||
      !date ||
      !stateCode ||
      !gstin ||
      !client_id ||
      !client_secret
    ) {
      return res.status(400).json({
        error:
          "email, date, stateCode, gstin, client_id and client_secret are required",
      });
    }

    const response = await axios.get(
      "https://staging.perione.in/ewaybillapi/v1.03/ewayapi/getewaybillsbydate",
      {
        params: {
          email,
          date,
          stateCode,
        },
        headers: {
          accept: "*/*",
          ip_address: ip_address || "0.0.0.0",
          client_id,
          client_secret,
          gstin,
          env: env || "sandbox",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch E-Way Bills by Date",
      details: error.response?.data || error.message,
    });
  }
});

// GET E-Way Bills for Transporter by GSTIN (Dynamic Credentials)
app.get("/api/ewaybill/transporter-by-gstin", async (req, res) => {
  try {
    const {
      email,
      Gen_gstin,
      date,
      gstin,
      client_id,
      client_secret,
      ip_address,
      env,
    } = req.query;

    // Validate required fields
    if (
      !email ||
      !Gen_gstin ||
      !date ||
      !gstin ||
      !client_id ||
      !client_secret
    ) {
      return res.status(400).json({
        error:
          "email, Gen_gstin, date, gstin, client_id and client_secret are required",
      });
    }

    const response = await axios.get(
      "https://staging.perione.in/ewaybillapi/v1.03/ewayapi/getewaybillsfortransporterbygstin",
      {
        params: {
          email,
          Gen_gstin,
          date,
        },
        headers: {
          accept: "*/*",
          ip_address: ip_address || "0.0.0.0",
          client_id,
          client_secret,
          gstin,
          env: env || "sandbox",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch E-Way Bills for Transporter by GSTIN",
      details: error.response?.data || error.message,
    });
  }
});



// SERVER START
// =========================================================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});