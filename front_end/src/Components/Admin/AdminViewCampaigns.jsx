import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminDashboard from "./AdminDashboard";

const AdminViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get("http://localhost:8080/adminallcampaigns");
      setCampaigns(response.data || []);
      setFilteredCampaigns(response.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch campaigns. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    setFilteredCampaigns(
      query === "" ? campaigns : campaigns.filter((c) => c.email.toLowerCase().includes(query))
    );
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await axios.delete(`http://localhost:8080/delete-campaign/${_id}`);
      setCampaigns((prev) => prev.filter((c) => c._id !== _id));
      setFilteredCampaigns((prev) => prev.filter((c) => c._id !== _id));
      alert("Campaign deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
      alert("Failed to delete campaign.");
    }
  };

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/update-campaign-status/${campaignId}`, {
        status: newStatus,
      });

      setCampaigns((prev) =>
        prev.map((c) => (c._id === campaignId ? { ...c, status: newStatus } : c))
      );
      setFilteredCampaigns((prev) =>
        prev.map((c) => (c._id === campaignId ? { ...c, status: newStatus } : c))
      );

      alert("Campaign status updated successfully!");
    } catch (error) {
      console.error("Status Update Error:", error.response?.data || error.message);
      alert("Failed to update campaign status.");
    }
  };

  const handleFraudPrediction = (campaign) => {
    Cookies.set("fraud_email", campaign.email || "N/A", { expires: 1 });
    Cookies.set("fraud_targetAmount", campaign.targetAmount || "N/A", { expires: 1 });
    Cookies.set("fraud_collectedAmount", campaign.fundsRaised || "N/A", { expires: 1 });
    Cookies.set("fraud_deadline", campaign.deadline || "N/A", { expires: 1 });
    Cookies.set("fraud_category", campaign.category || "N/A", { expires: 1 });
    Cookies.set("fraud_fundingType", campaign.fundingType || "N/A", { expires: 1 });
    Cookies.set("fraud_status", campaign.status || "N/A", { expires: 1 });
    Cookies.set("fraud_description", campaign.description || "No description available", { expires: 1 });

    navigate("/FraudPrediction");
  };

  return (
    <div>
      <AdminDashboard />
      <div style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <h2 style={{ textAlign: "center", fontSize: "26px", color: "#333", marginBottom: "20px" }}>
            All Campaigns
          </h2>

          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
            />
            <button
              onClick={handleSearch}
              style={{ padding: "10px 15px", borderRadius: "5px", background: "#007bff", color: "white", border: "none", cursor: "pointer", fontSize: "16px" }}
            >
              Search
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>Loading...</p>
          ) : error ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>{error}</p>
          ) : filteredCampaigns.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>No matching campaigns found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ background: "#007bff", color: "#fff" }}>
                  <th>Title</th>
                  <th>Email</th>
                  <th>Target Amount</th>
                  <th>Funds Raised</th>
                  <th>Deadline</th>
                  <th>Funding Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {filteredCampaigns.map((campaign) => (
    <tr key={campaign._id} style={{ borderBottom: "10px solid transparent" }}>  {/* Added space between rows */}
      <td>{campaign.title || "Untitled"}</td>
      <td>{campaign.email || "Not provided"}</td>
      <td>₹{campaign.targetAmount || "N/A"}</td>
      <td>₹{campaign.fundsRaised || 0}</td>
      <td>{campaign.deadline || "N/A"}</td>
      <td>{campaign.fundingType || "N/A"}</td>

      <td>
        <select
          value={campaign.status || "Pending"}
          onChange={(e) => handleStatusChange(campaign._id, e.target.value)}
          style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </td>

      <td>
        <button 
          onClick={() => handleDelete(campaign._id)}
          style={{ background: "#dc3545", color: "#fff", padding: "8px 12px", borderRadius: "4px", cursor: "pointer", border: "none", marginRight: "5px" }}
        >
          Delete
        </button>
        <button 
          onClick={() => handleFraudPrediction(campaign)}
          style={{ background: "#ff9800", color: "#fff", padding: "8px 12px", borderRadius: "4px", cursor: "pointer", border: "none" }}
        >
          Predict Fraud
        </button>
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

export default AdminViewCampaigns;
