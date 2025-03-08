const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  investorEmail: { type: String, required: true }, // Investor asking the query
  userEmail: { type: String, required: true }, // User responding to the query
  message: { type: String, required: true }, // Query text
  reply: { type: String, default: "" }, // Reply from the user
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Query", QuerySchema);
