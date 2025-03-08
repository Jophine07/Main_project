import React from 'react'
import { Link } from 'react-router-dom'

const InvestorNavBar = () => {
  return (
    <div>
        <h1>FUNDWISE INVESTOR DASHBOARD</h1>
        <br></br>

     <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">FundWise</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/viewcampaigns">View_Campaigns</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/s_predi">Success_Prediction</Link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default InvestorNavBar