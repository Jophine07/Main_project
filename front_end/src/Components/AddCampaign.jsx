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
    deadline: "",
    category: "",
    location: "",
    numofdays: "",
    fundingType: "All or Nothing",
  });

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
    
    try {
      const response = await axios.post("http://localhost:8080/addcampaign", formData);

      if (response.data.success) {
        alert("✅ Campaign Created Successfully!");
        setFormData({
          email: formData.email,
          title: "",
          description: "",
          targetAmount: "",
          deadline: "",
          category: "",
          location: "",
          numofdays: "",
          fundingType: "All or Nothing",
        });
      } else {
        alert("⚠️ Error Creating Campaign!");
      }
    } catch (error) {
      console.error("Server Error:", error.message);
      alert("❌ Server Error! Please try again later.");
    }
  };

  return (
    <div>
      <UserNavBar />
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4 shadow-sm w-100" style={{ maxWidth: "500px" }}>
          <h3 className="text-center mb-3">Create Campaign</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input type="email" name="email" value={formData.email} className="form-control" readOnly />
            </div>
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" required rows="3" />
            </div>
            <div className="mb-2">
              <label className="form-label">Target Amount (₹)</label>
              <input type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-2">
              <label className="form-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select" required>
                <option value="">Select Category</option>
                <option value="IOT">IOT</option>
                <option value="AWS Hosting">AWS Hosting</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Location</label>
              <select name="location" value={formData.location} onChange={handleChange} className="form-select" required>
                <option value="">Select State</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Number of Days</label>
              <input type="number" name="numofdays" value={formData.numofdays} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Funding Type</label>
              <select name="fundingType" value={formData.fundingType} onChange={handleChange} className="form-select" required>
                <option value="All or Nothing">All or Nothing</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success w-100">Create Campaign</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCampaign;
