import "./SignUp.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp({ onSignupSuccess }) { 
    
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("");

  const handleNameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newData = { username: Username, email: Email, password: Password };

    try {
      const response = await fetch(`http://localhost:4898/Auth/Signup`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });

      if (!response.ok) throw new Error("Failed to register");

      // Show success toast
       toast.success("🎉 User Successfully Signed Up!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
         
          fontWeight: "600",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(16, 220, 26, 0.2)",
          fontSize: "1rem",
        },
      });

      // After toast, switch to login form
      if (onSignupSuccess) {
        setTimeout(() => onSignupSuccess(), 2100);
      }

    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Signup failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={Username} onChange={handleNameChange} required />
        <input type="email" placeholder="Email" value={Email} onChange={handleEmailChange} required />
        <input type="password" placeholder="Password" value={Password} onChange={handlePasswordChange} required />
        <button type="submit">Sign Up</button>
      </form>

      <p className="form-footer">
        Already have an account? <span className="link" onClick={onSignupSuccess}>Login</span>
      </p>

      <ToastContainer />
    </div>
  );
}