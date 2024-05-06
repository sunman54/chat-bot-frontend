import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const bottomOfChat = useRef(null);

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const scrollToBottom = () => {
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const payload = { data: message };
    setChatHistory(prevHistory => [...prevHistory, { msg: message, from: 'user' }]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('https://sunman54.pythonanywhere.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const data = await response.json();
      setTimeout(() => {
        if (!data.response || typeof data.response !== 'string') {
          throw new Error('Invalid or missing data response');
        }

        setChatHistory(prevHistory => [...prevHistory, { msg: data.response, from: 'bot', isMarkdown: true }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Fetch error:', error);
      setIsTyping(false);
      setChatHistory(prevHistory => [...prevHistory, { msg: "I'm so tired, Can we talk later?", from: 'bot', isMarkdown: false }]);
    }
  };

  const clearMessages = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <div className="App">
      <div className="chat-container">
        <header className="chat-header">
          <img src="../public/chat_logo.png" alt="Chat Logo" className="chat-logo"/>
          WhatsAI ChatBot
          <button onClick={clearMessages} className="clear-button">Clear Messages</button>
        </header>
        <div className="chat-box">
          {chatHistory.map((chat, index) =>
            chat.from === 'bot' && chat.isMarkdown ? 
              <ReactMarkdown key={index} className={`chat-message ${chat.from}`}>{chat.msg}</ReactMarkdown> :
              <p key={index} className={`chat-message ${chat.from}`}>{chat.msg}</p>
          )}
          {isTyping && <p className="chat-message bot typing-indicator">Bot is typing...</p>}
          <div ref={bottomOfChat} />
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' and sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
