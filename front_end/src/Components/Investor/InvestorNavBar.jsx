import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const InvestorNavBar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent back navigation after logout
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleLogout = () => {


    Cookies.remove("authToken");
    Cookies.remove("userEmail");
    Cookies.remove("userType");
    Cookies.remove("investorEmail");

    sessionStorage.removeItem("investorSession");

    navigate("/");
    window.location.reload(); 
  };

  return (
    <div>
      <h1>FUNDWISE INVESTOR DASHBOARD</h1>
      <br />

      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">FundWise</a>
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
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/viewcampaigns">
                  View Campaigns
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/FraudPredictionI">
                  Fraud Prediction
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/userreply">
                  User_Replies
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/PaymentHistory">
                  Payment History
                </Link>
              </li>
            </ul>
            {/* Logout Button */}
            <button className="btn btn-danger ms-auto" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default InvestorNavBar;
