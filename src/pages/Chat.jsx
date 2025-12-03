import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../utils/api';

export default function Chat() {
    const location = useLocation();
    const navigate = useNavigate();
    const { messages, setMessages } = useApp();
    const [inputValue, setInputValue] = useState('');

    const { productId, product } = location.state || {};

    if (!productId || !product) {
        navigate('/dashboard');
        return null;
    }

    const chatMessages = messages[productId] || [];

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newMsg = { sender: 'user', text: inputValue, time: new Date().toLocaleTimeString() };

        setMessages(prev => {
            const chatMsgs = prev[productId] || [];
            return { ...prev, [productId]: [...chatMsgs, newMsg] };
        });

        setInputValue('');

        // Get AI response
        try {
            const aiText = await sendChatMessage(inputValue, chatMessages, product);
            const aiReply = {
                sender: 'ai',
                text: aiText,
                time: new Date().toLocaleTimeString()
            };

            setMessages(prev => {
                const chatMsgs = prev[productId] || [];
                return { ...prev, [productId]: [...chatMsgs, aiReply] };
            });
        } catch (error) {
            const errorReply = {
                sender: 'ai',
                text: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
                time: new Date().toLocaleTimeString()
            };
            setMessages(prev => {
                const chatMsgs = prev[productId] || [];
                return { ...prev, [productId]: [...chatMsgs, errorReply] };
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-[75vh] flex flex-col animate-fade-in max-w-4xl mx-auto border border-gray-200">
            <div className="bg-gray-50 border-b p-4 flex items-center gap-4">
                <div className="relative">
                    <div className="bg-teal-600 p-3 rounded-full text-white"><Sparkles size={20} /></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">المساعد الذكي Fixer</h3>
                    <p className="text-xs text-gray-500">متصل الآن • بخصوص {product.title || product.originalTitle}</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${msg.sender === 'user' ? 'bg-gray-100 text-gray-800 rounded-tr-none' : 'bg-teal-600 text-white rounded-tl-none'
                            }`}>
                            <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                            <span className={`text-[10px] block mt-2 opacity-60 ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-gray-50 border-t flex gap-2">
                <input
                    type="text"
                    placeholder="اكتب رسالتك..."
                    className="flex-1 px-6 py-4 rounded-xl border-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    onClick={handleSend}
                    className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-xl transition shadow-md"
                >
                    <ArrowRight className="transform rotate-180" />
                </button>
            </div>
        </div>
    );
}
