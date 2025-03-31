import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import InvestorNavBar from "./InvestorNavBar";

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Retrieve investor email from cookies
  const investorEmail = Cookies.get("investorEmail");

  useEffect(() => {
    if (!investorEmail) {
      setError("Investor not logged in.");
      setLoading(false);
      return;
    }
    fetchPaymentHistory();
  }, [investorEmail]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/payment-history?investorEmail=${investorEmail}`
      );
      if (response.data.success) {
        setHistory(response.data.history);
        setFilteredHistory(response.data.history);
        setError("");
      } else {
        setError("No payment history found.");
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError("Failed to fetch payment history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update filtered history based on selected date
  useEffect(() => {
    if (!searchDate) {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter((record) => {
        // Convert record.createdAt into a yyyy-mm-dd format
        const recordDate = new Date(record.createdAt).toISOString().substring(0, 10);
        return recordDate === searchDate;
      });
      setFilteredHistory(filtered);
    }
  }, [searchDate, history]);

  return (
    <div style={styles.page}>
      <InvestorNavBar />
      <div style={styles.container}>
        <h2 style={styles.header}>Payment History</h2>
        <div style={styles.searchContainer}>
          <label htmlFor="searchDate" style={styles.label}>
            Search by Date:
          </label>
          <input
            type="date"
            id="searchDate"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>
        {loading ? (
          <p style={styles.message}>Loading payment history...</p>
        ) : error ? (
          <p style={{ ...styles.message, color: "#ff4d4d" }}>{error}</p>
        ) : filteredHistory.length === 0 ? (
          <p style={styles.message}>No payment records found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableRowHeader}>
                  <th style={styles.tableCell}>Milestone No</th>
                  <th style={styles.tableCell}>Campaign Category</th>
                  <th style={styles.tableCell}>Campaign Title</th>
                  <th style={styles.tableCell}>Amount</th>
                  <th style={styles.tableCell}>Status</th>
                  <th style={styles.tableCell}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record) => (
                  <tr key={record.orderId} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      {record.milestoneDetails?.milestoneNo || "N/A"}
                    </td>
                    <td style={styles.tableCell}>
                      {record.campaignDetails?.category || "N/A"}
                    </td>
                    <td style={styles.tableCell}>
                      {record.campaignDetails?.title || "N/A"}
                    </td>
                    <td style={styles.tableCell}>₹{record.amount}</td>
                    <td style={styles.tableCell}>{record.status}</td>
                    <td style={styles.tableCell}>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)",
    minHeight: "100vh",
    paddingBottom: "40px",
  },
  container: {
    backgroundColor: "#ffffffcc",
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
  },
  header: {
    textAlign: "center",
    fontSize: "32px",
    color: "#333",
    marginBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  label: {
    fontSize: "18px",
    color: "#333",
  },
  dateInput: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableRowHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    textTransform: "uppercase",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
  },
  tableCell: {
    padding: "12px 15px",
    textAlign: "center",
  },
};

export default PaymentHistory;
