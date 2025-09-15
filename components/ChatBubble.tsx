import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser
        ? 'bg-foreground text-background self-end dark:bg-background dark:text-foreground'
        : 'bg-gray-200 text-foreground self-start dark:bg-[#262626] dark:text-gray-200';
    const containerClasses = isUser ? 'justify-end' : 'justify-start';

    return (
        <div className={`w-full flex ${containerClasses} animate-fadeIn`}>
            <div className={`markdown-content max-w-md lg:max-w-lg xl:max-w-2xl rounded-2xl p-4 leading-relaxed text-sm ${bubbleClasses}`}>
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default memo(ChatBubble);
