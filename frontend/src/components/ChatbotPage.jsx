import React, { useState } from 'react';
import { ArrowLeft, Send, Mic, Leaf, Bug, Droplets, Thermometer, RotateCcw, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PYTHON_URL = import.meta.env.VITE_PYTHON_URL || 'http://localhost:8000';

const ChatbotPage = ({ onBack }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState("");
    const [listening, setListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleRefresh = () => {
        setMessages([]);
        setQuery("");
        setListening(false);
        setIsLoading(false);
        setImage(null);
        setImagePreview(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSend = async () => {
        if (!query.trim() && !image) return;

        const userMessage = { query: query.trim(), image: imagePreview, timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMessage]);
        setQuery("");
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("messages", JSON.stringify(messages));
            formData.append("query", query.trim());
            if (image) {
                formData.append("image", image);
            }

            const res = await fetch(`${PYTHON_URL}/chats`, {
                method: 'POST',
                body: formData
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
            setImage(null);
            setImagePreview(null);
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
        { icon: <Leaf className="w-5 h-5" />, title: "Crop Health Analysis", description: "Get insights on crop health monitoring using multispectral imaging", color: "bg-green-50 border-green-200 hover:bg-green-100" },
        { icon: <Droplets className="w-5 h-5" />, title: "Soil Conditions", description: "Analyze soil moisture, pH levels, and nutrient content", color: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
        { icon: <Bug className="w-5 h-5" />, title: "Pest Detection", description: "Identify and manage pest risks using AI-powered monitoring", color: "bg-red-50 border-red-200 hover:bg-red-100" },
        { icon: <Thermometer className="w-5 h-5" />, title: "Environmental Factors", description: "Monitor temperature, humidity, and weather conditions", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" }
    ];

    const handleSuggestionClick = (suggestion) => {
        setQuery(`Tell me about ${suggestion.title.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 relative">
            {/* Go Back & Refresh Buttons */}
            <button onClick={handleGoBack} className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all">
                <ArrowLeft className="w-5 h-5" /><span className="text-sm font-medium">Go Back</span>
            </button>
            <button onClick={handleRefresh} className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-all" title="Start new conversation">
                <RotateCcw className="w-5 h-5" /><span className="text-sm font-medium">Refresh</span>
            </button>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                    {/* Welcome */}
                    {messages.length === 0 && (
                        <div className="p-8 text-center border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hello! I'm your AgriAI Assistant 🌱</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                I'm here to help you with crop health monitoring, soil analysis, pest detection,
                                and agricultural optimization using advanced AI and sensor technology.
                            </p>
                        </div>
                    )}

                    {/* Suggestion Cards */}
                    {messages.length === 0 && (
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestionCards.map((card, index) => (
                                    <div key={index} onClick={() => handleSuggestionClick(card)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${card.color}`}>
                                        <div className="flex items-start gap-3">
                                            {card.icon}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold">{card.title}</h4>
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
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx}>
                                    {msg.query ? (
                                        <div className="flex justify-end">
                                            <div className="max-w-xs lg:max-w-md">
                                                <div className="bg-green-600 text-white rounded-2xl rounded-br-md px-4 py-3">
                                                    <p className="text-sm">{msg.query}</p>
                                                    {msg.image && (
                                                        <img src={msg.image} alt="uploaded" className="mt-2 rounded-lg max-h-40 object-cover" />
                                                    )}
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
                        {imagePreview && (
                            <div className="mb-3 relative inline-block">
                                <img src={imagePreview} alt="preview" className="h-24 rounded-lg object-cover border" />
                                <button onClick={removeImage} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <label className="p-3 rounded-xl border-2 bg-white text-gray-700 cursor-pointer hover:border-gray-400">
                                <ImageIcon className="w-5 h-5" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                            <div className="flex-1">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={listening ? "Listening..." : "Ask me anything about agriculture..."}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    rows="1"
                                    disabled={listening || isLoading}
                                />
                            </div>
                            <button onClick={handleSend} disabled={(!query.trim() && !image) || listening || isLoading} className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50">
                                <Send className="w-5 h-5" />
                            </button>
                            <button onClick={handleMic} disabled={isLoading} className={`p-3 rounded-xl border-2 ${listening ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}>
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
