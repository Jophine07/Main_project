import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import InvestorNavBar from "./InvestorNavBar";

const ViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("http://localhost:8080/allcampaigns");
        setCampaigns(response.data || []); // Ensure data is an array
      } catch (err) {
        setError("Failed to fetch campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDonate = (campaignId) => {
    alert(`Redirecting to donation page for campaign ID: ${campaignId}`);
    // TODO: Implement Razorpay integration
  };

  const handleAskQuery = (organizerEmail) => {
    if (!organizerEmail) {
      alert("Organizer email is not available.");
      return;
    }

    // Store organizer's email in a cookie
    Cookies.set("organizerEmail", organizerEmail, { expires: 1 }); // Expires in 1 day

    // Navigate to the query submission page
    navigate("/submitquery");
  };

  return (
    <div><InvestorNavBar />
    <div style={styles.pageContainer}>
      
      <div style={styles.container}>
        <h2 style={styles.title}>All Campaigns</h2>

        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : error ? (
          <p style={styles.errorText}>{error}</p>
        ) : campaigns.length === 0 ? (
          <p style={styles.noCampaignsText}>No campaigns available.</p>
        ) : (
          <div style={styles.gridContainer}>
            {campaigns.map((campaign, index) => (
              <div key={index} style={styles.card}>
                <h3 style={styles.cardTitle}>{campaign.title || "Untitled Campaign"}</h3>
                <p style={styles.cardDescription}>{campaign.description || "No description provided."}</p>
                <p><strong>Target:</strong> ₹{campaign.targetAmount || "N/A"}</p>
                <p><strong>Funds Raised:</strong> ₹{campaign.fundsRaised || 0}</p>
                <p><strong>Deadline:</strong> {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : "N/A"}</p>
                <p><strong>Funding Type:</strong> {campaign.fundingType || "N/A"}</p>
                <p><strong>Location:</strong> {campaign.location || "N/A"}</p>
                <p><strong>Organizer Email:</strong> {campaign.email || "Not provided"}</p>

                <button style={styles.donateButton} onClick={() => handleDonate(campaign._id)}>
                  Donate
                </button>

                <button
                  style={styles.queryButton}
                  onClick={() => handleAskQuery(campaign.email)}
                  disabled={!campaign.email} // Disable if no email
                >
                  Ask Query
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

// 🔹 Responsive CSS Styling
const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  },
  container: {
    width: "90%",
    maxWidth: "1200px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
  },
  noCampaignsText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.2s",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  donateButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    margin: "5px",
  },
  queryButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    margin: "5px",
  },
};

export default ViewCampaigns;
