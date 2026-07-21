const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/authenticate", async (req, res) => {
  try {
    const response = await axios.get(
      "https://staging.perione.in/ewaybillapi/v1.03/authenticate",
      {
        params: {
          email: process.env.EMAIL,
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
        },
        headers: {
          accept: "*/*",
          ip_address: process.env.IP_ADDRESS,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          gstin: process.env.GSTIN,
          env: process.env.ENVIRONMENT,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});