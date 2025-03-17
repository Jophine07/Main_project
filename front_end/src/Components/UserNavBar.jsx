import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove all session data
    sessionStorage.clear();
    
    // Remove all cookies related to authentication
    Cookies.remove("authToken");
    Cookies.remove("userEmail");
    Cookies.remove("userType");
    Cookies.remove("investorEmail");

    // Redirect to Sign-In page
    navigate('/signin');
  };

  return (
    <div>
      <h1>FUNDWISE USER DASHBOARD</h1>
      <br />

      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">Fundwise</Link>
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

          <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/addcampaign">Add Campaign</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/yourcampaigns">Your Campaigns</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/replyqueries">Your Queries</Link>
              </li>
            </ul>

            {/* Logout Button */}
            <button 
              className="btn btn-danger ms-auto" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserNavBar;
