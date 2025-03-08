import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const SubmitQuery = () => {
  const [formData, setFormData] = useState({
    investorEmail: "",
    userEmail: "",
    message: "",
  });

  useEffect(() => {
    // Fetch investor and organizer emails from cookies when the component mounts
    const investorEmailFromCookie = Cookies.get("userEmail"); 
    const organizerEmailFromCookie = Cookies.get("organizerEmail"); 
    
    setFormData((prevData) => ({
      ...prevData,
      investorEmail: investorEmailFromCookie || "",
      userEmail: organizerEmailFromCookie || "", // Pre-fill organizer email
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:8080/submit-query", formData);
      alert("Query submitted successfully!");
      setFormData({
        investorEmail: Cookies.get("userEmail") || "", 
        userEmail: Cookies.get("organizerEmail") || "", // Retain organizer email
        message: ""
      }); 
    } catch (error) {
      alert("Error submitting query!");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Ask a Query</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label><b>Your Email (Investor)</b></label>
          <input
            type="email"
            name="investorEmail"
            className="form-control"
            value={formData.investorEmail}
            readOnly // Investor email is pre-filled and non-editable
          />
        </div>

        <div className="mb-2">
          <label><b>User Email (Recipient)</b></label>
          <input
            type="email"
            name="userEmail"
            className="form-control"
            value={formData.userEmail}
            readOnly // Organizer email is pre-filled and non-editable
          />
        </div>

        <div className="mb-2">
          <label><b>Your Query</b></label>
          <textarea
            name="message"
            placeholder="Type your query here..."
            className="form-control"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit Query</button>
      </form>
    </div>
  );
};

export default SubmitQuery;
