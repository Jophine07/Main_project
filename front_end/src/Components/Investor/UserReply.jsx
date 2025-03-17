import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import InvestorNavBar from "./InvestorNavBar";

const UserReply = () => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = Cookies.get("investorEmail"); // Get logged-in user's email from cookies

  useEffect(() => {
    console.log("Retrieved Investor Email from Cookie:", userEmail); // Debugging
    
    if (userEmail) {
      fetchUserReplies(userEmail);
    } else {
      console.warn("⚠️ No email found in cookies!");
      setLoading(false);
    }
  }, [userEmail]);

  const fetchUserReplies = async (email) => {
    try {
      console.log(`📡 Fetching replies for: ${email}`);

      const response = await axios.get(`http://localhost:8080/get-user-replies/${encodeURIComponent(email)}`);

      console.log("✅ API Response:", response.data);

      if (!response.data || response.data.length === 0) {
        console.warn("⚠️ No replies found for this user.");
      }

      setReplies(response.data);
    } catch (error) {
      console.error("❌ Error fetching replies:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <InvestorNavBar />
      <div style={styles.container}>
        <h3 style={styles.title}>User's Replies</h3>
        
        {loading ? (
          <p style={styles.loadingText}>Loading replies...</p>
        ) : replies.length > 0 ? (
          replies.map((query) => (
            <div key={query._id} style={styles.card}>
              <p><strong>User:</strong> {query.userEmail}</p>
              <p><strong>Query:</strong> {query.message}</p>
              <p><strong> Reply Message:</strong> {query.reply || "No reply yet"}</p>
            </div>
          ))
        ) : (
          <p style={styles.noReplyText}>No replies found.</p>
        )}
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  pageContainer: {
    backgroundColor: "#f4f7fc",
    minHeight: "100vh",
    paddingBottom: "30px",
  },
  container: {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px",
    borderLeft: "5px solid #007bff",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#007bff",
  },
  noReplyText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#777",
    marginTop: "20px",
  },
};

export default UserReply;
