import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import DonatorDashboard from './pages/DonatorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import Login from './pages/Login';
 


// You can also keep your layout components imported if you plan to use them in a layout route later:
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
       
      <Routes>
        {/* Set your default homepage or dashboard route */}
        <Route path="/" element={<Homepage />} />

        {/* Route for the Donator Dashboard */}
        <Route path="/dashboard" element={<DonatorDashboard />} />
        <Route path="/receiver-dashboard" element={<ReceiverDashboard />} />

        {/* Route for the Register page */}
        <Route path="/register" element={<Register />} />
        {/*route for login page */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}