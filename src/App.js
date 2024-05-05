import React, { useState, useRef, useEffect } from 'react';
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
    if (!message.trim()) return;  // Checks if the message is not just empty spaces
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
  
      // Update chat history with the response as plain text
      setChatHistory([...chatHistory, { msg: message, from: 'user' }, { msg: data.response, from: 'bot' }]);
      setMessage('');  // Clear the input field after sending the message
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  

  return (
    <div className="App">
      <div className="chat-container">
        <header className="chat-header">
          WhatsAI
        </header>
        <div className="chat-box">
          {chatHistory.map((chat, index) =>
            chat.structuredMsg ? <StructuredMessage key={index} data={chat.structuredMsg} />
            : <p key={index} className={`chat-message ${chat.from}`}>{chat.msg}</p>
          )}
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

function StructuredMessage({ data }) {
  if (!data || !Array.isArray(data)) {
    console.error('Data is undefined or not an array:', data);
    return <p>Data is not available or not in the expected format.</p>;
  }

  return (
    <div className="structured-message">
      {data.map((section, index) => (
        <div key={index} className="section">
          <h4>{section.title}</h4>
          {section.items?.map((item, idx) => (
            <p key={idx}>{item}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
