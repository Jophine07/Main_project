import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UserNavBar from "./UserNavBar";

const AddCampaign = () => {
  const [formData, setFormData] = useState({
    email: "",
    title: "",
    description: "",
    targetAmount: "",
    deadline: "", // Number of days instead of date
    category: "",
    location: "",
    fundingType: "All or Nothing",
  });

  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    const userEmail = Cookies.get("userEmail") || "";
    setFormData((prev) => ({ ...prev, email: userEmail }));

    if (!userEmail) {
      alert("⚠️ User email not found! Please log in again.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert("⚠️ User email is missing. Please log in again.");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post("http://localhost:8080/addcampaign", formData);
      if (response.data.success) {
        alert("✅ Campaign Created Successfully!");
        setFormData({
          email: formData.email, // Keep email after submission
          title: "",
          description: "",
          targetAmount: "",
          deadline: "",
          category: "",
          location: "",
          fundingType: "All or Nothing",
        });
      } else {
        alert("⚠️ Error Creating Campaign!");
      }
    } catch (error) {
      console.error("Server Error:", error.message);
      alert("❌ Server Error! Please try again later.");
    }

    setLoading(false); // Hide loading indicator
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <UserNavBar />
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: "450px", width: "100%" }}>
          <h3 className="text-center fw-bold mb-3 text-primary">🚀 Launch Your Campaign</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" name="email" value={formData.email} className="form-control border-0 bg-light shadow-sm" readOnly />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control border-0 bg-light shadow-sm" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-control border-0 bg-light shadow-sm" required rows="3" />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Target (₹)</label>
                <input type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} className="form-control border-0 bg-light shadow-sm" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Deadline (Days)</label>
                <input type="number" name="deadline" value={formData.deadline} onChange={handleChange} className="form-control border-0 bg-light shadow-sm" required min="1" />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select border-0 bg-light shadow-sm" required>
                <option value="">Select Category</option>
                <option value="IOT">IOT</option>
                <option value="AWS Hosting">AWS Hosting</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Location</label>
              <select name="location" value={formData.location} onChange={handleChange} className="form-select border-0 bg-light shadow-sm" required>
                <option value="">Select State/UT</option>
                {indianStates.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Funding Type</label>
              <select name="fundingType" value={formData.fundingType} onChange={handleChange} className="form-select border-0 bg-light shadow-sm" required>
                <option value="All or Nothing">All or Nothing</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm" disabled={loading}>
              {loading ? "🚀 Creating..." : "🚀 Create Campaign"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCampaign;
