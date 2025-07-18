require("dotenv").config;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const register = require("./APIs/register");
app.use(register);

const tasks = require("./APIs/tasks");
app.use(tasks);

const quotes = require("./APIs/quotes");
app.use(quotes);

// Start the server on port 3000
app.listen(3000, "localhost", () => {
  console.info("App is starting...");
});
