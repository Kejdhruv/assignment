import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") return null;

  const handleLogout = () => {
    fetch("http://localhost:4898/Auth/Logout", {
      method: "GET",
      credentials: "include",
    })
      .then(() => navigate("/"))
      .catch((err) => console.error("Logout failed", err));
  };

  return (
    <nav className="navbar">
     
      <div className="navbar-left">
        <span className="brand-text">Clinikk</span>
      </div>

     
      <div className="navbar-right">
        <button
          className="nav-btn"
          onClick={() => navigate("/profile")}
        >
          View Profile
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate("/admin")}
        >
          Admin Dashboard
        </button>
        <button onClick={handleLogout} className="nav-btn logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;