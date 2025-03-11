import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UserNavBar from "./UserNavBar";

const ReplyQueries = () => {
  const [queries, setQueries] = useState([]); // Holds queries from investors
  const [replyData, setReplyData] = useState({}); // Holds reply inputs
  const userEmail = Cookies.get("userEmail"); // Logged-in user's email

  // Fetch queries when component loads or userEmail changes
  useEffect(() => {
    if (userEmail) {
      fetchQueries();
    }
  }, [userEmail]);

  // Fetch investor queries for the logged-in user
  const fetchQueries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/get-queries/${userEmail}?timestamp=${new Date().getTime()}`
      );
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error.response?.data || error.message);
    }
  };

  // Handle reply text change
  const handleReplyChange = (queryId, reply) => {
    setReplyData((prevData) => ({
      ...prevData,
      [queryId]: reply,
    }));
  };

  // Submit reply using query's _id
  const submitReply = async (queryId) => {
    try {
      const replyText = replyData[queryId] || ""; // Get reply text
  
      const response = await axios.put(
        `http://localhost:8080/update-query-reply/${queryId}`,
        { reply: replyText },  // Send reply data in the body
        { headers: { "Content-Type": "application/json" } } // Ensure proper content type
      );
  
      alert("Reply updated successfully!");
      fetchQueries(); // Refresh queries after update
    } catch (error) {
      console.error("Error updating reply:", error.response?.data || error.message);
      alert("Error updating reply.");
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
              <p>
                <strong>Investor:</strong> {query.investorEmail}
              </p>
              <p>
                <strong>Query:</strong> {query.message}
              </p>
              <p>
                <strong>Reply:</strong> {query.reply || "No reply yet"}
              </p>
              <textarea
                style={styles.textArea}
                placeholder="Write a reply..."
                value={replyData[query._id] || ""}
                onChange={(e) => handleReplyChange(query._id, e.target.value)}
              />
              <button
                style={styles.button}
                onClick={() => submitReply(query._id)}
              >
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

// Stylish Inline CSS
const styles = {
  pageContainer: {
    backgroundColor: "#f4f7fc",
    minHeight: "100vh",
    paddingBottom: "30px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    borderRadius: "10px",
  },
  title: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    borderBottom: "3px solid #007bff",
    paddingBottom: "5px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px",
    borderLeft: "5px solid #007bff",
    transition: "0.3s",
  },
  textArea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    fontSize: "14px",
    resize: "none",
    transition: "border 0.3s",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },
  noQueryText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#777",
    marginTop: "20px",
  },
};

export default ReplyQueries;
