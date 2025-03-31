import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";

const AdminPaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    // Filter based on searchEmail and searchDate
    let filtered = history;

    if (searchEmail) {
      filtered = filtered.filter((record) =>
        (record.investorEmail || "").toLowerCase().includes(searchEmail.toLowerCase())
      );
    }
    if (searchDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.createdAt)
          .toISOString()
          .substring(0, 10);
        return recordDate === searchDate;
      });
    }
    setFilteredHistory(filtered);
  }, [searchEmail, searchDate, history]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/payment-historyI");
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

  return (
    <div>
      <AdminDashboard />
      <div style={styles.page}>
        <h2 style={styles.header}>Admin Payment History</h2>

        {/* Search Filters */}
        <div style={styles.searchContainer}>
          <div style={styles.searchField}>
            <label style={styles.label}>Investor Email: </label>
            <input
              type="text"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.searchField}>
            <label style={styles.label}>Date: </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              style={styles.input}
            />
          </div>
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
                  <th style={styles.tableCell}>Order ID</th>
                  <th style={styles.tableCell}>Investor Email</th>
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
                    <td style={styles.tableCell}>{record.orderId}</td>
                    <td style={styles.tableCell}>{record.investorEmail}</td>
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
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    fontSize: "32px",
    color: "#333",
    marginBottom: "30px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "20px",
  },
  searchField: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  label: {
    fontSize: "18px",
    color: "#333",
  },
  input: {
    padding: "8px 12px",
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
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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

export default AdminPaymentHistory;
