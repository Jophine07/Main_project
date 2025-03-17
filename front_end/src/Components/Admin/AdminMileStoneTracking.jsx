import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminMilestoneTracking = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaignTitle, setCampaignTitle] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // Track which milestone is updating

  useEffect(() => {
    if (!campaignId) {
      setError("No campaign selected for tracking.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch campaign title
        const campaignResponse = await axios.get(`http://localhost:8080/campaign/${campaignId}`);
        setCampaignTitle(campaignResponse.data.title);

        // Fetch milestones
        const milestoneResponse = await axios.get(`http://localhost:8080/milestones/${campaignId}`);
        setMilestones(milestoneResponse.data);
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  const handleStatusChange = async (milestoneId, newStatus) => {
    setUpdating(milestoneId); // Show loading state

    try {
      console.log("Updating milestone:", milestoneId, "to status:", newStatus);

      await axios.put(
        `http://localhost:8080/milestones/update-status/${milestoneId}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      setMilestones((prevMilestones) =>
        prevMilestones.map((milestone) =>
          milestone._id === milestoneId ? { ...milestone, status: newStatus } : milestone
        )
      );
    } catch (error) {
      console.error("Error updating milestone:", error);
      alert("Error updating milestone status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "#007bff",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Loading milestones...
      </h2>
    );

  if (error)
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "#dc3545",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {error}
      </h2>
    );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px", fontWeight: "bold" }}>
        Milestone Tracking - {campaignTitle}
      </h2>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table
          style={{
            width: "90%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ background: "#007bff", color: "#fff" }}>
              <th style={{ padding: "12px", width: "5%" }}>No.</th>
              <th style={{ padding: "12px", width: "20%" }}>Title</th>
              <th style={{ padding: "12px", width: "15%" }}>Proof File</th>
              <th style={{ padding: "12px", width: "15%" }}>GitHub Link</th>
              <th style={{ padding: "12px", width: "15%" }}>Status</th>
              <th style={{ padding: "12px", width: "10%" }}>Submitted At</th>
              <th style={{ padding: "12px", width: "10%" }}>Approved At</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone) => (
              <tr key={milestone._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px", fontWeight: "bold", color: "#007bff" }}>{milestone.milestoneNo}</td>
                {/* Use campaignTitle instead of milestone.title */}
                <td style={{ padding: "12px", fontSize: "14px" }}>{campaignTitle}</td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>
                  {milestone.proofFile ? (
                    <a
                      href={`http://localhost:8080/${milestone.proofFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#28a745",
                        fontWeight: "bold",
                        textDecoration: "none",
                      }}
                    >
                      View File
                    </a>
                  ) : (
                    <span style={{ color: "#dc3545" }}>No File</span>
                  )}
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>
                  {milestone.gitLink ? (
                    <a
                      href={milestone.gitLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}
                    >
                      View Repo
                    </a>
                  ) : (
                    <span style={{ color: "#dc3545" }}>Not Provided</span>
                  )}
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>
                  <select
                    value={milestone.status}
                    onChange={(e) => handleStatusChange(milestone._id, e.target.value)}
                    disabled={updating === milestone._id}
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      background: updating === milestone._id ? "#ccc" : "#fff",
                      cursor: updating === milestone._id ? "not-allowed" : "pointer",
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verifying">Verifying</option>
                    <option value="Approved">Approved</option>
                  </select>
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>
                  {milestone.submittedAt ? new Date(milestone.submittedAt).toLocaleDateString() : "-"}
                </td>
                <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>
                  {milestone.approvedAt ? new Date(milestone.approvedAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Back to Dashboard Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          onClick={() => navigate("/AdminViewCampaigns")}
          style={{
            padding: "10px 15px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminMilestoneTracking;
