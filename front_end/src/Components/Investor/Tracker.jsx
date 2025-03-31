import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Tracker = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const investorEmail = Cookies.get("investorEmail");
  console.log("Investor Email:", investorEmail);

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
        const response = await axios.get(`http://localhost:8080/Tracker/${campaignId}`);
        setMilestones(response.data);

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

  // Set active milestones: approved ones and the next milestone after the highest approved
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

  const handleDonate = async (milestone) => {
    if (milestone.milestoneNo === 1) {
      alert("No donation required for SRS Documentation.");
      return;
    }

    const percentage =
      milestone.percentage !== undefined
        ? milestone.percentage
        : defaultMilestones[milestone.milestoneNo - 1].percentage;
    const amountToBePaid = (totalAmount * percentage) / 100;
    if (amountToBePaid <= 0) {
      alert("Invalid donation amount calculated.");
      return;
    }

    try {
      const orderResponse = await axios.post("http://localhost:8080/payment/create-order", {
        amount: amountToBePaid,
        campaignId,
        milestoneId: milestone._id,
      });
      const orderData = orderResponse.data;
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FundWise",
        description: `Donation for ${milestone.title || "GitHub Push " + (milestone.milestoneNo - 1)}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post("http://localhost:8080/payment/verify", {
              order_id: orderData.orderId,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              campaignId,
              milestoneId: milestone._id,
              amount: amountToBePaid,
              investorEmail,
            });
            if (verifyResponse.data.success) {
              // Mark the payment as paid in your orders table
              const markPaidResponse = await axios.post("http://localhost:8080/payment/mark-paid", {
                campaignId,
                milestoneId: milestone._id,
                orderId: orderData.orderId,
                payment_id: response.razorpay_payment_id,
                amount: amountToBePaid,
                currency: orderData.currency,
                investorEmail,
              });
              if (markPaidResponse.data.success) {
                // Update the campaign table with the paid amount
                const updateCampaignResponse = await axios.post("http://localhost:8080/campaign/update-payment", {
                  campaignId,
                  milestoneId: milestone._id,
                  paidAmount: amountToBePaid,
                  investorEmail,
                });
                if (updateCampaignResponse.data.success) {
                  alert("Payment Successful and campaign updated!");
                } else {
                  alert("Payment successful but updating campaign failed.");
                }
              } else {
                alert("Payment was successful but updating order failed.");
              }
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification error. Please try again.");
          }
        },
        prefill: {
          name: "Donor",
          email: investorEmail || "donor@example.com",
        },
        theme: {
          color: "#28a745",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment initiation failed.");
    }
  };

  if (loading) {
    return (
      <h2 style={loadingStyle}>
        Loading milestones...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={errorStyle}>
        {error}
      </h2>
    );
  }

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate("/viewcampaigns")}
        style={backButtonStyle}
      >
        ← Back to Dashboard
      </button>

      <h2 style={headerStyle}>
        Campaign Milestone Tracker
      </h2>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRowStyle}>
              <th style={tableHeaderStyle}>Milestone No</th>
              <th style={tableHeaderStyle}>Title</th>
              <th style={tableHeaderStyle}>GitHub Repo</th>
              <th style={tableHeaderStyle}>Proof File</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Payment Status</th>
              <th style={tableHeaderStyle}>Amount to be Paid</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone, index) => {
              const percentage =
                milestone.percentage !== undefined ? milestone.percentage : defaultMilestones[index].percentage;
              const amountToBePaid =
                milestone.milestoneNo === 1 ? "N/A" : `₹${((totalAmount * percentage) / 100).toFixed(2)}`;
              const title =
                milestone.milestoneNo === 1 ? "SRS Documentation" : milestone.title || `GitHub Push ${milestone.milestoneNo - 1}`;
              const isActive = activeMilestones.includes(milestone.milestoneNo);
              const statusColor =
                milestone.status === "Approved"
                  ? "green"
                  : milestone.status === "Verifying"
                  ? "orange"
                  : "red";
              const paymentStatusColor =
                milestone.paymentStatus === "Paid" ? "green" : "red";

              return (
                <tr key={milestone._id || index} style={tableRowStyle}>
                  <td style={tableCellStyle}>{milestone.milestoneNo}</td>
                  <td style={tableCellStyle}>{title}</td>
                  <td style={tableCellStyle}>
                    {isActive ? (
                      milestone.gitLink ? (
                        <a href={milestone.gitLink} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                          View
                        </a>
                      ) : (
                        <span style={defaultTextStyle}>Not Provided</span>
                      )
                    ) : (
                      <span style={lockedTextStyle}>Locked</span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    {isActive ? (
                      milestone.proofFile ? (
                        <a
                          href={`http://localhost:8080/${milestone.proofFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={fileLinkStyle}
                        >
                          View File
                        </a>
                      ) : (
                        <span style={defaultTextStyle}>Not Uploaded</span>
                      )
                    ) : (
                      <span style={lockedTextStyle}>Locked</span>
                    )}
                  </td>
                  <td style={{ ...tableCellStyle, fontWeight: "bold", color: statusColor }}>
                    {milestone.status || "Pending"}
                  </td>
                  <td style={{ ...tableCellStyle, fontWeight: "bold", color: paymentStatusColor }}>
                    {milestone.paymentStatus || "Not Paid"}
                  </td>
                  <td style={tableCellStyle}>{amountToBePaid}</td>
                  <td style={tableCellStyle}>
                    {milestone.milestoneNo === 1 ? (
                      "N/A"
                    ) : isActive ? (
                      milestone.paymentStatus === "Paid" ? (
                        <button
                          style={{ ...donateButtonStyle, backgroundColor: "#ccc", cursor: "not-allowed" }}
                          disabled
                        >
                          Paid
                        </button>
                      ) : (
                        <button style={donateButtonStyle} onClick={() => handleDonate(milestone)}>
                          Donate 💰
                        </button>
                      )
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

// Enhanced Inline Styles
const containerStyle = {
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  background: "linear-gradient(135deg, #f3f4f6, #e2e8f0)",
  minHeight: "100vh",
  padding: "30px",
};

const backButtonStyle = {
  marginBottom: "20px",
  padding: "10px 15px",
  background: "linear-gradient(45deg, #007bff, #0056b3)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background 0.3s ease",
};

const headerStyle = {
  textAlign: "center",
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "25px",
  color: "#333",
  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
};

const tableContainerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
};

const tableHeaderRowStyle = {
  background: "linear-gradient(45deg, #4f46e5, #4338ca)",
};

const tableHeaderStyle = {
  padding: "15px",
  textAlign: "center",
  fontWeight: "700",
  color: "#fff",
  borderBottom: "2px solid #ddd",
};

const tableRowStyle = {
  textAlign: "center",
  borderBottom: "1px solid #e2e8f0",
};

const tableCellStyle = {
  padding: "12px",
  textAlign: "center",
};

const donateButtonStyle = {
  padding: "10px 14px",
  borderRadius: "6px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background 0.3s ease, transform 0.2s ease",
};

const linkStyle = {
  color: "#1d4ed8",
  textDecoration: "none",
  fontWeight: "600",
};

const fileLinkStyle = {
  color: "#10b981",
  textDecoration: "none",
  fontWeight: "600",
};

const defaultTextStyle = {
  color: "#374151",
};

const lockedTextStyle = {
  color: "#dc2626",
  fontWeight: "600",
};

const loadingStyle = {
  textAlign: "center",
  marginTop: "50px",
  color: "#2563eb",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const errorStyle = {
  textAlign: "center",
  marginTop: "50px",
  color: "#dc2626",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

export default Tracker;
