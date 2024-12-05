import React, { useState } from "react";
import axios from "axios";
import "./App.css"
const Chatbot = () => {
  const [celebrity, setCelebrity] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "your-openai-api-key";

  const handleCelebrityChange = (e) => {
    setCelebrity(e.target.value);
  };

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleSendMessage = async () => {
    if (!userInput || !celebrity) {
      alert("Please select a celebrity first!");
      return;
    }

    const userMessage = { role: "user", content: userInput };
    const newChatHistory = [...chatHistory, userMessage];

    setChatHistory(newChatHistory);
    setUserInput("");

    try {
      const response = await axios.post(
        API_URL,
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: `You are impersonating ${celebrity}.` },
            ...newChatHistory,
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const botMessage = response.data.choices[0].message;
      setChatHistory([...newChatHistory, botMessage]);
      speakText(botMessage.content);
    } catch (error) {
      console.error("Error fetching GPT-4 response:", error);
    }
  };

  const speakText = (text) => {
    if (isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Celebrity Chatbot</h1>

      <label htmlFor="celebrity-input">Enter Celebrity Name:</label>
      <input
        type="text"
        id="celebrity-input"
        value={celebrity}
        onChange={handleCelebrityChange}
        placeholder="e.g., Albert Einstein"
        style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
      />

      <div
        style={{
          margin: "20px 0",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          height: "300px",
          overflowY: "auto",
        }}
      >
        {chatHistory.map((message, index) => (
          <p key={index} style={{ margin: "5px 0" }}>
            <strong>{message.role === "user" ? "You" : celebrity}:</strong>{" "}
            {message.content}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Ask a question..."
        style={{ width: "calc(100% - 110px)", marginRight: "10px" }}
      />
      <button onClick={handleSendMessage} style={{ width: "100px" }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;
