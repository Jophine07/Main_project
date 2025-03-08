const mongoose=require("mongoose")


const campaignSchema = mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String,required:true }, 
  description: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  collectedAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  category: { type: String, enum: ["IOT", "AWS Hosting"], required: true },
  location: { type: String, required: true },
  fundingType: { type: String, enum: ["All or Nothing", "Flexible"], required: true },
  status: { type: String, enum: ["Pending", "Active", "Completed"], default: "Pending" }
});

const campaignModel = mongoose.model("Campaign", campaignSchema);

module.exports = { campaignModel };