// src/pages/ProblemPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import TopNavbar from '../components/TopNavbar';
import ProblemDetails from '../components/LeftPane/ProblemDetails';
import CodeEditor from '../components/RightPane/CodeEditor';
import ExecutionPanel from '../components/RightPane/ExecutionPanel';
import styles from './ProblemPage.module.css';
import apiClient from '../services/apiClient';

import LoadingScreen from '../components/common/LoadingScreen';

function ProblemPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // const startAudio = location.state?.startAudio || false; // This line seems unused now
  const [isIntroPlaying, setIsIntroPlaying] = useState(false); // This line seems unused now
  const hasPlayedRef = useRef(false);

  const [problemHtml, setProblemHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isExitingRef = useRef(false);

  const [code, setCode] = useState(`class Solution {
    public int numberOfPairs(int[][] points) {
        // Write your code here
    }
}`);
  const [language, setLanguage] = useState('java');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submissionId, setSubmissionId] = useState(null); // ✅ Store submission ID

  const playTTS = async (text) => {
    try {
      const response = await fetch('http://localhost:5050/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
      });

      if (!response.ok) throw new Error(`TTS request failed with status ${response.status}`);

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        setIsSpeaking(false);
      });

      setIsSpeaking(true);
      setTimeout(() => {
        audio.play().catch((err) => console.error('[TTS] Audio play failed:', err));
      }, 500);
    } catch (error) {
      console.error('[TTS] Error:', error);
      setIsSpeaking(false);
    }
  };

  // ✅ Play intro TTS when the page loads
  useEffect(() => {
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const introText = `Hello and welcome to DECODE! I'm your virtual interviewer for today.
    You’ll find your question on the left, and your coding space on the right.
    Feel free to think aloud, ask me any questions, or request hints while you solve.
    Once you’re done, simply press Submit to have your code reviewed.
    Let’s begin — all the best, and happy coding!`;

    setTimeout(() => {
      playTTS(introText);
    }, 1000);
  }, []);

  // ... (your existing data-fetching useEffect) ...
  useEffect(() => {
    const fetchProblem = () => {
      const savedProblem = localStorage.getItem('currentProblem');

      if (savedProblem) {
        setProblemHtml(savedProblem);
        setIsLoading(false);
      } else {
        apiClient
          .get('/api/questions/random', { responseType: 'text' })
          .then((res) => {
            setProblemHtml(res.data);
            localStorage.setItem('currentProblem', res.data);
            setIsLoading(false);
            // TODO: You should also get and set a problem ID here
            // e.g., setProblemId(res.data.id);
          })
          .catch((err) => {
            console.error('❌ Error fetching problem:', err);
            setError(err.response?.data?.message || 'Failed to fetch problem');
            setIsLoading(false);
          });
      }
    };
    
    fetchProblem();
  }, []);

  // ... (your existing Fullscreen Warning Logic useEffect) ...
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && !isExitingRef.current) {
        localStorage.removeItem("currentProblem");
        alert("Warning: Fullscreen mode exited. The exam has been ended.");
        navigate("/dashboard");
      }
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [navigate]);

  
  // ✅ Define the submit handler here
  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log('Submitting:', { language, code });

    try {
      // Send the code to your backend using apiClient
      // Assume the backend returns a submission ID and the AI feedback text
      const response = await apiClient.post('/api/questions/submit', {
        code: code,
        language: language,
        // problemId: yourProblemId, // You should pass the problem ID
      });

      // ✅ Assuming response.data is { submissionId: "some-id", feedback: "..." }
      const { submissionId: newSubmissionId, feedback } = response.data;
      
      setSubmissionId(newSubmissionId); // ✅ Save the submission ID
      
      console.log('🟢 Submission response:', feedback);
      
      // ✅ Speak out the result using TTS
      await playTTS(feedback || "Your solution has been submitted.");

    } catch (err) {
      console.error('❌ Error submitting code:', err);
      const errorText = err.response?.data?.message || 'Submission failed. Please try again.';
      alert(errorText);
      await playTTS(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 1. Define handleExit logic in the parent component
  const handleExit = () => {
    if (isExitingRef) {
      isExitingRef.current = true;
    }
    
    // Clear data
    localStorage.removeItem("currentProblem");
    alert("Exam ended. Generating your report...");
    
    // Exit fullscreen *before* navigating
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    // ✅ 2. Navigate to the new report page
    navigate("/report", { state: { submissionId: submissionId } });
  };


  if (isLoading) {
     return <LoadingScreen />;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h2>Error loading problem:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* ✅ 3. Pass handlers (onSubmit, onExit) down to TopNavbar */}
      <TopNavbar 
        isExitingRef={isExitingRef} 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onExit={handleExit}
      />
      
      <div className={styles.mainWorkspace}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={45} minSize={30} className={styles.leftPanel}>
            <ProblemDetails problemHtml={problemHtml} />
          </Panel>
          <PanelResizeHandle className={styles.resizeHandle} />
          <Panel defaultSize={55} minSize={30} className={styles.rightPanel}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                {/* ✅ 4. Pass state and handlers down to CodeEditor */}
                <CodeEditor 
                  code={code}
                  onCodeChange={setCode}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </Panel>
              <PanelResizeHandle className={styles.resizeHandleVertical} />
              <Panel defaultSize={22} minSize={22}>
                <ExecutionPanel />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;