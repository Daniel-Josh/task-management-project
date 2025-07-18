const mongoose = require('../connection');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
},{ timestamps: true });

const userDataModel = mongoose.model("user", userSchema);

module.exports = userDataModel;