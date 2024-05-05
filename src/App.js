import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const bottomOfChat = useRef(null);

  const scrollToBottom = () => {
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const payload = { data: message };

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
      if (!data.response || typeof data.response !== 'string') {
        console.error('Invalid or missing data response:', data.response);
        return;
      }

      setChatHistory([...chatHistory, { msg: message, from: 'user' }, { msg: data.response, from: 'bot', isMarkdown: true }]);
      setMessage('');
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <header className="chat-header">
          Chat with our Bot
        </header>
        <div className="chat-box">
          {chatHistory.map((chat, index) => (
            chat.from === 'bot' && chat.isMarkdown ? 
              <ReactMarkdown key={index} className={`chat-message ${chat.from}`}>{chat.msg}</ReactMarkdown> :
              <p key={index} className={`chat-message ${chat.from}`}>{chat.msg}</p>
          ))}
          <div ref={bottomOfChat} />
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
