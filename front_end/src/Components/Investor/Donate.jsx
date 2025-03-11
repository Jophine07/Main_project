import React, { useState } from "react";
import axios from "axios";

const Donate = ({ campaignId, email }) => {
  const [amount, setAmount] = useState("");

  const handleDonation = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      // Send request to backend to update the campaign fundsRaised
      const response = await axios.post("http://localhost:8080/update-funds", {
        campaignId,
        amount: parseFloat(amount),
      });

      if (response.data.success) {
        alert(`₹${amount} added to campaign successfully!`);
        setAmount(""); // Clear the input field after donation
      } else {
        alert("Failed to update campaign funds. Please try again.");
      }
    } catch (error) {
      console.error("Donation Error:", error);
      alert("Error updating campaign funds. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Donate to Campaign</h2>
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={handleDonation}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Donate;
