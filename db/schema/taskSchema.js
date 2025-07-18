const mongoose = require('../connection');

const taskSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true},
  description: { type: String, maxlength: 500 },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const taskDataModel = mongoose.model("task", taskSchema);

module.exports = taskDataModel;