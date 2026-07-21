const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =========================================================================
// 1. AUTHENTICATION ENDPOINT
// GET /api/authenticate
// =========================================================================
app.get("/api/authenticate", async (req, res) => {
  try {
    // Extract query params from React request OR fallback to process.env
    const email = req.query.email || process.env.EMAIL || "sherfuddin.phd@gmail.com";
    const username = req.query.username || process.env.USERNAME || "Btg";
    const password = req.query.password || process.env.PASSWORD || "Btg@123";

    // Extract headers sent by React OR fallback to process.env defaults
    const headers = {
      accept: "*/*",
      ip_address: req.headers["ip_address"] || process.env.IP_ADDRESS || "103.88.236.42",
      client_id: req.headers["client_id"] || process.env.CLIENT_ID || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || process.env.CLIENT_SECRET || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: req.headers["gstin"] || process.env.GSTIN || "36AARFB4347G037",
      env: req.headers["env"] || process.env.ENVIRONMENT || "sandbox",
    };

    const targetUrl = "https://staging.perione.in/ewaybillapi/v1.03/authenticate";

    const response = await axios.get(targetUrl, {
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
// 2. GENERATE E-WAY BILL ENDPOINT
// POST /api/generate-ewaybill
// =========================================================================
const EWAY_API_BASE_URL = "https://staging.perione.in/ewaybillapi/v1.03/ewayapi/genewaybill";

app.post("/api/generate-ewaybill", async (req, res) => {
  try {
    const payload = req.body;

    // Email extracted dynamically from query, body, or fallback default
    const email = req.query.email || payload.email || process.env.EMAIL || "sherfuddin.phd@gmail.com";

    const headers = {
      "Content-Type": "application/json",
      accept: "*/*",
      ip_address: req.headers["ip_address"] || process.env.EWAY_IP || "103.88.236.42",
      client_id: req.headers["client_id"] || process.env.EWAY_CLIENT_ID || "PEWAYS3ad9cc820da802c1265893161c36b3cd",
      client_secret: req.headers["client_secret"] || process.env.EWAY_CLIENT_SECRET || "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
      gstin: payload.fromGstin || req.headers["gstin"] || process.env.GSTIN || "36AARFB4347G037",
      env: req.headers["env"] || process.env.ENVIRONMENT || "sandbox",
    };

    const targetUrl = `${EWAY_API_BASE_URL}?email=${encodeURIComponent(email)}`;

    const response = await axios.post(targetUrl, payload, { headers });

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

app.post('/api/ewaybill/update-vehicle', async (req, res) => {
  try {
    const {
      ewbNo,
      vehicleNo,
      fromPlace,
      fromState,
      reasonCode,
      reasonRem,
      transDocNo,
      transDocDate,
      transMode,
    } = req.body;

    const targetUrl =
      'https://staging.perione.in/ewaybillapi/v1.03/ewayapi/vehewb?email=sherfuddin.phd%40gmail.com';

    const response = await axios.post(
      targetUrl,
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
      {
        headers: {
          'accept': '*/*',
          'ip_address': '103.88.236.42',
          'client_id': 'PEWAYS3ad9cc820da802c1265893161c36b3cd',
          'client_secret': 'PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e',
          'gstin': '36AARFB4347G037',
          'Content-Type': 'application/json',
          'env': 'sandbox',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('E-Way Bill API Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to update vehicle details',
      error: error.response?.data || error.message,
    });
  }
});


app.post('/api/ewaybill/generate-consolidated', async (req, res) => {
  try {
    const {
      fromPlace,
      fromState,
      vehicleNo,
      transMode,
      transDocNo,
      transDocDate,
      tripSheetEwbBills,
    } = req.body;

    const targetUrl =
      'https://staging.perione.in/ewaybillapi/v1.03/ewayapi/gencewb?email=sherfuddin.phd%40gmail.com';

    const response = await axios.post(
      targetUrl,
      {
        fromPlace,
        fromState: Number(fromState),
        vehicleNo,
        transMode: String(transMode),
        transDocNo,
        transDocDate,
        // Array of E-Way Bill objects e.g. [{ ewbNo: "171012148940" }]
        tripSheetEwbBills,
      },
      {
        headers: {
          'accept': '*/*',
          'ip_address': '103.88.236.42',
          'client_id': 'PEWAYS3ad9cc820da802c1265893161c36b3cd',
          'client_secret': 'PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e',
          'gstin': '36AARFB4347G037',
          'Content-Type': 'application/json',
          'env': 'sandbox',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Generate Consolidated EWB API Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to generate consolidated E-Way Bill',
      error: error.response?.data || error.message,
    });
  }
});


app.post('/api/ewaybill/update-transporter', async (req, res) => {
  try {
    const { ewbNo, transporterId } = req.body;

    const targetUrl =
      'https://staging.perione.in/ewaybillapi/v1.03/ewayapi/updatetransporter?email=sherfuddin.phd%40gmail.com';

    const response = await axios.post(
      targetUrl,
      {
        ewbNo: Number(ewbNo),
        transporterId,
      },
      {
        headers: {
          'accept': '*/*',
          'ip_address': '103.88.236.42',
          'client_id': 'PEWAYS3ad9cc820da802c1265893161c36b3cd',
          'client_secret': 'PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e',
          'gstin': '36AARFB4347G037',
          'Content-Type': 'application/json',
          'env': 'sandbox',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Update Transporter API Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to update transporter',
      error: error.response?.data || error.message,
    });
  }
});


// Shared headers for PeriOne Sandbox API
const COMMON_HEADERS = {
  'accept': '*/*',
  'ip_address': '103.88.236.42',
  'client_id': 'PEWAYS3ad9cc820da802c1265893161c36b3cd',
  'client_secret': 'PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e',
  'gstin': '36AARFB4347G037',
  'env': 'sandbox',
};

const BASE_URL = 'https://staging.perione.in/ewaybillapi/v1.03/ewayapi';
const DEFAULT_EMAIL = 'sherfuddin.phd@gmail.com';

// -------------------------------------------------------------
// 1. Cancel E-Way Bill
// -------------------------------------------------------------
app.post('/api/ewaybill/cancel', async (req, res) => {
  try {
    const { ewbNo, cancelRsnCode, cancelRmrk } = req.body;
    const url = `${BASE_URL}/canewb?email=${encodeURIComponent(DEFAULT_EMAIL)}`;

    const response = await axios.post(
      url,
      {
        ewbNo: Number(ewbNo),
        cancelRsnCode: Number(cancelRsnCode),
        cancelRmrk,
      },
      { headers: { ...COMMON_HEADERS, 'Content-Type': 'application/json' } }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Cancel EWB Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to cancel E-Way Bill',
      error: error.response?.data || error.message,
    });
  }
});

// -------------------------------------------------------------
// 2. Get HSN Details
// -------------------------------------------------------------
app.get('/api/ewaybill/hsn-details', async (req, res) => {
  try {
    const { hsncode } = req.query;
    const url = `${BASE_URL}/gethsndetailsbyhsncode?email=${encodeURIComponent(
      DEFAULT_EMAIL
    )}&hsncode=${hsncode}`;

    const response = await axios.get(url, { headers: COMMON_HEADERS });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('HSN Details Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to fetch HSN details',
      error: error.response?.data || error.message,
    });
  }
});

// -------------------------------------------------------------
// 3. Get GSTIN Details
// -------------------------------------------------------------
app.get('/api/ewaybill/gstin-details', async (req, res) => {
  try {
    const { gstin } = req.query;
    const url = `${BASE_URL}/getgstindetails?email=${encodeURIComponent(
      DEFAULT_EMAIL
    )}&GSTIN=${gstin}`;

    const response = await axios.get(url, { headers: COMMON_HEADERS });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('GSTIN Details Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to fetch GSTIN details',
      error: error.response?.data || error.message,
    });
  }
});

// -------------------------------------------------------------
// 4. Get Error List
// -------------------------------------------------------------
app.get('/api/ewaybill/error-list', async (req, res) => {
  try {
    const url = `${BASE_URL}/geterrorlist?email=${encodeURIComponent(DEFAULT_EMAIL)}`;
    const response = await axios.get(url, { headers: COMMON_HEADERS });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error List Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to fetch error list',
      error: error.response?.data || error.message,
    });
  }
});

// -------------------------------------------------------------
// 5. Get E-Way Bill Generated by Consigner
// -------------------------------------------------------------
app.get('/api/ewaybill/by-consigner', async (req, res) => {
  try {
    const { docType, docNo } = req.query;
    const url = `${BASE_URL}/getewaybillgeneratedbyconsigner?email=${encodeURIComponent(
      DEFAULT_EMAIL
    )}&docType=${docType}&docNo=${encodeURIComponent(docNo)}`;

    const response = await axios.get(url, { headers: COMMON_HEADERS });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Get By Consigner Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || 'Failed to fetch EWB by consigner',
      error: error.response?.data || error.message,
    });
  }
});




const headers = {
  accept: "*/*",
  ip_address: "103.88.236.42",
  client_id: "PEWAYS3ad9cc820da802c1265893161c36b3cd",
  client_secret: "PEWAYS1c2a32665f93c1277cf8ce2d9bbe100e",
  gstin: "36AARFB4347G037",
  "Content-Type": "application/json",
  env: "sandbox",
};

// Reject E-Way Bill
app.post("/api/reject-ewaybill", async (req, res) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/rejewb?email=${EMAIL}`,
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Cancel E-Way Bill
app.post("/api/cancel-ewaybill", async (req, res) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/canewb?email=${EMAIL}`,
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Get E-Way Bill by Number
app.get("/api/get-ewaybill", async (req, res) => {
  try {
    const { ewbNo } = req.query;
    const response = await axios.get(
      `${BASE_URL}/getewaybill?email=${EMAIL}&ewbNo=${ewbNo}`,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Get E-Way Bills for Transporter
app.get("/api/get-ewaybills-transporter", async (req, res) => {
  try {
    const { date } = req.query;
    const response = await axios.get(
      `${BASE_URL}/getewaybillsfortransporter?email=${EMAIL}&date=${date}`,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Get E-Way Bills for Transporter by GSTIN
app.get(
  "/api/get-ewaybills-transporter-gstin",
  async (req, res) => {
    try {
      const { Gen_gstin, date } = req.query;
      const response = await axios.get(
        `${BASE_URL}/getewaybillsfortransporterbygstin?email=${EMAIL}&Gen_gstin=${Gen_gstin}&date=${date}`,
        { headers }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json(error.response?.data || error.message);
    }
  }
);

// Get E-Way Bill Report by Transporter Assigned Date
app.get(
  "/api/get-ewaybill-report-transporter",
  async (req, res) => {
    try {
      const { date, stateCode } = req.query;
      const response = await axios.get(
        `${BASE_URL}/getewaybillreportbytransporterassigneddate?email=${EMAIL}&date=${date}&stateCode=${stateCode}`,
        { headers }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json(error.response?.data || error.message);
    }
  }
);

// Get E-Way Bills by Date
app.get("/api/get-ewaybills-by-date", async (req, res) => {
  try {
    const { date, stateCode } = req.query;
    const response = await axios.get(
      `${BASE_URL}/getewaybillsbydate?email=${EMAIL}&date=${date}&stateCode=${stateCode}`,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Initiate Multi Vehicle
app.post("/api/init-multi", async (req, res) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/initmulti?email=${EMAIL}`,
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Add Multi Vehicle
app.post("/api/add-multi", async (req, res) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/addmulti?email=${EMAIL}`,
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Update Multi Vehicle
app.post("/api/update-multi", async (req, res) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/updtmulti?email=${EMAIL}`,
      req.body,
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// GET - E-Way Bills for Transporter by GSTIN
app.get('/api/ewaybill/getewaybillsfortransporterbygstin', async (req, res) => {
  try {
    const { Gen_gstin, date } = req.query;
    const response = await api.get(
      `/getewaybillsfortransporterbygstin?email=${process.env.EMAIL}&Gen_gstin=${encodeURIComponent(Gen_gstin)}&date=${encodeURIComponent(date)}`,
      config
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});