import React from "react";

const Home = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        backgroundColor: "#f4f4f4",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#2c3e50",
          fontSize: "42px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Welcome to FundWise
      </h1>
      <p
        style={{
          color: "#34495e",
          fontSize: "20px",
          maxWidth: "600px",
          lineHeight: "1.5",
          marginBottom: "30px",
        }}
      >
        Empowering Dreams with Intelligent Funding
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        <a
          href="/UserSignup"
          style={{
            textDecoration: "none",
            padding: "12px 24px",
            fontSize: "18px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#27ae60")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2ecc71")}
        >
          Sign Up
        </a>

        <a
          href="/SignIn"
          style={{
            textDecoration: "none",
            padding: "12px 24px",
            fontSize: "18px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default Home;
