import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    userType: "user",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/signup", formData);
      console.log("User Signed Up:", response.data);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert("Signup failed. Please try again.");
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
        <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>Sign Up</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ textAlign: "left", fontWeight: "bold", marginBottom: "5px", color: "#2c3e50" }}>Sign Up As:</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <option value="user">User</option>
            <option value="investor">Investor</option>
          </select>

          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ padding: "12px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px" }} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ padding: "12px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px" }} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: "12px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px" }} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={{ padding: "12px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px" }} />
          <button type="submit" style={{ padding: "12px", fontSize: "18px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", transition: "0.3s", fontWeight: "bold" }} onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")} onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}>Sign Up</button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Already have an account? <a href="/SignIn" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
