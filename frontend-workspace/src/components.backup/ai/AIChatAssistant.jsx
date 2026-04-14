import React from "react";
/* eslint-disable no-unused-vars */
// src/components/ai/AIChatAssistant.jsx

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Tham AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you find qualified professionals for your project. Try using our advanced search filters!",
        "Based on your profile, I recommend completing the React course to improve your ranking.",
        "I found 5 new potential matches that fit your criteria. Would you like to see them?",
        "Your profile is 75% complete. Completing it will increase your visibility by 200%!",
        "I notice you haven't set your availability. Setting it to 'immediate' can help you get more connections."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button 
        className="ai-chat-toggle"
        onClick={() => setIsOpen(true)}
      >
        🤖 AI Assistant
      </button>
    );
  }

  return (
    <div className="ai-chat-assistant">
      <div className="chat-header">
        <h4>🤖 Tham AI Assistant</h4>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about the platform..."
          rows={2}
        />
        <button onClick={handleSendMessage} disabled={!inputText.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatAssistant;