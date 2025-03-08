import React from 'react'
import { Link } from 'react-router-dom'

const UserNavBar = () => {
  return (
    <div>
        <h1>FUNDWISE USER DASHBOARD</h1>
        <br></br>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <Link class="navbar-brand" href="#">Fundwise</Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to="/addcampaign">Add_Campaign</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/yourcampaigns">Your_Campaigns</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/s_pred">Success_Prediction</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/replyqueries">Your_Queries</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>



    </div>
  )
}

export default UserNavBar