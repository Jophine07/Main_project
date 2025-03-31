import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import UserSignUp from './Components/UserSignUp';
import SignIn from './Components/SignIn';
import AddCampaign from './Components/AddCampaign';
import UserNavBar from './Components/UserNavBar';
import YourCampaigns from './Components/YourCampaigns';
import S_pred from './Components/S_pred';
import SubmitQuery from './Components/Investor/SubmitQuery';
import ReplyQueries from './Components/ReplyQueries';
import InvestorNavBar from './Components/Investor/InvestorNavBar';
import ViewCampaigns from './Components/Investor/ViewCampaigns';
import S_predI from './Components/Investor/S_predI';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminViewCampaigns from './Components/Admin/AdminViewCampaigns';
import FraudPrediction from './Components/Admin/FraudPrediction';
import AdminViewUsersAndInvestors from './Components/Admin/AdminViewUsersAndInvestors';
import AdminViewQueries from './Components/Admin/AdminViewQueries';
import FraudPredictionI from './Components/Investor/FraudPredictionI';
import Donate from './Components/Investor/Donate';
import UserReply from './Components/Investor/UserReply';
import MilestoneForm from './Components/MilestoneForm';
import AdminMilestoneTracking from './Components/Admin/AdminMileStoneTracking';
import Tracker from './Components/Investor/Tracker';
import PaymentHistory from './Components/Investor/PaymentHistory';
import AdminPaymentHistory from './Components/Admin/AdminPaymentHistory';


function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/UserSignUp'element={<UserSignUp/>}/>
        <Route path='/SignIn'element={<SignIn/>}/>
        <Route path='/AdminLogin'element={<AdminLogin/>}/>

        {/*---------Admin Dashboard-------- */}

        <Route path='/AdminViewCampaigns' element={<AdminViewCampaigns/>}/>
        <Route path='/admindashboard' element={<AdminDashboard/>}/>
        <Route path='/FraudPrediction' element={<FraudPrediction/>}/>
        <Route path='/AdminViewUsersAndInvestors' element={<AdminViewUsersAndInvestors/>}/>
        <Route path='/AdminViewQueries' element={<AdminViewQueries/>}/>
        <Route path="/AdminMilestoneTracking/:campaignId" element={<AdminMilestoneTracking />} />
        <Route path="/AdminPaymentHistory" element={<AdminPaymentHistory />} />





        {/*---------User Dashboard-------- */}
        <Route path='/AddCampaign'element={<AddCampaign/>}/>
        <Route path='/usernavbar'element={<UserNavBar/>}/>
        <Route path='/yourcampaigns'element={<YourCampaigns/>}/>
        <Route path='/s_pred' element={<S_pred/>}/>
        <Route path='/replyqueries' element={<ReplyQueries/>}/>
        <Route path="/MilestoneForm/:campaignId" element={<MilestoneForm />} />




        {/* -------------Investor Dashboard-----------*/}
        <Route path='/investornavbar' element={<InvestorNavBar/>}/>
        <Route path='/viewcampaigns' element={<ViewCampaigns/>}/>
        <Route path='/submitquery'element={<SubmitQuery/>}/>
        <Route path='/s_predi'element={<S_predI/>}/>
        <Route path='/admindashboard'element={<AdminDashboard/>}/> 
        <Route path='/FraudPredictionI'element={<FraudPredictionI/>}/> 
        <Route path='/donate'element={<Donate/>}/> 
        <Route path='/UserReply'element={<UserReply/>}/> 
        <Route path="/Tracker/:campaignId" element={<Tracker />} />
        <Route path="/PaymentHistory" element={<PaymentHistory />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
