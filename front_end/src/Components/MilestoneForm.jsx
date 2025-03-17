import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MilestoneTracking = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [milestoneStatus, setMilestoneStatus] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gitLinks, setGitLinks] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/campaign/${campaignId}`);
        setCampaign(response.data);

        // Fetch milestone statuses
        const milestoneResponse = await axios.get(`http://localhost:8080/milestones/${campaignId}`);
        const statusData = {};
        milestoneResponse.data.forEach((milestone) => {
          statusData[milestone.milestoneNo] = milestone.status;
        });
        setMilestoneStatus(statusData);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        setError("Error fetching campaign details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId]);

  const handleGitLinkSubmit = async (milestoneNo) => {
    if (!gitLinks[milestoneNo]) {
      alert("Please enter a GitHub link.");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post("http://localhost:8080/submit-gitlink", {
        campaignId,
        milestoneNo,
        gitLink: gitLinks[milestoneNo],
      });
      alert("GitHub link submitted successfully.");
    } catch (error) {
      console.error("Error submitting GitHub link:", error);
      alert("Error submitting GitHub link. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProofUpload = async (event, milestoneNo) => {
    const file = event.target.files[0];
    if (!file) return;

    if (milestoneNo !== 1 && !gitLinks[milestoneNo]) {
      alert("Please enter the GitHub link before uploading proof.");
      return;
    }

    const formData = new FormData();
    formData.append("proofFile", file);
    if (milestoneNo !== 1) formData.append("gitLink", gitLinks[milestoneNo]);
    formData.append("campaignId", campaignId);
    formData.append("milestoneNo", milestoneNo);
    formData.append("campaignTitle", campaign?.title);

    try {
      await axios.post("http://localhost:8080/upload-proof", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh milestone status after successful upload
      const milestoneResponse = await axios.get(`http://localhost:8080/milestones/${campaignId}`);
      const statusData = {};
      milestoneResponse.data.forEach((milestone) => {
        statusData[milestone.milestoneNo] = milestone.status;
      });
      setMilestoneStatus(statusData);

      alert("Proof uploaded successfully.");
    } catch (error) {
      console.error("Error uploading proof:", error);
      alert("Error uploading proof. Please try again.");
    }
  };

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "#007bff",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Loading campaign details...
      </h2>
    );
  }

  if (error || !campaign) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "#dc3545",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Error fetching campaign details. Please try again.
      </h2>
    );
  }

  const { targetAmount } = campaign;

  const milestones = [
    { no: 1, name: "SRS Documentation", percentage: 0 },
    { no: 2, name: "Git Push 1", percentage: 10 },
    { no: 3, name: "Git Push 2", percentage: 15 },
    { no: 4, name: "Git Push 3", percentage: 20 },
    { no: 5, name: "Git Push 4", percentage: 25 },
    { no: 6, name: "Git Push 5", percentage: 30 },
  ];

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/addcampaign")}
        style={{
          marginBottom: "20px",
          padding: "10px 15px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <h2 style={{ textAlign: "center", fontSize: "26px", color: "#333", marginBottom: "20px", fontWeight: "bold" }}>
        Milestone Tracking - {campaign.title}
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ background: "#007bff", color: "#fff" }}>
              <th style={{ padding: "12px" }}>No.</th>
              <th style={{ padding: "12px" }}>Milestone</th>
              <th style={{ padding: "12px" }}>Funds Required</th>
              {/* GitHub Link column only for milestone 2 and above */}
              <th style={{ padding: "12px", textAlign: "center" }}>GitHub Link</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Upload Proof</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone, index) => {
              const isActive = index === 0 || milestoneStatus[milestones[index - 1].no] === "Approved";
              const isDisabled = milestoneStatus[milestone.no] === "Approved";
              const statusColor =
                milestoneStatus[milestone.no] === "Approved"
                  ? "green"
                  : milestoneStatus[milestone.no] === "Verifying"
                  ? "orange"
                  : "red";

              return (
                <tr key={milestone.no} style={{ borderBottom: "1px solid #ddd", transition: "background 0.3s" }}>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "#007bff" }}>{milestone.no}</td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>{milestone.name}</td>
                  <td style={{ padding: "12px", fontSize: "14px", fontWeight: "bold", color: milestone.no === 1 ? "#6c757d" : "#28a745" }}>
                    {milestone.no === 1 ? "N/A" : `₹${((targetAmount * milestone.percentage) / 100).toFixed(2)}`}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {milestone.no !== 1 ? (
                      <>
                        <input
                          type="text"
                          value={gitLinks[milestone.no] || ""}
                          onChange={(e) => setGitLinks({ ...gitLinks, [milestone.no]: e.target.value })}
                          disabled={!isActive || isDisabled}
                          style={{ padding: "6px", width: "80%" }}
                        />
                        <button
                          onClick={() => handleGitLinkSubmit(milestone.no)}
                          disabled={!isActive || isDisabled || submitting}
                          style={{ padding: "6px", background: "#007bff", color: "#fff", border: "none", marginLeft: "8px", cursor: "pointer" }}
                        >
                          Submit
                        </button>
                      </>
                    ) : (
                      <span style={{ color: "#6c757d", fontStyle: "italic" }}>Not Required</span>
                    )}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <input type="file" onChange={(e) => handleProofUpload(e, milestone.no)} disabled={!isActive || isDisabled} />
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold", color: statusColor }}>
                    {milestoneStatus[milestone.no] || "Pending"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MilestoneTracking;
