import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSocket } from '../../services/websocket';
import { Send } from 'lucide-react';

export default function ChatWindow({ userId, userName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    fetch(`/api/messages/${userId}`)
      .then(res => res.json())
      .then(setMessages);
    if (socket) {
      socket.on('new_message', (msg) => {
        if ((msg.senderId === userId && msg.receiverId === user?.id) || (msg.senderId === user?.id && msg.receiverId === userId)) {
          setMessages(prev => [...prev, msg]);
        }
      });
    }
    return () => socket?.off('new_message');
  }, [userId, user, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      body: JSON.stringify({ receiverId: userId, text: input })
    });
    const newMsg = await res.json();
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50 border">
      <div className="p-3 border-b flex justify-between">
        <span className="font-semibold">Chat with {userName}</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-2 ${msg.senderId === user?.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} className="flex-1 input" placeholder="Type a message..." />
        <button onClick={sendMessage} className="btn-primary p-2"><Send size={16} /></button>
      </div>
    </div>
  );
}
