import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Default route for the login page */}
          <Route path="/" element={<Login />} /> {/* This will be the default page */}
          
          {/* Additional routes */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;