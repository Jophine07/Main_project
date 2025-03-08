import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UserNavBar from "./UserNavBar";

const ReplyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [replyData, setReplyData] = useState({});
  const userEmail = Cookies.get("userEmail"); // Get logged-in user's email

  useEffect(() => {
    console.log("User Email from Cookie:", userEmail); // Debugging
    if (userEmail) {
      fetchQueries();
    }
  }, [userEmail]);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/get-queries/${userEmail}`);
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error.response?.data || error.message);
    }
  };

  const handleReplyChange = (investorEmail, reply) => {
    setReplyData({ ...replyData, [investorEmail]: reply });
  };

  const submitReply = async (investorEmail) => {
    try {
      await axios.post(`http://localhost:8080/reply-query/${investorEmail}`, {
        userEmail, // Logged-in user's email (from cookies)
        reply: replyData[investorEmail] || "",
      });
      alert("Reply submitted successfully!");
      fetchQueries();
    } catch (error) {
      alert("Error submitting reply.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <UserNavBar />
      <div style={styles.container}>
        <h3 style={styles.title}>Investor Queries</h3>
        {queries.length > 0 ? (
          queries.map((query) => (
            <div key={query._id} style={styles.card}>
              <p><strong>Investor:</strong> {query.investorEmail}</p>
              <p><strong>Query:</strong> {query.message}</p>
              <p><strong>Reply:</strong> {query.reply || "No reply yet"}</p>
              <textarea
                style={styles.textArea}
                placeholder="Write a reply..."
                value={replyData[query.investorEmail] || ""}
                onChange={(e) => handleReplyChange(query.investorEmail, e.target.value)}
              />
              <button style={styles.button} onClick={() => submitReply(query.investorEmail)}>
                Submit Reply
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noQueryText}>No queries found.</p>
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
  textArea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    fontSize: "14px",
    resize: "none",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  noQueryText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#777",
    marginTop: "20px",
  },
};

export default ReplyQueries;
