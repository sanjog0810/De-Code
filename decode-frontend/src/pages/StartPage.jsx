// src/pages/ExamStartPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ExamStartPage = () => {
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setStarted(true);
    navigate("/problem", { state: { startAudio: true } }); // pass state
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Online Assessment</h1>
      <div style={styles.rulesContainer}>
        <h2 style={styles.subheading}>Please Read Carefully Before Starting:</h2>
        <ul style={styles.rulesList}>
          <li>Do not switch tabs or navigate away from this page during the test.</li>
          <li>Copying, pasting, or using external resources is strictly prohibited.</li>
          <li>Any attempt to refresh or close the browser may result in termination of the exam.</li>
          <li>Ensure your internet connection is stable throughout the test.</li>
          <li>Answer all questions within the allocated time.</li>
          <li>Use only one device for taking the test.</li>
          <li>Maintain academic honesty at all times.</li>
        </ul>
      </div>
      <button style={styles.startButton} onClick={handleStart}>
        Start Exam
      </button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#2c2c2c", // slightly grey
    color: "#fff", // white text
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "1.5rem",
    marginBottom: "15px",
  },
  rulesContainer: {
    textAlign: "left",
    maxWidth: "600px",
    marginBottom: "30px",
  },
  rulesList: {
    listStyleType: "disc",
    paddingLeft: "20px",
    lineHeight: "1.6",
  },
  startButton: {
    backgroundColor: "#4caf50", // green button
    color: "#fff",
    border: "none",
    padding: "15px 30px",
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
};

export default ExamStartPage;
