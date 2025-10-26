// src/components/TopNavbar.js
import React, { useState, useEffect } from 'react';
import styles from './TopNavbar.module.css';

// ✅ 1. Accept 'onExit' prop
function TopNavbar({ isExitingRef, onSubmit, isSubmitting, onExit }) {
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // ✅ 2. Update timer useEffect to call 'onExit'
  useEffect(() => {
    if (timeLeft <= 0) {
      // Call the onExit function passed from ProblemPage
      onExit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onExit]); // ✅ Add onExit to dependency array

  
  // ✅ 3. The internal handleExit function is REMOVED
  // const handleExit = () => { ... }; // This is now defined in ProblemPage.js


  // ... (your existing tab close/refresh useEffect) ...
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("currentProblem");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navSection}>
        <div className={styles.logo}>DECODE</div>
      </div>
      <div className={styles.navSectionCenter}>
        <span className={styles.timer}>{formatTime(timeLeft)}</span>
      </div>
      <div className={styles.navSection}>
        <button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className={`${styles.btn} ${styles.btnSubmit}`} 
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {/* ✅ 4. Call the 'onExit' prop here */}
        <button onClick={onExit} className={`${styles.btn} ${styles.btnPremium}`}>
          Exit
        </button>
      </div>
    </nav>
  );
}

export default TopNavbar;