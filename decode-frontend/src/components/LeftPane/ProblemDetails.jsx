// src/components/LeftPane/ProblemDetails.js
import React from 'react'; // No useEffect or useState needed
import styles from './ProblemDetails.module.css';
import { FiThumbsUp, FiThumbsDown, FiStar, FiShare2 } from 'react-icons/fi';
// No apiClient import needed

// ✅ Receive problemHtml as a prop
function ProblemDetails({ problemHtml }) {
  // ✅ All state (loading, error, html) is GONE
  // ✅ All useEffect is GONE

  // ✅ No more loading/error checks, just render the layout
  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tabButton} ${styles.active}`}>Description</button>
      </div>

      {/* Problem Statement */}
      <div
        className={styles.statement}
        dangerouslySetInnerHTML={{ __html: problemHtml }} // Use the prop
      />

      {/* Spacer */}
      <div className={styles.spacer} />

      {/* Action Bar */}
      <div className={styles.actionBar}>
      </div>
    </div>
  );
}

export default ProblemDetails;