import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './InterviewReport.module.css';
import { Bar } from 'react-chartjs-2';
import apiClient from '../services/apiClient'; // ✅ Import your API client

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InterviewReport() {
  const navigate = useNavigate();
  const location = useLocation();

  // You might receive something like { submissionId } from previous page
  const { submissionId } = location.state || {};

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch report data from backend
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/questions/report', {
          params: { submissionId }, // backend can read ?submissionId=
        });
        setReportData(response.data);
      } catch (err) {
        console.error('❌ Failed to fetch report:', err);
        setError('Failed to load report. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [submissionId]);

  if (loading) {
    return (
      <div className={styles.reportContainer}>
        <h1 className={styles.mainTitle}>Interview Report</h1>
        <p style={{ color: '#aaa', marginTop: '2rem' }}>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.reportContainer}>
        <h1 className={styles.mainTitle}>Interview Report</h1>
        <p style={{ color: 'red', marginTop: '2rem' }}>{error}</p>
        <button
          className={styles.dashboardButton}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className={styles.reportContainer}>
        <h1 className={styles.mainTitle}>Interview Report</h1>
        <p style={{ color: '#ccc', marginTop: '2rem' }}>No report data available.</p>
      </div>
    );
  }

  // ✅ Prepare chart data
  const chartData = {
    labels: ['Code Structure', 'Code Logic', 'Edge Cases'],
    datasets: [
      {
        label: 'AI Score (out of 10)',
        data: [
          reportData.scores?.structure || 0,
          reportData.scores?.logic || 0,
          reportData.scores?.edgeCases || 0,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'AI Performance Analysis',
        font: { size: 18 },
        color: '#eee',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: '#ccc', font: { size: 14 } },
        grid: { display: false },
      },
    },
  };

  const verdictClass =
    reportData.verdict === 'Passed'
      ? styles.verdictPassed
      : styles.verdictFailed;

  return (
    <div className={styles.reportContainer}>
      <h1 className={styles.mainTitle}>Interview Report</h1>

      <div className={styles.reportBody}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <p
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: reportData.verdict === 'Passed' ? '#4bc0c0' : '#ff6384',
              marginBottom: '30px',
            }}
          >
            {reportData.verdict}
          </p>

          <h3 className={styles.feedbackTitle}>Detailed Feedback</h3>
          <p className={styles.feedbackText}>{reportData.feedback}</p>

          <button
            className={styles.dashboardButton}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.chartWrapper}>
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewReport;
