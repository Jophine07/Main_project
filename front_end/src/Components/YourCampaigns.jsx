import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // For navigation
import UserNavBar from "./UserNavBar";

const YourCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

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
        return { color: "#28a745", fontWeight: "bold" }; // Green
      case "pending":
        return { color: "#ffc107", fontWeight: "bold" }; // Yellow
      case "closed":
        return { color: "#dc3545", fontWeight: "bold" }; // Red
      default:
        return { color: "#6c757d", fontWeight: "bold" }; // Gray
    }
  };

  const handleProgressClick = (campaignId, targetAmount) => {
    // Store campaign ID and target amount in local storage
    localStorage.setItem("campaignId", campaignId);
    localStorage.setItem("targetAmount", targetAmount);

    // Redirect to progress page
    navigate(`/MilestoneForm/${campaignId}`);
  };

  return (
    <div>
      <UserNavBar />
      <div style={{ padding: "20px", maxWidth: "1100px", margin: "auto", fontFamily: "'Poppins', sans-serif" }}>
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "25px", fontSize: "26px", fontWeight: "bold", letterSpacing: "1px" }}>
          Your Campaigns
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red", fontSize: "16px" }}>{error}</p>
        ) : campaigns.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>No campaigns found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  borderLeft: `5px solid ${getStatusStyle(campaign.status).color}`,
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
                
                <h3
                  style={{
                    color: "#333",
                    marginBottom: "12px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {campaign.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px", lineHeight: "1.5" }}>
                  {campaign.description.length > 100 ? campaign.description.substring(0, 100) + "..." : campaign.description}
                </p>
                <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
                  <strong>Target:</strong>{" "}
                  <span style={{ color: "#007bff", fontWeight: "bold" }}>₹{campaign.targetAmount}</span>
                </p>
                <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
                  <strong>Deadline:</strong> {campaign.deadline} days
                </p>
                <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
                  <strong>Funding Type:</strong> {campaign.fundingType}
                </p>
                <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
                  <strong>Location:</strong> {campaign.location}
                </p>
                <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
                  <strong>Amount Received:</strong>{" "}
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>₹{campaign.collectedAmount}</span>
                </p>
                <p style={{ fontSize: "14px", color: "#333", marginBottom: "6px" }}>
                  <strong>Status:</strong> <span style={getStatusStyle(campaign.status)}>{campaign.status}</span>
                </p>

                {/* Show "Your Progress" button only if campaign is ACTIVE */}
                {campaign.status.toLowerCase() === "active" && (
                  <button
                    onClick={() => handleProgressClick(campaign._id, campaign.targetAmount)}
                    style={{
                      marginTop: "10px",
                      padding: "8px 14px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "background 0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                  >
                    Your Progress
                  </button>
                )}

                {/* Decorative Gradient Background */}
                <div
                  style={{
                    position: "absolute",
                    top: "-30px",
                    right: "-30px",
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, rgba(0,123,255,0.3), rgba(255,193,7,0.3))",
                    borderRadius: "50%",
                    opacity: "0.5",
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourCampaigns;
