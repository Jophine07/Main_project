import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminLogin = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const [formData, setFormData] = useState({
    admin_name: "",
    admin_password: "",
  });

  const [error, setError] = useState(""); // State for error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8080/adminLogin", formData);

      console.log("Response:", response.data); // Debugging: Log response

      if (response.data.status === "Login Success") {
        alert("✅ Admin Login Successful! Redirecting...");
        navigate("/adminDashboard"); // Redirect to Admin Dashboard
      } else {
        setError(response.data.status);
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        if (error.response.status === 404) {
          setError("⚠️ Admin Not Found!");
        } else if (error.response.status === 401) {
          setError("❌ Incorrect Password!");
        } else {
          setError("⚠️ Something went wrong! Try again later.");
        }
      } else {
        setError("⚠️ Network Error! Please check your connection.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#ecf0f1",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>Admin Login</h2>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            name="admin_name"
            placeholder="Admin Name"
            value={formData.admin_name}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
            }}
          />
          <input
            type="password"
            name="admin_password"
            placeholder="Password"
            value={formData.admin_password}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              fontSize: "18px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.3s",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
