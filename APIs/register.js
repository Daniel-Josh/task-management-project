const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userDataModel = require("../db/schema/userSchema");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// register
router.post(
  "/register",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) return res.status(400).json({ error: err.array() });
      const { email, password } = req.body;

      // Check if the user already exists
      const existingUser = await userDataModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Email already exists. Please log in." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userDataModel({ email, password: hashedPassword });
      await user.save();
      console.log("signup successful, saved user ----->", user);
      res.status(201).json({ message: "signup successful" });
    } catch (error) {
      console.log("error in register API ----->", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userDataModel.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      let accessToken = jwt.sign(
        { id: user._id },
        "taskmanagementjwttokensecret" //token will only be sent once, and if the person re-logins, new jwt is created
      );
      console.log("Access Token ---->", accessToken);

      //set the token in client side
      res.setHeader("Authorization", `Bearer ${accessToken}`);
      res.json({ message: " login successful" });
    } catch (error) {
      console.log("error in login API ----->", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
