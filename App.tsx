
import React, { useState, useEffect, useCallback } from 'react';
import Chatbot from './components/Chatbot';
import { BotIcon } from './components/icons';
import type { Message } from './types';
import { aiService } from './services/geminiService';

const App: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: "Hello! I'm Reykal's AI assistant. Feel free to ask me anything about his skills, projects, or experience."
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isChatOpen) {
            setIsRendered(true);
        }
    }, [isChatOpen]);

    const handleAnimationEnd = () => {
        if (!isChatOpen) {
            setIsRendered(false);
        }
    };

    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
    };

    const handleSendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim()) return;

        const userMessage: Message = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await aiService.continueConversation(messageText);
            const modelMessage: Message = { role: 'model', text: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error('Error getting response from AI:', error);
            const errorMessage: Message = {
                role: 'model',
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="font-sans">
            {!isRendered && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-8 right-8 bg-foreground text-background w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-foreground z-[1000] animate-fabIn"
                    aria-label="Open AI Assistant"
                >
                    <BotIcon className="w-8 h-8" />
                </button>
            )}

            {isRendered && (
                <Chatbot
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    onAnimationEnd={handleAnimationEnd}
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                />
            )}
        </div>
    );
};

export default App;
