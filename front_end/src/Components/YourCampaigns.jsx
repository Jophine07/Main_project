import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UserNavBar from "./UserNavBar";

const YourCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      const userEmail = Cookies.get("userEmail");

      try {
        const response = await axios.get(`http://localhost:8080/yourcampaigns?email=${userEmail}`);
        setCampaigns(response.data);
      } catch (err) {
        setError("Failed to fetch campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return { color: "green", fontWeight: "bold" };
      case "pending":
        return { color: "orange", fontWeight: "bold" };
      case "closed":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "#555", fontWeight: "bold" };
    }
  };

  return (
    <div>
      <UserNavBar />
      <div style={{ padding: "20px", maxWidth: "900px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>Your Campaigns</h2>

        {loading ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red", fontSize: "16px" }}>{error}</p>
        ) : campaigns.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>No campaigns found.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {campaigns.map((campaign, index) => (
              <div key={index} style={{ padding: "15px", borderRadius: "10px", backgroundColor: "#f9f9f9", boxShadow: "0px 4px 12px rgba(0,0,0,0.15)", transition: "transform 0.3s", cursor: "pointer" }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "20px", fontWeight: "bold" }}>{campaign.title}</h3>
                <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>{campaign.description}</p>
                <p><strong>Target:</strong> <span style={{ color: "#007bff", fontWeight: "bold" }}>₹{campaign.targetAmount}</span></p>
                <p><strong>Deadline:</strong> {new Date(campaign.deadline).toLocaleDateString()}</p>
                <p><strong>Funding Type:</strong> {campaign.fundingType}</p>
                <p><strong>Location:</strong> {campaign.location}</p>
                <p><strong>Amount Received:</strong> <span style={{ color: "#28a745", fontWeight: "bold" }}>₹{campaign.collectedAmount}</span></p>
                <p><strong>Status:</strong> <span style={getStatusStyle(campaign.status)}>{campaign.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourCampaigns;