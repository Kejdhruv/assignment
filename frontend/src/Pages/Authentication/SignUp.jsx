import "./SignUp.css";
import { useState } from "react";
import React from "react";
import { useEffect } from "react"; 
import { Navigate } from "react-router-dom"; 

export default function SignUp() {
  return (
    <div className="form-container">
      <form className="form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p className="form-footer">
        Already have an account? <span className="link">Login</span>
      </p>
    </div>
  );
}