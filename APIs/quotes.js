const express = require("express");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const verifyToken = require("../middleware");
const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: "Too many requests, please try again in a minute"
});

router.get("/fetchquote", verifyToken, limiter, async (req, res) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const [quoteObj] = response.data;
    console.log("quote", quoteObj);

    res.json({ quote: quoteObj.q, author: quoteObj.a });
  } catch (error) {
    console.log("error in fetchquote API ----->", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
