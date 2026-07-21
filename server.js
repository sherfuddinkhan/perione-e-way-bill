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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});