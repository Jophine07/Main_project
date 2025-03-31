import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
    });

    alert("🚪 Logged out successfully!");
    navigate("/adminlogin"); // Redirect to login page
  };

  return (
    <div>
      <h1>ADMIN DASHBOARD</h1>
      <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/AdminViewCampaigns">
              FUNDWISE
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/AdminViewCampaigns">
                    View Campaigns
                  </Link>
                </li>
  
                <li className="nav-item">
                  <Link className="nav-link" to="/FraudPrediction">
                    Fraud Prediction
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/AdminViewUsersAndInvestors">
                    View Logins
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/AdminViewQueries">
                    Queries
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/adminpaymenthistory">
                  Payment History
                  </Link>
                </li>
              </ul>
            </div>
            {/* Logout Button */}
            <button
              className="btn btn-danger ms-auto"
              onClick={handleLogout}
              style={{ marginLeft: "auto", padding: "10px 15px" }}
            >
              Logout 🚪
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
