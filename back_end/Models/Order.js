const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Milestone",
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  investorEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Created", "Paid", "Failed"],
    default: "Created",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
