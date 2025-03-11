import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";

const AdminViewQueries = () => {
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  // 🔹 Fetch all queries
  const fetchQueries = async () => {
    try {
      const response = await axios.get("http://localhost:8080/all-queries");
      setQueries(response.data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch queries.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete a query
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      await axios.delete(`http://localhost:8080/delete-query/${id}`);
      setQueries((prev) => prev.filter((query) => query._id !== id));
      alert("Query deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete query.");
    }
  };

  // 🔹 Filter queries safely (avoid "undefined" error)
  const filteredQueries = queries.filter((query) => {
    const investorEmail = query.investorEmail || ""; // Ensure it's a string
    const userEmail = query.userEmail || ""; // Ensure it's a string
    return (
      investorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <AdminDashboard />
      <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ textAlign: "center", fontSize: "24px", color: "#333", marginBottom: "20px" }}>User & Investor Queries</h2>

          {/* 🔍 Search Bar */}
          <input
            type="text"
            placeholder="Search by Investor or User Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />

          {loading ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>Loading...</p>
          ) : error ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>{error}</p>
          ) : filteredQueries.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#666" }}>No queries found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ background: "#007bff", color: "#fff" }}>
                  <th>Investor Email</th>
                  <th>User Email</th>
                  <th>Message</th>
                  <th>Reply</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((query) => (
                  <tr key={query._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td>{query.investorEmail || "N/A"}</td>
                    <td>{query.userEmail || "N/A"}</td>
                    <td>{query.message}</td>
                    <td>{query.reply ? query.reply : "No reply yet"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(query._id)}
                        style={{
                          background: "red",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewQueries;
