const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  donorEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  status: { type: String, enum: ["Success", "Failed"], default: "Success" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
