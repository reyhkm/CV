
import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { CloseIcon, SendIcon, MaximizeIcon, MinimizeIcon } from './icons';
import ChatBubble from './ChatBubble';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
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


const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, messages, isLoading, onSendMessage }) => {
    const [input, setInput] = useState('');
    const [isMaximized, setIsMaximized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatbotRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Reset to minimized view when closing
    useEffect(() => {
        if (!isOpen) {
            setIsMaximized(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(input);
        setInput('');
    };
    
    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
    };

    const containerClasses = `fixed z-[999] flex flex-col bg-background/95 dark:bg-foreground/90 backdrop-blur-sm transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
        isMaximized 
        ? 'inset-0 rounded-none' 
        : 'bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100%-2rem)] md:w-[400px] h-[70vh] md:h-[600px] rounded-2xl shadow-2xl border border-muted/20 dark:border-gray-700'
    } ${
        isOpen
        ? 'opacity-100 translate-y-0 visible'
        : 'opacity-0 translate-y-5 invisible'
    }`;

    return (
        <div 
          ref={chatbotRef}
          className={containerClasses}
        >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-muted/50 dark:border-gray-700 flex-shrink-0">
                <div className="text-left">
                    <h2 className="font-serif text-2xl text-foreground dark:text-background">AI Assistant</h2>
                    <p className="text-sm text-muted dark:text-gray-400">Ask about Reykal</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={toggleMaximize} className="p-2 text-muted dark:text-gray-400 hover:text-foreground dark:hover:text-background transition-colors" aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}>
                        {isMaximized ? <MinimizeIcon className="w-5 h-5" /> : <MaximizeIcon className="w-5 h-5" />}
                    </button>
                    <button onClick={onClose} className="p-2 text-muted dark:text-gray-400 hover:text-foreground dark:hover:text-background transition-colors" aria-label="Close chat">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
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
            <div className="p-4 border-t border-muted/50 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a project, skill, or experience..."
                        className="flex-1 w-full bg-transparent border-none focus:ring-0 text-foreground dark:text-background placeholder-muted dark:placeholder-gray-500 text-sm p-2"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 text-foreground dark:text-background transition-all duration-300 disabled:opacity-50 disabled:scale-100 enabled:hover:scale-110"
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
