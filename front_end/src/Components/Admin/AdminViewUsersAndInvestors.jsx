import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard"; // Import Admin Dashboard

const AdminViewUsersAndInvestors = () => {
  const [users, setUsers] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [investorSearch, setInvestorSearch] = useState("");

  useEffect(() => {
    fetchUsersAndInvestors();
  }, []);

  const fetchUsersAndInvestors = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:8080/api/allusers");
      const investorsResponse = await axios.get("http://localhost:8080/api/allinvestors");

      setUsers(usersResponse.data || []);
      setInvestors(investorsResponse.data || []);
      setError(""); // Clear errors
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch users and investors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Handle Delete with Confirmation and Alert
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user/investor?")) {
      try {
        await axios.delete(`http://localhost:8080/api/delete/${id}`);
        fetchUsersAndInvestors(); // Refresh list after delete
        alert("Deleted successfully! ✅");
      } catch (err) {
        console.error("Delete error:", err);
        setError("Failed to delete. Please try again.");
      }
    }
  };

  return (
    <div>
      <AdminDashboard />
      <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ textAlign: "center", fontSize: "26px", color: "#333", marginBottom: "20px" }}>Users & Investors</h2>

          {loading ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>Loading...</p>
          ) : error ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "red" }}>{error}</p>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
              {/* Users Section */}
              <div style={{ flex: 1, background: "#f9f9f9", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <h3 style={{ textAlign: "center", color: "#007bff" }}>Users</h3>
                <input
                  type="text"
                  placeholder="Search Users by Email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <ul style={{ listStyle: "none", padding: "0" }}>
                  {users.length > 0 ? (
                    users
                      .filter((user) => user.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .map((user, index) => (
                        <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd" }}>
                          <span>
                            <strong>{user.name || "Unknown User"}</strong> - {user.email}
                          </span>
                          <button
                            onClick={() => handleDelete(user._id)}
                            style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}
                          >
                            Delete
                          </button>
                        </li>
                      ))
                  ) : (
                    <p style={{ textAlign: "center", color: "#888" }}>No users found.</p>
                  )}
                </ul>
              </div>

              {/* Investors Section */}
              <div style={{ flex: 1, background: "#f9f9f9", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <h3 style={{ textAlign: "center", color: "#28a745" }}>Investors</h3>
                <input
                  type="text"
                  placeholder="Search Investors by Email..."
                  value={investorSearch}
                  onChange={(e) => setInvestorSearch(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <ul style={{ listStyle: "none", padding: "0" }}>
                  {investors.length > 0 ? (
                    investors
                      .filter((investor) => investor.email.toLowerCase().includes(investorSearch.toLowerCase()))
                      .map((investor, index) => (
                        <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd" }}>
                          <span>
                            <strong>{investor.name || "Unknown Investor"}</strong> - {investor.email}
                          </span>
                          <button
                            onClick={() => handleDelete(investor._id)}
                            style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}
                          >
                            Delete
                          </button>
                        </li>
                      ))
                  ) : (
                    <p style={{ textAlign: "center", color: "#888" }}>No investors found.</p>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewUsersAndInvestors;
