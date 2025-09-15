import React, { memo } from 'react';
import type { Message } from '../types';

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser
        ? 'bg-foreground text-background self-end'
        : 'bg-gray-200 text-foreground self-start';
    const containerClasses = isUser ? 'justify-end' : 'justify-start';

    return (
        <div className={`w-full flex ${containerClasses} animate-fadeIn`}>
            <div className={`max-w-md lg:max-w-lg xl:max-w-2xl rounded-2xl p-4 leading-relaxed ${bubbleClasses}`}>
                <p>{message.text}</p>
            </div>
        </div>
    );
};

export default memo(ChatBubble);
