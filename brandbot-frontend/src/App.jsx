import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ClientDashboard from "./components/ClientDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ContentHistory from "./components/content_history";
import Pricing from "./components/pricing";
import Profile from "./components/profile";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/content-history" element={<ContentHistory />} />
        <Route path="/client/pricing" element={<Pricing />} />
        <Route path="/client/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
