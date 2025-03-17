import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import InvestorNavBar from "./InvestorNavBar";

const ViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("http://localhost:8080/allcampaigns");
        setCampaigns(response.data || []);
        setFilteredCampaigns(response.data || []);
      } catch (err) {
        setError("Failed to fetch campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (searchCategory) {
      setFilteredCampaigns(
        campaigns.filter((campaign) => campaign.category === searchCategory)
      );
    } else {
      setFilteredCampaigns(campaigns);
    }
  }, [searchCategory, campaigns]);

  const handleAskQuery = (organizerEmail) => {
    if (!organizerEmail) {
      alert("Organizer email is not available.");
      return;
    }
    Cookies.set("organizerEmail", organizerEmail, { expires: 1 });
    navigate("/submitquery");
  };

  const handleFraudCheck = (campaign) => {
    Cookies.set("fraudCampaign", JSON.stringify(campaign), { expires: 1 });
    navigate("/FraudPredictionI");
    alert("Campaign details stored for fraud analysis.");
  };

  const handleTrackCampaign = (campaignId) => {
    if (!campaignId) {
      alert("Campaign ID is missing.");
      return;
    }
    navigate(`/Tracker/${campaignId}`);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <InvestorNavBar />
      <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
        <div style={{ width: "90%", maxWidth: "1200px", backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>All Campaigns</h2>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <label style={{ fontSize: "16px", fontWeight: "bold", marginRight: "10px" }}>Filter by Category:</label>
            <select
              style={{ padding: "8px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="IOT">IOT</option>
              <option value="AWS Hosting">AWS Hosting</option>
            </select>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>Loading...</p>
          ) : error ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>{error}</p>
          ) : filteredCampaigns.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>No campaigns available.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {filteredCampaigns.map((campaign, index) => (
                <div key={index} style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  cursor: "pointer"
                }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color: "#333" }}>{campaign.title || "Untitled Campaign"}</h3>
                  <p style={{ color: "#555", fontSize: "14px" }}>{campaign.description || "No description provided."}</p>
                  <p><strong>🎯 Target:</strong> ₹{campaign.targetAmount || "N/A"}</p>
                  <p><strong>📌 Category:</strong> {campaign.category || "N/A"}</p>
                  <p><strong>💰 Funds Raised:</strong> ₹{campaign.collectedAmount || 0}</p>
                  <p><strong>⏳ Deadline:</strong> {campaign.deadline || "N/A"} Days</p>
                  <p><strong>📜 Funding Type:</strong> {campaign.fundingType || "N/A"}</p>
                  <p><strong>📍 Location:</strong> {campaign.location || "N/A"}</p>
                  <p><strong>✉️ Organizer:</strong> {campaign.email || "Not provided"}</p>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button style={buttonStyle} onClick={() => handleTrackCampaign(campaign._id)}>Track 📊</button>
                    <button style={buttonStyle} onClick={() => handleAskQuery(campaign.email)}>Ask Query 💬</button>
                    <button style={buttonStyle} onClick={() => handleFraudCheck(campaign)}>Fraud Check 🔍</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  fontSize: "14px",
  marginTop: "10px",
  transition: "0.3s",
};

export default ViewCampaigns;
