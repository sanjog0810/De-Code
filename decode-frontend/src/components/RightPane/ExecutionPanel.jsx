import React, { useState } from 'react';
import styles from './ExecutionPanel.module.css';
import apiClient from '../../services/apiClient';

function ExecutionPanel() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  // ... (no changes to playTTS, handleSend, or handleKeyDown) ...
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

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: 'user', text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await apiClient.post('/api/questions/chat', message, {
        headers: { 'Content-Type': 'text/plain' },
      });

      const aiReply = res.data; // plain string
      const aiMsg = { sender: 'ai', text: aiReply };
      setChat((prev) => [...prev, aiMsg]);
      await playTTS(aiReply);
    } catch (err) {
      console.error('❌ Error chatting with AI:', err);
      const errorMsg = { sender: 'ai', text: 'Sorry, I could not respond right now.' };
      setChat((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.chatWrapper}>
        <div className={styles.chatHeader}>Chat with Interviewer</div>

        {/* ✅ Step 1: Add a new wrapper for ALL scrollable content */}
        <div className={styles.contentArea}>
          {/* Conditionally render the chat box INSIDE */}
          {isChatVisible && (
            <div className={styles.chatBox}>
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={msg.sender === 'user' ? styles.userMessage : styles.aiMessage}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          )}

          {/* Status indicators are also INSIDE the scrollable area */}
          <div className={styles.statusIndicators}>
            {loading && <div className={styles.typing}>AI is typing...</div>}
            {isSpeaking && <div className={styles.typing}>🔊 AI is speaking...</div>}
          </div>
        </div>

        {/* ✅ Step 2: Input and Buttons are now OUTSIDE the scroll wrapper */}
        <textarea
          className={styles.chatInput}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || isSpeaking}
        />

        <div className={styles.buttonRow}>
          <button
            className={styles.viewButton}
            onClick={() => setIsChatVisible(!isChatVisible)}
          >
            {isChatVisible ? 'Hide Conversation' : 'View Conversation'}
          </button>
          
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={loading || isSpeaking}
          >
            {loading ? 'Sending...' : isSpeaking ? 'Speaking...' : 'Send'}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default ExecutionPanel;