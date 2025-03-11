import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SignIn = () => {
  const [formData, setFormData] = useState({
    userType: "user",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.email || !formData.password || !formData.userType) {
      alert("⚠️ All fields are required!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8080/Login", formData);
      console.log("Login Response:", response.data);
  
      if (response.data.status === "Login Success") {
        alert("✅ Login Successful!");
  
        // Store token, email, and userType in cookies
        Cookies.set("authToken", response.data.token, { expires: 7 });
        Cookies.set("userEmail", formData.email, { expires: 7 });
        Cookies.set("userType", formData.userType, { expires: 7 });
  
        // Store session based on userType
        if (formData.userType === "investor") {
          Cookies.set("investorEmail", formData.email, { expires: 7 });
          sessionStorage.setItem(
            "investorSession",
            JSON.stringify({ email: formData.email, loggedIn: true })
          );
        } else if (formData.userType === "user") {
          sessionStorage.setItem(
            "userSession",
            JSON.stringify({ email: formData.email, loggedIn: true })
          );
        }
  
        // Navigate based on userType
        navigate(formData.userType === "user" ? "/addcampaign" : "/viewcampaigns");
      } else if (response.data.status === "Not Found") {
        alert("⚠️ User Not Found! Please check your email.");
      } else if (response.data.status === "Incorrect Password") {
        alert("❌ Incorrect Password! Please try again.");
      } else if (response.data.status === "User Type Mismatch") {
        alert("⚠️ User type does not match. Please check your selection.");
      } else {
        alert("❌ Something went wrong. Please try again later.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert("⚠️ User Not Found! Please check your email.");
        } else if (error.response.status === 401) {
          alert("❌ Incorrect Password! Please try again.");
        } else if (error.response.status === 403) {
          alert("⚠️ User type does not match. Please check your selection.");
        } else {
          alert("❌ Something went wrong. Please try again later.");
        }
      } else {
        alert("⚠️ Network error! Check your connection.");
      }
      console.error("Error during login:", error);
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
        <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>Sign In</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              textAlign: "left",
              fontWeight: "bold",
              marginBottom: "5px",
              color: "#2c3e50",
            }}
          >
            Sign In As:
          </label>
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

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
            name="password"
            placeholder="Password"
            value={formData.password}
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
            Sign In
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <a
            href="/UserSignUp"
            style={{
              color: "#3498db",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
