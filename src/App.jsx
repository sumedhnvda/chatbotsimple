import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const OPENAI_API_KEY =""

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput) return;

  
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userInput },
    ]);
    setUserInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', 
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...messages,
            { role: 'user', content: userInput },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const botResponse = response.data.choices[0].message.content;

    
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: botResponse },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: 'An error occurred. Please try again later.' },
      ]);
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-container">
        <div className="message-list">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
              style={{
                textAlign: message.role === 'user' ? 'right' : 'left',
              }}
            >
              {message.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            autoFocus
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
