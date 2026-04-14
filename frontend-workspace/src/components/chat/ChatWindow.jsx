import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../../services/websocket';
import { useAuth } from '../../contexts/AuthContext';

const ChatWindow = ({ contractId, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [blocked, setBlocked] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = getSocket();
    socketRef.current.emit('join', { contractId });
    socketRef.current.on('message', (msg) => setMessages(prev => [...prev, msg]));
    socketRef.current.on('fraud_warning', (data) => {
      alert(data.reason);
      setBlocked(true);
    });
    return () => socketRef.current.disconnect();
  }, [contractId]);

  const sendMessage = () => {
    if (!input.trim() || blocked) return;
    socketRef.current.emit('message', { contractId, text: input, senderId: user.id });
    setInput('');
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => <div key={i}><b>{msg.senderName}:</b> {msg.text}</div>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} disabled={blocked} />
      <button onClick={sendMessage} disabled={blocked}>Send</button>
    </div>
  );
};

export default ChatWindow;
