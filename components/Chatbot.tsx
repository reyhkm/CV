import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { CloseIcon, SendIcon } from './icons';
import ChatBubble from './ChatBubble';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    onAnimationEnd: () => void;
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const ThinkingIndicator: React.FC = () => (
    <div className="flex items-center justify-start space-x-1 p-4">
        <div className="w-2 h-2 bg-muted rounded-full animate-thinking" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-muted rounded-full animate-thinking" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-muted rounded-full animate-thinking" style={{ animationDelay: '0.4s' }}></div>
    </div>
);


const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, onAnimationEnd, messages, isLoading, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    };
    
    const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onAnimationEnd();
        }
    };

    const animationClass = isOpen ? 'animate-fadeIn' : 'animate-fadeOut';

    return (
        <div 
          className={`fixed inset-0 z-[999] bg-background/80 backdrop-blur-md flex flex-col ${animationClass}`}
          onAnimationEnd={handleAnimationEnd}
        >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-muted/50">
                <div className="text-left">
                    <h2 className="font-serif text-2xl text-foreground">AI Assistant</h2>
                    <p className="text-sm text-muted">Ask about Reykal</p>
                </div>
                <button onClick={onClose} className="p-2 text-muted hover:text-foreground transition-colors" aria-label="Close chat">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg} />
                ))}
                {isLoading && <ThinkingIndicator />}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-muted/50">
                <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a project, skill, or experience..."
                        className="flex-1 w-full bg-transparent border-none focus:ring-0 text-foreground placeholder-muted text-lg p-2"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-foreground text-background p-3 rounded-full transition-all duration-300 disabled:bg-muted disabled:scale-100 hover:scale-110"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;