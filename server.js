const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================================================
// COMMON CONFIG
// ==========================================================
const BASE_URL = "https://staging.perione.in/ewaybillapi/v1.03";
const DEFAULT_EMAIL = process.env.EMAIL || "sherfuddin.phd@gmail.com";

const getHeaders = (req, gstinFromBody = null) => ({
  accept: "*/*",
  "Content-Type": "application/json",
  ip_address: req.headers["ip_address"] || process.env.IP_ADDRESS,
  client_id: req.headers["client_id"] || process.env.CLIENT_ID,
  client_secret: req.headers["client_secret"] || process.env.CLIENT_SECRET,
  gstin: gstinFromBody || req.headers["gstin"] || process.env.GSTIN,
  env: req.headers["env"] || process.env.ENVIRONMENT || "sandbox",
});

const callApi = async (req, res, method, endpoint, payload = null, params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data: payload,
      params: { email: DEFAULT_EMAIL, ...params },
      headers: getHeaders(req, payload?.fromGstin),
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(`${endpoint} Error:`, error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.status_desc || "API request failed",
      error: error.response?.data || error.message,
    });
  }
};

// ==========================================================
// 1. AUTHENTICATION API
// GET /api/authenticate
// ==========================================================
app.get("/api/authenticate", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/authenticate`, {
      params: {
        email: req.query.email || DEFAULT_EMAIL,
        username: req.query.username || process.env.USERNAME,
        password: req.query.password || process.env.PASSWORD,
      },
      headers: getHeaders(req),
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// ==========================================================
// 2. GENERATE E-WAY BILL
// POST /api/ewaybill/generate
// ==========================================================
app.post("/api/ewaybill/generate", (req, res) =>
  callApi(req, res, "post", "/ewayapi/genewaybill", req.body)
);

// ==========================================================
// 3. UPDATE PART-B / VEHICLE NUMBER
// POST /api/ewaybill/update-vehicle
// ==========================================================
app.post("/api/ewaybill/update-vehicle", (req, res) =>
  callApi(req, res, "post", "/ewayapi/vehewb", req.body)
);

// ==========================================================
// 4. GENERATE CONSOLIDATED E-WAY BILL
// POST /api/ewaybill/generate-consolidated
// ==========================================================
app.post("/api/ewaybill/generate-consolidated", (req, res) =>
  callApi(req, res, "post", "/ewayapi/gencewb", req.body)
);

// ==========================================================
// 5. CANCEL E-WAY BILL
// POST /api/ewaybill/cancel
// ==========================================================
app.post("/api/ewaybill/cancel", (req, res) =>
  callApi(req, res, "post", "/ewayapi/canewb", req.body)
);

// ==========================================================
// 6. CLOSURE E-WAY BILL
// POST /api/ewaybill/closure
// ==========================================================
app.post("/api/ewaybill/closure", (req, res) =>
  callApi(req, res, "post", "/ewayapi/closureewb", req.body)
);

// ==========================================================
// 7. REJECT E-WAY BILL
// POST /api/ewaybill/reject
// ==========================================================
app.post("/api/ewaybill/reject", (req, res) =>
  callApi(req, res, "post", "/ewayapi/rejewb", req.body)
);

// ==========================================================
// 8. UPDATE TRANSPORTER
// POST /api/ewaybill/update-transporter
// ==========================================================
app.post("/api/ewaybill/update-transporter", (req, res) =>
  callApi(req, res, "post", "/ewayapi/updatetransporter", req.body)
);

// ==========================================================
// 9. EXTEND VALIDITY OF E-WAY BILL
// POST /api/ewaybill/extend-validity
// ==========================================================
app.post("/api/ewaybill/extend-validity", (req, res) =>
  callApi(req, res, "post", "/ewayapi/extendvalidity", req.body)
);

// ==========================================================
// 10. REGENERATE CONSOLIDATED E-WAY BILL
// POST /api/ewaybill/regenerate-tripsheet
// ==========================================================
app.post("/api/ewaybill/regenerate-tripsheet", (req, res) =>
  callApi(req, res, "post", "/ewayapi/regentripsheet", req.body)
);

// ==========================================================
// 11. GET E-WAY BILL DETAILS
// GET /api/ewaybill/details
// ==========================================================
app.get("/api/ewaybill/details", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybill", null, {
    ewbNo: req.query.ewbNo,
  })
);

// ==========================================================
// 12. GET E-WAY BILL FOR TRANSPORTER BY DATE
// ==========================================================
app.get("/api/ewaybill/transporter-by-date", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybillsfortransporter", null, {
    date: req.query.date,
  })
);

// ==========================================================
// 13. GET E-WAY BILLS FOR TRANSPORTER BY GSTIN
// ==========================================================
app.get("/api/ewaybill/transporter-by-gstin", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybillsfortransporterbygstin", null, {
    Gen_gstin: req.query.Gen_gstin,
    date: req.query.date,
  })
);

// ==========================================================
// 14. GET E-WAY BILL REPORT BY TRANSPORTER ASSIGNED DATE
// ==========================================================
app.get("/api/ewaybill/report-transporter", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybillreportbytransporterassigneddate", null, {
    date: req.query.date,
    stateCode: req.query.stateCode,
  })
);

// ==========================================================
// 15. GET E-WAY BILLS BY DATE
// ==========================================================
app.get("/api/ewaybill/by-date", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybillsbydate", null, {
    date: req.query.date,
    stateCode: req.query.stateCode,
  })
);

// ==========================================================
// 16. GET E-WAY BILLS REJECTED BY OTHERS
// ==========================================================
app.get("/api/ewaybill/rejected-by-others", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybillsrejectedbyothers", null, {
    date: req.query.date,
  })
);

// ==========================================================
// 17. GET E-WAY BILLS OF OTHER PARTY
// ==========================================================
app.get("/api/ewaybill/other-party", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybillsofotherparty", null, {
    date: req.query.date,
  })
);

// ==========================================================
// 18. GET CONSOLIDATED E-WAY BILL
// ==========================================================
app.get("/api/ewaybill/tripsheet", (req, res) =>
  callApi(req, res, "get", "/ewayapi/gettripsheet", null, {
    tripSheetNo: req.query.tripSheetNo,
  })
);

// ==========================================================
// 19. GET E-WAY BILL BY CONSIGNER
// ==========================================================
app.get("/api/ewaybill/by-consigner", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getewaybillgeneratedbyconsigner", null, {
    docType: req.query.docType,
    docNo: req.query.docNo,
  })
);

// ==========================================================
// 20. GET ERROR LIST
// ==========================================================
app.get("/api/ewaybill/error-list", (req, res) =>
  callApi(req, res, "get", "/ewayapi/geterrorlist")
);

// ==========================================================
// 21. GET GSTIN DETAILS
// ==========================================================
app.get("/api/ewaybill/gstin-details", (req, res) =>
  callApi(req, res, "get", "/ewayapi/getgstindetails", null, {
    GSTIN: req.query.gstin,
  })
);

// ==========================================================
// 22. GET TRANSPORTER DETAILS
// ==========================================================
app.get("/api/ewaybill/transporter-details", (req, res) =>
  callApi(req, res, "get", "/ewayapi/gettransporterdetails", null, {
    trn_no: req.query.trn_no,
  })
);

// ==========================================================
// 23. GET HSN DETAILS
// ==========================================================
app.get("/api/ewaybill/hsn-details", (req, res) =>
  callApi(req, res, "get", "/ewayapi/gethsndetailsbyhsncode", null, {
    hsncode: req.query.hsncode,
  })
);

// ==========================================================
// 24. INITIATE MULTI VEHICLE MOVEMENT
// ==========================================================
app.post("/api/ewaybill/init-multi", (req, res) =>
  callApi(req, res, "post", "/ewayapi/initmulti", req.body)
);

// ==========================================================
// 25. ADD MULTI VEHICLES
// ==========================================================
app.post("/api/ewaybill/add-multi", (req, res) =>
  callApi(req, res, "post", "/ewayapi/addmulti", req.body)
);

// ==========================================================
// 26. CHANGE MULTI VEHICLES
// ==========================================================
app.post("/api/ewaybill/update-multi", (req, res) =>
  callApi(req, res, "post", "/ewayapi/updtmulti", req.body)
);

// ==========================================================
// START SERVER
// ==========================================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});