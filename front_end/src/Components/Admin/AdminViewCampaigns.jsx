import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";

const AdminViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get("http://localhost:8080/allcampaigns");
      setCampaigns(response.data || []);
    } catch (err) {
      setError("Failed to fetch campaigns. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/update-campaign/${campaignId}`, {
        status: newStatus,
      });

      // Update UI
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign._id === campaignId ? { ...campaign, status: newStatus } : campaign
        )
      );
    } catch (error) {
      alert("Failed to update campaign status.");
    }
  };

  return (
    <div>
      <AdminDashboard />
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
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Organizer Email</th>
                  <th>Target Amount</th>
                  <th>Funds Raised</th>
                  <th>Deadline</th>
                  <th>Funding Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td>{campaign.title || "Untitled"}</td>
                    <td>{campaign.email || "Not provided"}</td>
                    <td>₹{campaign.targetAmount || "N/A"}</td>
                    <td>₹{campaign.fundsRaised || 0}</td>
                    <td>{campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : "N/A"}</td>
                    <td>{campaign.fundingType || "N/A"}</td>
                    <td>
                      <select
                        style={styles.statusDropdown}
                        value={campaign.status}
                        onChange={(e) => handleStatusChange(campaign._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      {campaign.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// 🔹 CSS Styles
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },
  statusDropdown: {
    padding: "5px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminViewCampaigns;
