import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    // 添加用户消息到消息列表
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      // 调用后端 API
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      const reply = response.data.reply;
      const assistantMessage = { sender: 'assistant', text: reply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { sender: 'assistant', text: "Error: Unable to get response." }]);
    }
    setInput("");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Chat with GPT</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#f1f0f0'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '10px' }}
          placeholder="Type your message..."
          onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button onClick={handleSend} style={{ padding: '10px' }}>Send</button>
      </div>
    </div>
  );
}

function App() {
  return <Chat />;
}

export default App;


