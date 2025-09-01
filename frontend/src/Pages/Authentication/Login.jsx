import "./Login.css";

export default function Login() {
  return (
    <div className="form-container">
      <form className="form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p className="form-footer">
        Forgot password? <span className="link">Click here</span>
      </p>
    </div>
  );
}