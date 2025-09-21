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
<<<<<<< Updated upstream
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
=======
        { icon: <Leaf className="w-5 h-5" />, title: "Crop Health Analysis", description: "Get insights on crop health monitoring using multispectral imaging", color: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200" },
        { icon: <Droplets className="w-5 h-5" />, title: "Soil Conditions", description: "Analyze soil moisture, pH levels, and nutrient content", color: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200" },
        { icon: <Bug className="w-5 h-5" />, title: "Pest Detection", description: "Identify and manage pest risks using AI-powered monitoring", color: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200" },
        { icon: <Thermometer className="w-5 h-5" />, title: "Environmental Factors", description: "Monitor temperature, humidity, and weather conditions", color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200" }
>>>>>>> Stashed changes
    ];

    const handleSuggestionClick = (suggestion) => {
        setQuery(`Tell me about ${suggestion.title.toLowerCase()}`);
    };

    return (
<<<<<<< Updated upstream
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
=======
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">
            {/* Wavy Top Border */}
            <div className="absolute top-0 left-0 w-full">
                <svg className="w-full h-20" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,0 C240,60 480,60 720,30 C960,0 1200,0 1440,30 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.6)" />
                    <path d="M0,10 C240,70 480,70 720,40 C960,10 1200,10 1440,40 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.4)" />
                    <path d="M0,20 C240,80 480,80 720,50 C960,20 1200,20 1440,50 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.2)" />
                </svg>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,48L48,56C96,64,192,80,288,80C384,80,480,64,576,61.3C672,58,768,69,864,69.3C960,69,1056,58,1152,58.7C1248,58,1344,69,1392,74.7L1440,80L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z" fill="rgba(34, 197, 94, 0.1)" />
                </svg>
            </div>

            {/* Go Back & Refresh Buttons */}
            <button onClick={handleGoBack} className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all cursor-pointer">
                <ArrowLeft className="w-5 h-5" /><span className="text-sm font-medium">Go Back</span>
            </button>
            <button onClick={handleRefresh} className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all cursor-pointer" title="Start new conversation">
                <RotateCcw className="w-5 h-5" /><span className="text-sm font-medium">Refresh</span>
            </button>

            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">

                    {/* Welcome */}
                    {messages.length === 0 && (
                        <div className="p-8 text-center border-b border-white/20">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hello! I'm your AgriAI Assistant 🌱</h2>
                            <p className="text-gray-700 max-w-2xl mx-auto">
>>>>>>> Stashed changes
                                I'm here to help you with crop health monitoring, soil analysis, pest detection,
                                and agricultural optimization using advanced AI and sensor technology.
                                Feel free to ask me anything about your farming needs!
                            </p>
                        </div>
                    )}

                    {/* Suggestion Cards - Show only when no messages */}
                    {messages.length === 0 && (
                        <div className="p-6 border-b border-white/20">
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
                                                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                                                    <p className="text-sm">{msg.query}</p>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1 text-right">{msg.timestamp}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-start">
                                            <div className="max-w-xs lg:max-w-md">
                                                <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                                                    <p className="text-sm">{msg.answer}</p>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{msg.timestamp}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
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
<<<<<<< Updated upstream
                    <div className="border-t border-gray-100 p-4">
                        <div className="flex items-center gap-3">
=======
                    <div className="border-t border-white/20 p-4 bg-white/10 backdrop-blur-sm">
                        {imagePreview && (
                            <div className="mb-3 relative inline-block">
                                <img src={imagePreview} alt="preview" className="h-24 rounded-lg object-cover border" />
                                <button onClick={removeImage} className="absolute top-1 right-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <label className="p-3 rounded-xl border-2 bg-white/90 text-gray-700 cursor-pointer hover:border-gray-400 backdrop-blur-sm shadow-sm">
                                <ImageIcon className="w-5 h-5" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
>>>>>>> Stashed changes
                            <div className="flex-1">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={listening ? "Listening..." : "Ask me anything about agriculture..."}
<<<<<<< Updated upstream
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
=======
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm shadow-sm"
>>>>>>> Stashed changes
                                    rows="1"
                                    style={{ minHeight: '44px' }}
                                    disabled={listening || isLoading}
                                />
                            </div>
<<<<<<< Updated upstream
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
=======
                            <button onClick={handleSend} disabled={(!query.trim() && !image) || listening || isLoading} className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-xl hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 disabled:opacity-50 shadow-lg transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                            <button onClick={handleMic} disabled={isLoading} className={`p-3 rounded-xl border-2 backdrop-blur-sm shadow-sm transition-all ${listening ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-600' : 'bg-white/90 text-gray-700 border-gray-300 hover:border-gray-400'}`}>
>>>>>>> Stashed changes
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