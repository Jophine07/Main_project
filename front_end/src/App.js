import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import UserSignUp from './Components/UserSignUp';
import SignIn from './Components/SignIn';
import AdminLogin from './Components/AdminLogin';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/UserSignUp'element={<UserSignUp/>}/>
        <Route path='/SignIn'element={<SignIn/>}/>
        <Route path='/AdminLogin'element={<AdminLogin/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
