import { useState } from "react";
import { FaPrescriptionBottleAlt, FaFileInvoice } from "react-icons/fa";
import Login from "./Login";
import SignUp from "./SignUp";
import "./Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
       
        <div className="auth-left">
          <h1 className="auth-title">Clinikk</h1>
          <p className="auth-subtitle">Securely manage your claims and bills in one place.</p>

          <div className="auth-icons">
            <div className="icon-wrapper">
              <FaPrescriptionBottleAlt size={60} color="#7b3fe4" />
              <p>Prescription</p>
            </div>
            <div className="icon-wrapper">
              <FaFileInvoice size={60} color="#7b3fe4" />
              <p>Bills</p>
            </div>
          </div>
        </div>

   
        <div className="auth-right">
          <div className="auth-header">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <p>{isLogin ? "Welcome back! Please login." : "Create your account."}</p>
          </div>

          {isLogin 
            ? <Login /> 
            : <SignUp onSignupSuccess={() => setIsLogin(true)} />  
          }

          <p className="auth-toggle">
            {isLogin ? (
              <>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign Up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsLogin(true)}>Login</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}