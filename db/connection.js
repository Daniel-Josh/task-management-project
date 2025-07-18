require("dotenv").config;
const mongoose = require("mongoose");
//connect to mongoDB
mongoose
  .connect(process.env.MONGODB_CONNECT)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.log(`error connecting mongoDB: ${error}`);
  });

module.exports = mongoose;
