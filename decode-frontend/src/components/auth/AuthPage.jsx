import React, { useState } from "react";
import "../../styles/main.css";
import { loginUser, registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check-icon"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (isLoginView) {
        await loginUser(data.email, data.password);
        setMessage("✅ Login successful!");
        navigate("/dashboard"); // ✅ redirect to dashboard
      } else {
        await registerUser(data.username, data.email, data.password);
        setMessage("✅ Registration successful! Please sign in.");
        setIsLoginView(true);
      }
    } catch (err) {
      const errorMsg = err.message || "Something went wrong.";
      setMessage("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setMessage("");
  };

  const messageType = message.startsWith("✅")
    ? "success"
    : message.startsWith("❌")
    ? "error"
    : "";

  return (
    <div className="auth-layout-grid">
      {/* --- 1. Form Panel --- */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <h1 className="header">DECODE</h1>
          <p className="tagline">
            {isLoginView
              ? "Sign in to access your dashboard."
              : "Create an account to start preparing."}
          </p>

          {isLoginView ? (
            <LoginForm onSubmit={handleFormSubmit} loading={loading} />
          ) : (
            <RegisterForm onSubmit={handleFormSubmit} loading={loading} />
          )}

          <p className="toggle-text">
            {isLoginView
              ? "Don't have an account? "
              : "Already have an account? "}
            <span className="toggle-link" onClick={toggleView}>
              {isLoginView ? "Sign Up" : "Sign In"}
            </span>
          </p>

          {message && (
            <p className={`status-message ${messageType}`}>{message}</p>
          )}
        </div>
      </div>

      {/* --- 2. Branding Panel --- */}
      <div className="auth-branding-panel">
        <div className="branding-content">
          <h2 className="branding-title">
            Stop Grinding.
            <br />
            Start Interviewing.
          </h2>
          <p className="branding-subtitle">
            The AI-powered simulation that prepares you for the one thing
            LeetCode can't.
          </p>
          <ul className="branding-features">
            <li>
              <CheckIcon />
              <span>AI-Powered Mock Interviews</span>
            </li>
            <li>
              <CheckIcon />
              <span>1500+ Unique Problems</span>
            </li>
            <li>
              <CheckIcon />
              <span>Deep Complexity Analysis</span>
            </li>
            <li>
              <CheckIcon />
              <span>Real-time "Notepad" Environment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const LoginForm = ({ onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="form-container">
    <div className="input-group">
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" required className="input-field" />
    </div>
    <div className="input-group">
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" required className="input-field" />
    </div>
    <button type="submit" className="btn btn-primary" disabled={loading}>
      {loading ? "Signing In..." : "Sign In"}
    </button>
  </form>
);

const RegisterForm = ({ onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="form-container">
    <div className="input-group">
      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" required className="input-field" />
    </div>
    <div className="input-group">
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" required className="input-field" />
    </div>
    <div className="input-group">
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" required className="input-field" />
    </div>
    <button type="submit" className="btn btn-primary" disabled={loading}>
      {loading ? "Creating Account..." : "Create Account"}
    </button>
  </form>
);
