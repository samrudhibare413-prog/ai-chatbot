import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const API_URL = 'http://localhost:5000/api/chat';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || uuidv4();
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history/${sessionId}`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('History load error:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await axios.post(`${API_URL}/message`, {
        message: userMessage,
        sessionId
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Kuch galat ho gaya. Dobara try karo.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete(`${API_URL}/clear/${sessionId}`);
      setMessages([]);
    } catch (error) {
      console.error('Clear error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const renderMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      <div className="chat-container">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="robot-avatar">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="30" width="60" height="50" rx="10" fill="#4a90d9"/>
                <rect x="35" y="15" width="30" height="20" rx="5" fill="#4a90d9"/>
                <rect x="48" y="10" width="4" height="8" fill="#7eb8f7"/>
                <circle cx="37" cy="48" r="8" fill="white"/>
                <circle cx="63" cy="48" r="8" fill="white"/>
                <circle cx="37" cy="48" r="4" fill="#1a1a3e"/>
                <circle cx="63" cy="48" r="4" fill="#1a1a3e"/>
                <circle cx="39" cy="46" r="1.5" fill="white"/>
                <circle cx="65" cy="46" r="1.5" fill="white"/>
                <rect x="33" y="62" width="34" height="6" rx="3" fill="white" opacity="0.8"/>
                <rect x="10" y="40" width="10" height="25" rx="5" fill="#4a90d9"/>
                <rect x="80" y="40" width="10" height="25" rx="5" fill="#4a90d9"/>
                <rect x="30" y="80" width="12" height="15" rx="5" fill="#4a90d9"/>
                <rect x="58" y="80" width="12" height="15" rx="5" fill="#4a90d9"/>
              </svg>
              <div className="status-dot"></div>
            </div>
            <div className="header-info">
              <h1>AI Assistant</h1>
              <span className="online-status">● Online</span>
            </div>
          </div>
          <div className="header-right">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`history-btn ${showHistory ? 'active' : ''}`}
            >
              📋 History
            </button>
            <button onClick={clearChat} className="clear-btn">
              🗑️ Clear
            </button>
          </div>
        </div>

        <div className="main-content">
          {/* History Sidebar */}
          {showHistory && (
            <div className="history-sidebar">
              <h3>💬 Chat History</h3>
              <div className="history-list">
                {messages.length === 0 ? (
                  <p className="no-history">Koi history nahi hai</p>
                ) : (
                  messages.filter(m => m.role === 'user').map((msg, i) => (
                    <div key={i} className="history-item">
                      <span className="history-icon">❓</span>
                      <p>{msg.content.substring(0, 40)}...</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome">
                <div className="welcome-robot">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                    <rect x="20" y="30" width="60" height="50" rx="10" fill="#4a90d9"/>
                    <rect x="35" y="15" width="30" height="20" rx="5" fill="#4a90d9"/>
                    <rect x="48" y="10" width="4" height="8" fill="#7eb8f7"/>
                    <circle cx="37" cy="48" r="8" fill="white"/>
                    <circle cx="63" cy="48" r="8" fill="white"/>
                    <circle cx="37" cy="48" r="4" fill="#1a1a3e"/>
                    <circle cx="63" cy="48" r="4" fill="#1a1a3e"/>
                    <circle cx="39" cy="46" r="1.5" fill="white"/>
                    <circle cx="65" cy="46" r="1.5" fill="white"/>
                    <rect x="33" y="62" width="34" height="6" rx="3" fill="white" opacity="0.8"/>
                    <rect x="10" y="40" width="10" height="25" rx="5" fill="#4a90d9"/>
                    <rect x="80" y="40" width="10" height="25" rx="5" fill="#4a90d9"/>
                    <rect x="30" y="80" width="12" height="15" rx="5" fill="#4a90d9"/>
                    <rect x="58" y="80" width="12" height="15" rx="5" fill="#4a90d9"/>
                  </svg>
                </div>
                <h2>Namaste! 👋</h2>
                <p>Main aapka AI Assistant hoon!</p>
                <p>Koi bhi sawaal poochho</p>
                <div className="suggestions">
                  <button onClick={() => setInput('What is React?')} className="suggest-btn">💡 What is React?</button>
                  <button onClick={() => setInput('Who is PM of India?')} className="suggest-btn">🇮🇳 PM of India?</button>
                  <button onClick={() => setInput('Tell me a joke')} className="suggest-btn">😄 Tell me a joke</button>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="msg-avatar bot-avatar-small">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="30" width="60" height="50" rx="10" fill="#4a90d9"/>
                      <rect x="35" y="15" width="30" height="20" rx="5" fill="#4a90d9"/>
                      <circle cx="37" cy="48" r="8" fill="white"/>
                      <circle cx="63" cy="48" r="8" fill="white"/>
                      <circle cx="37" cy="48" r="4" fill="#1a1a3e"/>
                      <circle cx="63" cy="48" r="4" fill="#1a1a3e"/>
                      <rect x="33" y="62" width="34" height="6" rx="3" fill="white" opacity="0.8"/>
                    </svg>
                  </div>
                )}
                <div className="message-group">
                  <div className={`bubble ${msg.role}`}
                    dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                  />
                  <span className="timestamp">
                    {msg.role === 'user' ? '👤 You' : '🤖 AI'} • {formatTime(msg.timestamp)}
                  </span>
                </div>
                {msg.role === 'user' && (
                  <div className="msg-avatar user-avatar-small">👤</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-wrapper assistant">
                <div className="msg-avatar bot-avatar-small">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="30" width="60" height="50" rx="10" fill="#4a90d9"/>
                    <rect x="35" y="15" width="30" height="20" rx="5" fill="#4a90d9"/>
                    <circle cx="37" cy="48" r="8" fill="white"/>
                    <circle cx="63" cy="48" r="8" fill="white"/>
                    <circle cx="37" cy="48" r="4" fill="#1a1a3e"/>
                    <circle cx="63" cy="48" r="4" fill="#1a1a3e"/>
                    <rect x="33" y="62" width="34" height="6" rx="3" fill="white" opacity="0.8"/>
                  </svg>
                </div>
                <div className="bubble assistant typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Apna sawaal yahan likhein... (Enter = Send, Shift+Enter = New Line)"
              rows="2"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="send-btn"
            >
              {loading ? (
                <div className="spin">⟳</div>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </div>
          <p className="footer-text">AI galti kar sakta hai — important info verify karein</p>
        </div>
      </div>
    </div>
  );
}

export default App;