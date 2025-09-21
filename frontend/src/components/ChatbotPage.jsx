import React, { useState } from 'react';
import { ArrowLeft, Send, Mic, Leaf, Bug, Droplets, Thermometer, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PYTHON_URL = import.meta.env.VITE_PYTHON_URL || 'http://localhost:8000';

const ChatbotPage = ({ onBack }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState("");
    const [listening, setListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGoBack = () => {
        navigate(-1); // Go back to previous page
    };

    const handleRefresh = () => {
        setMessages([]);
        setQuery("");
        setListening(false);
        setIsLoading(false);
    };

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMessage = { query: query.trim(), timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMessage]);
        setQuery("");
        setIsLoading(true);

        try {
            const res = await fetch(`${PYTHON_URL}/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages, query: query.trim() })
            });
            const data = await res.text();

            setMessages(prev => [...prev, {
                answer: data,
                timestamp: new Date().toLocaleTimeString()
            }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                answer: "I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date().toLocaleTimeString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMic = () => {
        setListening(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition");
            setListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestionCards = [
        {
            icon: <Leaf className="w-5 h-5" />,
            title: "Crop Health Analysis",
            description: "Get insights on crop health monitoring using multispectral imaging",
            color: "bg-green-50 border-green-200 hover:bg-green-100"
        },
        {
            icon: <Droplets className="w-5 h-5" />,
            title: "Soil Conditions",
            description: "Analyze soil moisture, pH levels, and nutrient content",
            color: "bg-amber-50 border-amber-200 hover:bg-amber-100"
        },
        {
            icon: <Bug className="w-5 h-5" />,
            title: "Pest Detection",
            description: "Identify and manage pest risks using AI-powered monitoring",
            color: "bg-red-50 border-red-200 hover:bg-red-100"
        },
        {
            icon: <Thermometer className="w-5 h-5" />,
            title: "Environmental Factors",
            description: "Monitor temperature, humidity, and weather conditions",
            color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
        }
    ];

    const handleSuggestionClick = (suggestion) => {
        setQuery(`Tell me about ${suggestion.title.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 relative">
            {/* Go Back Button - Top Left */}
            <button
                onClick={handleGoBack}
                className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-200 cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Go Back</span>
            </button>

            {/* Refresh Button - Top Right */}
            <button
                onClick={handleRefresh}
                className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-200 cursor-pointer"
                title="Start new conversation"
            >
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm font-medium">Refresh</span>
            </button>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Welcome Section */}
                    {messages.length === 0 && (
                        <div className="p-8 text-center border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Hello! I'm your AgriAI Assistant 🌱
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                I'm here to help you with crop health monitoring, soil analysis, pest detection,
                                and agricultural optimization using advanced AI and sensor technology.
                                Feel free to ask me anything about your farming needs!
                            </p>
                        </div>
                    )}

                    {/* Suggestion Cards - Show only when no messages */}
                    {messages.length === 0 && (
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestionCards.map((card, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(card)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${card.color}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 text-gray-700">
                                                {card.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 mb-1">{card.title}</h4>
                                                <p className="text-sm text-gray-600">{card.description}</p>
                                            </div>
                                            <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div className="flex-1 p-6" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {messages.length === 0 && (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Start a conversation by selecting a topic above or typing a message below</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx}>
                                    {msg.query ? (
                                        <div className="flex justify-end">
                                            <div className="max-w-xs lg:max-w-md">
                                                <div className="bg-green-600 text-white rounded-2xl rounded-br-md px-4 py-3">
                                                    <p className="text-sm">{msg.query}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-start">
                                            <div className="max-w-xs lg:max-w-md">
                                                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
                                                    <p className="text-sm">{msg.answer}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={listening ? "Listening..." : "Ask me anything about agriculture..."}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
                                    rows="1"
                                    style={{ minHeight: '44px' }}
                                    disabled={listening || isLoading}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!query.trim() || listening || isLoading}
                                className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleMic}
                                disabled={isLoading}
                                className={`p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${listening
                                        ? 'bg-red-600 text-white border-red-600 focus:ring-red-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 focus:ring-gray-500'
                                    }`}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;