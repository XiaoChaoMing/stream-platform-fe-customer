import { SendHorizontal, Smile } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/components/base/socketContext/SocketContext';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'motion/react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
interface VideoChatProps {
  streamId: number;
}

interface ChatUser {
  username: string;
  avatar: string;
}

interface ChatMessage {
  message_id: number;
  user_id: string;
  message_text: string;
  stream_id: number;
  created_at: string;
  user: ChatUser;
  color?: string;
}

interface CreateChatMessageDto {
  user_id: string;
  stream_id: number;
  message_text: string;
}

// Generate random hex color
const getRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#8675A9', '#D46A6A', 
    '#55B4B0', '#9B59B6', '#5D5C61', '#379683', '#7395AE'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const StreamChat: React.FC<VideoChatProps> = ({ streamId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userColors, setUserColors] = useState<Record<string, string>>({});
  const [shouldScroll, setShouldScroll] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const { user } = useStore();

  // Manual scroll handling
  const scrollToBottom = () => {
    if (!chatContainerRef.current || !shouldScroll) return;
    
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  // Monitor scroll position to determine if auto-scroll should continue
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const scrollPosition = scrollHeight - scrollTop - clientHeight;
    
    // If user has scrolled up more than 100px, disable auto-scroll
    // Once they scroll back down near the bottom, re-enable
    setShouldScroll(scrollPosition < 100);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !streamId) return;

    const handleReceiveMessage = (data: {
      status: 'success' | 'error';
      message: ChatMessage;
      timestamp: string;
    }) => {      
      if (data.status === 'success') {
        // Get or generate color for user
        const userId = data.message.user_id;
        let userColor = userColors[userId];
        if (!userColor) {
          userColor = userId === user?.user_id ? '#9146FF' : getRandomColor();
          setUserColors(prev => ({ ...prev, [userId]: userColor }));
        }

        const newMessage = {
          ...data.message,
          color: userColor
        };
        
        setMessages(prev => [...prev, newMessage]);
      } else {
        toast.error('Failed to receive message');
      }
    };

    socket.on('ReciveChatMessage', handleReceiveMessage);

    return () => {
      socket.off('ReciveChatMessage', handleReceiveMessage);
    };
  }, [socket, streamId, user, userColors]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !user || !streamId) return;

    try {
      if (isNaN(streamId)) {
        toast.error('Invalid stream ID');
        return;
      }

      const messageData: CreateChatMessageDto = {
        user_id: user.user_id,
        stream_id: streamId,
        message_text: newMessage.trim()
      };
      
      socket.emit('sendChatMessageToStreamRoom', messageData);
      setNewMessage('');
      setShouldScroll(true);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target as Node) &&
        event.target instanceof Element &&
        !event.target.closest('.emoji-toggle-btn')
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="video-chat h-[600px] flex flex-col justify-between bg-card rounded-md p-4 ">
      <div className="p-3 border border-neutral-800 mb-2">
        <h3 className="font-medium text-lg">Stream Chat</h3>
      </div>
      
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="chat-messages flex-1 py-3 pr-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        {messages.map((msg) => (
          <motion.div 
            key={msg.message_id} 
            className="chat-message text-start flex items-center gap-2 mb-2"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{  type: "tween", duration: 0.3, ease: [0.34, 1.56, 0.64, 1]   }}
          >
            <Avatar>
              <AvatarImage src={msg.user.avatar} />
              <AvatarFallback>
                {msg.user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span 
                  className="font-medium" 
                  style={{ color: msg.color }}
                >
                  {msg.user.username}
                </span>
                <span className="text-neutral-400 text-xs">
                  {new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <span className="text-neutral-300 break-words">{msg.message_text}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="chat-input pt-3 border-t border-neutral-800 mt-2">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message"
              className="w-full px-3 py-2 rounded bg-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              disabled={!user}
            />
            {user && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors emoji-toggle-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5" />
              </button>
            )}
            {showEmojiPicker && (
              <div 
                ref={emojiPickerRef}
                className="absolute bottom-full mb-2 right-0 z-10"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  lazyLoadEmojis={true}
                  searchDisabled={false}
                  skinTonesDisabled={false}
                  width={300}
                  height={400}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>
          <button 
            type="submit"
            disabled={!user || !newMessage.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </form>
        {!user && (
          <p className="text-sm text-neutral-400 mt-2">
            You need to be logged in to chat
          </p>
        )}
      </div>
    </div>
  );
}; 