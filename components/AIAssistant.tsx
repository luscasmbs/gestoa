
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/geminiService';
import { SparklesIcon, SendIcon } from './icons';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMessages([{ sender: 'ai', text: 'Olá! Como posso ajudar com seus projetos hoje?' }]);
        } else {
            setMessages([]);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await getAIResponse(input);
        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary hover:bg-primary-hover text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 z-50"
                aria-label="Abrir assistente de IA"
            >
                <SparklesIcon className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-6 w-96 max-w-[90vw] h-[60vh] bg-surface rounded-xl shadow-2xl flex flex-col z-50 border border-border animate-fade-in-up">
                    <header className="p-4 border-b border-border flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-text-primary">Assistente IA</h3>
                        <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">&times;</button>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-text-primary rounded-bl-none'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-100 text-text-primary">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <form onSubmit={handleSend} className="p-4 border-t border-border flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunte algo..."
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-primary text-white p-2 rounded-lg disabled:bg-gray-300" disabled={isLoading || !input.trim()}>
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
