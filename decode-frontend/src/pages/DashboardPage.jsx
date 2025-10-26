import React from "react";
import ParticlesComponent from "../components/layout/particles";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  // ✅ --- Create a new function to handle starting the exam ---
  const handleStartExam = async () => {
    try {
      // Request fullscreen on the entire document
      // This is the "F11" (browser) fullscreen mode
      await document.documentElement.requestFullscreen();
    } catch (err) {
      // Log an error if it fails (e.g., user denies permission)
      // We still continue to the exam page.
      console.error("Fullscreen request failed:", err);
    }
    
    // Navigate to the problem page
    navigate("/problem");
  };

  return (
    <div className="dashboard-wrapper">
      <ParticlesComponent id="tsparticles" />
      <div className="section-content dashboard-content">
        
        <header className="dashboard-header">
          <h2 className="section-title dashboard-title">
            Welcome,
          </h2>
          <p className="section-subtitle dashboard-subtitle">
            Choose your mock interview challenge or review your progress.
          </p>
        </header>

        <div className="features-grid">
          
          {/* ✅ --- Updated onClick handler --- */}
          <div
            className="feature-card dashboard-card"
            onClick={handleStartExam} // Use the new function
          >
            <h3>DSA Interview</h3>
            <p className="card-meta">🕒 30 Minutes</p>
            <p className="text-secondary">
              Tackle a focused session on Data Structures and Algorithms.
            </p>
            <button className="btn btn-primary card-button">
              Start Interview
            </button>
          </div>

          {/* ... (rest of your locked cards) ... */}
          <div className="feature-card dashboard-card locked">
            <span className="card-badge">Upcoming</span>
            <h3>Full Interview</h3>
            <p className="card-meta">🕒 1 Hour</p>
            <p className="text-secondary">
              A comprehensive review covering your Resume, CSE Core Concepts, and DSA.
            </p>
            <button className="btn btn-primary card-button" disabled>
              Coming Soon
            </button>
          </div>
        </div>

        <h2 className="section-title dashboard-title section-break">
          Past Interview Analysis
        </h2>

        <div className="features-grid">
          {/* ... (rest of your analysis cards) ... */}
          <div className="feature-card dashboard-card locked">
            <span className="card-badge">Upcoming</span>
            <h3>Overall Analysis</h3>
            <p className="text-secondary">
              View your cumulative performance trends and improvement areas.
            </p>
            <div className="graph-placeholder">
              <p>📈 Performance graph will appear here</p>
            </div>
          </div>
          <div className="feature-card dashboard-card locked">
            <span className="card-badge">Upcoming</span>
            <h3>Individual Test Analysis</h3>
            <p className="text-secondary">
              Get a detailed breakdown and feedback for each mock interview.
            </p>
            <div className="graph-placeholder">
              <p>📊 Detailed report analytics will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}