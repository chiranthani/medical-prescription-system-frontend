import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import 'antd/dist/reset.css';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import Prescription from './pages/Prescription';
import Quotation from './pages/Quotation';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <Router>
      <Routes>
        <Route index path="*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification/>} />
        <Route path="/prescriptions" element={<ProtectedRoute><Prescription /></ProtectedRoute>} />
         <Route path="/quotations" element={<ProtectedRoute><Quotation /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;