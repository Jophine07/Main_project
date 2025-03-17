import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Tracker = () => {
  const { campaignId } = useParams(); // Get campaignId from URL
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // Default milestone percentages (fallback if not provided by backend)
  const defaultMilestones = [
    { no: 1, percentage: 0 },
    { no: 2, percentage: 10 },
    { no: 3, percentage: 15 },
    { no: 4, percentage: 20 },
    { no: 5, percentage: 25 },
    { no: 6, percentage: 30 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch milestones from the backend
        const response = await axios.get(`http://localhost:8080/Tracker/${campaignId}`);
        setMilestones(response.data);

        // Fetch campaign details to get total target amount
        const campaignResponse = await axios.get(`http://localhost:8080/campaign/${campaignId}`);
        setTotalAmount(campaignResponse.data.targetAmount || 0);
      } catch (err) {
        setError("Failed to fetch milestones.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  // Determine the highest approved milestone number
  let lastApproved = 0;
  milestones.forEach((m) => {
    if (m.status === "Approved" && m.milestoneNo > lastApproved) {
      lastApproved = m.milestoneNo;
    }
  });

  // Set active milestones:
  // All milestones with status "Approved" are active,
  // and in addition the milestone immediately following the highest approved milestone is active.
  let activeMilestones = [];
  if (lastApproved === 0) {
    activeMilestones.push(1);
  } else {
    milestones.forEach((m) => {
      if (m.status === "Approved" && !activeMilestones.includes(m.milestoneNo)) {
        activeMilestones.push(m.milestoneNo);
      }
    });
    const maxMilestoneNo = Math.max(...milestones.map((m) => m.milestoneNo));
    if (lastApproved < maxMilestoneNo && !activeMilestones.includes(lastApproved + 1)) {
      activeMilestones.push(lastApproved + 1);
    }
  }

  // Function to handle donation action (for active milestone)
  const handleDonate = (milestone) => {
    alert(`Proceeding to donate for ${milestone.title || "Milestone " + milestone.milestoneNo}`);
    // Implement actual donation flow here
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#007bff", fontFamily: "Arial, sans-serif" }}>
        Loading milestones...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "red", fontFamily: "Arial, sans-serif" }}>
        {error}
      </h2>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "20px" }}>
      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/viewcampaigns")}
        style={{
          marginBottom: "20px",
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

      <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "20px", color: "#333" }}>
        Campaign Milestone Tracker
      </h2>

      <div style={{ maxWidth: "900px", margin: "0 auto", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
              <th style={tableHeaderStyle}>Milestone No</th>
              <th style={tableHeaderStyle}>Title</th>
              <th style={tableHeaderStyle}>GitHub Repo</th>
              <th style={tableHeaderStyle}>Proof File</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Amount to be Paid</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone, index) => {
              // Determine percentage from backend; fallback to default if not provided
              const percentage =
                milestone.percentage !== undefined ? milestone.percentage : defaultMilestones[index].percentage;
              // For milestone 1, amount is "N/A", otherwise calculate based on targetAmount
              const amountToBePaid =
                milestone.milestoneNo === 1 ? "N/A" : `₹${((totalAmount * percentage) / 100).toFixed(2)}`;
              // Set title: milestone 1 becomes "SRS Documentation", for others default to milestone.title or "GitHub Push X"
              const title =
                milestone.milestoneNo === 1 ? "SRS Documentation" : milestone.title || `GitHub Push ${milestone.milestoneNo - 1}`;
              // Determine if current milestone is active: active if its number is in activeMilestones array
              const isActive = activeMilestones.includes(milestone.milestoneNo);
              // Determine status color
              const statusColor =
                milestone.status === "Approved"
                  ? "green"
                  : milestone.status === "Verifying"
                  ? "orange"
                  : "red";

              return (
                <tr key={milestone._id || index} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                  <td style={tableCellStyle}>{milestone.milestoneNo}</td>
                  <td style={tableCellStyle}>{title}</td>
                  <td style={tableCellStyle}>
                    {isActive ? (
                      milestone.gitLink ? (
                        <a href={milestone.gitLink} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        <span style={{ color: "#333" }}>Not Provided</span>
                      )
                    ) : (
                      <span style={{ color: "#dc3545" }}>Locked</span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    {isActive ? (
                      milestone.proofFile ? (
                        <a
                          href={`http://localhost:8080/${milestone.proofFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#28a745", fontWeight: "bold", textDecoration: "none" }}
                        >
                          View File
                        </a>
                      ) : (
                        <span style={{ color: "#333" }}>Not Uploaded</span>
                      )
                    ) : (
                      <span style={{ color: "#dc3545" }}>Locked</span>
                    )}
                  </td>
                  <td style={{ ...tableCellStyle, fontWeight: "bold", color: statusColor }}>
                    {milestone.status || "Pending"}
                  </td>
                  <td style={tableCellStyle}>{amountToBePaid}</td>
                  <td style={tableCellStyle}>
                    {milestone.milestoneNo === 1 ? (
                      "N/A"
                    ) : isActive ? (
                      <button style={donateButtonStyle} onClick={() => handleDonate(milestone)}>
                        Donate 💰
                      </button>
                    ) : (
                      <button style={{ ...donateButtonStyle, backgroundColor: "#ccc", cursor: "not-allowed" }} disabled>
                        Locked
                      </button>
                    )}
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

// Table Styles
const tableHeaderStyle = {
  padding: "12px",
  textAlign: "center",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  textAlign: "center",
};

const donateButtonStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  transition: "0.3s",
};

export default Tracker;
