import "./Login.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useNavigate } from "react-router-dom";

export default function Login() {
    
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState(""); 
  const navigate = useNavigate(); 

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newData = { email: Email, password: Password };

    try {
      const response = await fetch(`http://localhost:4898/Auth/Login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
        credentials: "include", 
      });

      const data = await response.json();

      if (!response.ok) {

        toast.error(data.message || "Login Failed", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
        });
        return;
      }

      
      toast.success(`🎉 Welcome, ${data.user.username}!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          fontWeight: "600",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(16, 220, 26, 0.2)",
          fontSize: "1rem",
        },
      });

      
      setTimeout(() => navigate("/Home"), 2100);

    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login Failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
    
  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={Email} onChange={handleEmailChange} required />
        <input type="password" placeholder="Password" value={Password} onChange={handlePasswordChange} required />
        <button type="submit">Login</button>
      </form>
      <p className="form-footer">
        Forgot password? <span className="link">Click here</span>
      </p>

      <ToastContainer newestOnTop closeButton={false} />
    </div>
  );
}