import { SendHorizontal } from 'lucide-react';
import React, { useState } from 'react';

interface VideoChatProps {
  videoId: string;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  color: string;
}

// Generate random hex color
const getRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#8675A9', '#D46A6A', 
    '#55B4B0', '#9B59B6', '#5D5C61', '#379683', '#7395AE'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Mock chat messages
const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    username: 'TwitchUser123',
    message: 'Nice clip!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    color: getRandomColor(),
  },
  {
    id: '2',
    username: 'GamingFan42',
    message: 'LMAO that was so funny',
    timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 min ago
    color: getRandomColor(),
  },
  {
    id: '3',
    username: 'StreamViewer99',
    message: 'Can you do it again?',
    timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 min ago
    color: getRandomColor(),
  },
  {
    id: '4',
    username: 'ProGamer2024',
    message: 'Those skills tho 👏',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
    color: getRandomColor(),
  },
  {
    id: '5',
    username: 'ChillViewer',
    message: 'I need to learn how to do that',
    timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
    color: getRandomColor(),
  },
];

export const VideoChat: React.FC<VideoChatProps> = ({ videoId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const newChatMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: newMessage,
      timestamp: new Date(),
      color: '#9146FF', // Twitch purple for user's own messages
    };
    
    setMessages([...messages, newChatMessage]);
    setNewMessage('');
  };

  return (
    <div className="video-chat h-full flex flex-col justify-between">
      <div className="p-3 border border-neutral-800">
        <h3 className="font-medium text-lg">Chat Replay</h3>
      </div>
      
      <div className="chat-messages flex-2 py-3 pr-3 space-y-2 overflow-y-auto max-h-80 justify-start">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message text-start">
            <span className="text-neutral-400 text-xs">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="ml-2">
              <span className="font-medium" style={{ color: msg.color }}>
                {msg.username}
              </span>
              <span className="text-neutral-300">: {msg.message}</span>
            </span>
          </div>
        ))}
      </div>
      
      <div className="chat-input p-3 border-t border-neutral-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message"
            className="w-full px-3 py-2 rounded bg-primary text-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-purple-500 text-background rounded hover:bg-primary/90 transition-colors"
          >
            <SendHorizontal />
          </button>
        </form>
      </div>
    </div>
  );
}; 