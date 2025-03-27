"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Tractor, 
  Loader2, 
  Send, 
  X,
  Crop, 
  Settings,
  UserCircle2
} from 'lucide-react';
import axios from 'axios';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SignInButton, SignOutButton } from '@clerk/nextjs';

// Types
interface BotMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Markdown Component
const MarkdownComponent: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
        h2: ({ ...props }) => <h2 className="text-xl font-bold my-2" {...props} />,
        h3: ({ ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
        p: ({ ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
        ul: ({ ...props }) => <ul className="list-disc pl-6 mb-2" {...props} />,
        ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-2" {...props} />,
        li: ({ ...props }) => <li className="mb-1" {...props} />,
        a: ({ ...props }) => (
          <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const AgriBotPage: React.FC = () => {
  // Clerk User
  const { isSignedIn, user } = useUser();

  // State Management
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: `initial-${Date.now()}`,
      text: "Hello! I'm your Agricultural AI Assistant. How can I help you with farming, crops, or agricultural challenges today?",
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Update scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message handler
  const handleSendMessage = async () => {
    if (!isSignedIn || inputMessage.trim() === '') return;

    setError(null);
    setIsLoading(true);

    try {
      const userMessageId = `user-${Date.now()}`;
      const userMessage: BotMessage = {
        id: userMessageId,
        text: inputMessage,
        sender: 'user',
        timestamp: Date.now()
      };

      // Add user message to messages
      setMessages(prev => [...prev, userMessage]);

      // Send message to backend
      const response = await axios.post(`${API_BASE_URL}/ask`, {
        question: inputMessage
      });

      const botMessageId = `bot-${Date.now()}`;
      const botMessage: BotMessage = {
        id: botMessageId,
        text: response.data.answer,
        sender: 'bot',
        timestamp: Date.now()
      };

      // Add bot message to messages
      setMessages(prev => [...prev, botMessage]);

      // Reset input and focus
      setInputMessage('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Message send error:', err);
      setError('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([
      {
        id: `initial-${Date.now()}`,
        text: "Hello! I'm your Agricultural AI Assistant. How can I help you with farming, crops, or agricultural challenges today?",
        sender: 'bot',
        timestamp: Date.now()
      }
    ]);
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Tractor className="mr-2" /> AgriChat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-center">Please sign in to access the Agricultural Assistant</p>
            <SignInButton mode="modal">
              <Button className="w-full">Sign In</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center text-green-800">
            <Tractor className="mr-2 text-green-600" /> AgriChat
          </h2>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <Avatar>
            <AvatarImage 
              src={user?.imageUrl} 
              alt={user?.fullName || 'User Profile'}
            />
            <AvatarFallback>
              {user?.firstName?.[0] || <UserCircle2 className="text-green-600" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{user?.fullName}</p>
            <p className="text-sm text-green-600">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
          <SignOutButton>
            <Button variant="ghost" size="icon" className="hover:bg-red-50">
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </SignOutButton>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col m-4 shadow-lg overflow-hidden border border-gray-100">
          <CardHeader className="bg-green-600 text-white rounded-t-xl flex flex-row items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Crop className="w-8 h-8" />
              <CardTitle className="text-xl">
                Agricultural Assistant
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={clearConversation}>
                    Clear Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          {error && (
            <Alert variant="destructive" className="m-2">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden relative">
            <div 
              className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2"
              style={{ 
                maxHeight: 'calc(100vh - 300px)', 
                height: 'calc(100vh - 300px)' 
              }}
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${
                    msg.sender === 'bot' 
                      ? 'justify-start' 
                      : 'justify-end'
                  } mb-2`}
                >
                  {msg.sender === 'user' && (
                    <div className="mr-2 self-end">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={user?.imageUrl} 
                          alt={user?.fullName || 'User Profile'}
                        />
                        <AvatarFallback>
                          {user?.firstName?.[0] || <UserCircle2 />}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div 
                    className={`
                      max-w-[85%] md:max-w-[70%] p-3 rounded-xl 
                      ${
                        msg.sender === 'bot'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-600 text-white'
                      }
                      whitespace-pre-wrap break-words shadow-sm
                    `}
                  >
                    <MarkdownComponent content={msg.text} />
                  </div>
                  {msg.sender === 'bot' && (
                    <div className="ml-2 self-end">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src="/ai-avatar.png" 
                          alt="AI Assistant"
                        />
                        <AvatarFallback>
                          <Tractor className="text-green-600" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start items-center">
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage 
                      src="/ai-avatar.png" 
                      alt="AI Assistant"
                    />
                    <AvatarFallback>
                      <Tractor className="text-green-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-xl flex items-center shadow-sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-green-600" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Fixed bottom input area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="flex space-x-2">
                <Input 
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about farming, crops, weather..."
                  className="flex-grow border-gray-200 focus:border-green-500 focus:ring-green-500"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading || inputMessage.trim() === ''}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgriBotPage;