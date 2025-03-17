const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  milestoneNo: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  gitLink: {
    type: String, // Store GitHub repository link
    default: null,
  },
  proofFile: {
    type: String, // Store file path or URL
    default: null,
  },
  status: {
    type: String,
    enum: ["Pending", "Verifying", "Approved"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Not Paid", "Paid"],
    default: "Not Paid",
  },
  submittedAt: {
    type: Date,
    default: null, // Will be set when proof is uploaded
  },
  approvedAt: {
    type: Date,
    default: null, // Will be set when admin approves
  },
});

const Milestone = mongoose.model("Milestone", milestoneSchema);
module.exports = Milestone;
