import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Microscope, Brain, Leaf, AlertTriangle, CheckCircle, XCircle, Loader, Droplets, Sun, Wind, Activity, Zap, Target } from 'lucide-react';

const CropDiseaseDetectionPage = () => {
    const [normalImage, setNormalImage] = useState({ file: null, preview: null });
    const [hyperspectralImage, setHyperspectralImage] = useState({ file: null, preview: null });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageUpload = (file, type) => {
        const preview = URL.createObjectURL(file);
        if (type === 'normal') {
            setNormalImage({ file, preview });
        } else {
            setHyperspectralImage({ file, preview });
        }
    };

    const runAnalysis = async () => {
        if (!normalImage.file && !hyperspectralImage.file) return;

        setIsAnalyzing(true);
        setResult(null);

        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock result - in real implementation, this would come from your AI model
        const mockResults = [
            { class: 'healthy', confidence: 94.2, details: 'Crop shows healthy vegetation indices with normal spectral signatures and optimal chlorophyll content. NDVI values indicate robust photosynthetic activity.' },
            { class: 'rust', confidence: 87.6, details: 'Detected wheat stripe rust patterns in hyperspectral analysis with characteristic yellow-orange pustules. Immediate fungicide treatment recommended.' },
            { class: 'other', confidence: 76.3, details: 'Identified stress indicators suggesting nutrient deficiency, water stress, or early-stage disease symptoms. Monitor closely and consider soil testing.' }
        ];

        setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
        setIsAnalyzing(false);
    };

    const getResultIcon = (resultClass) => {
        switch (resultClass) {
            case 'healthy': return <CheckCircle className="w-6 h-6 text-white" />;
            case 'rust': return <AlertTriangle className="w-6 h-6 text-white" />;
            case 'other': return <XCircle className="w-6 h-6 text-white" />;
            default: return null;
        }
    };

    const getResultColor = (resultClass) => {
        switch (resultClass) {
            case 'healthy': return 'from-emerald-500 via-green-500 to-teal-600';
            case 'rust': return 'from-red-500 via-rose-500 to-pink-600';
            case 'other': return 'from-amber-500 via-orange-500 to-yellow-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">
            {/* Wavy Top Border - Multiple Layers */}
            <div className="absolute top-0 left-0 w-full">
                <svg className="w-full h-24" viewBox="0 0 1440 96" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,0 C240,70 480,70 720,35 C960,0 1200,0 1440,35 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.7)" />
                    <path d="M0,15 C240,85 480,85 720,50 C960,15 1200,15 1440,50 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.5)" />
                    <path d="M0,30 C240,100 480,100 720,65 C960,30 1200,30 1440,65 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.3)" />
                </svg>
            </div>

            {/* Background Pattern - Bottom Waves */}
            <div className="absolute inset-0 opacity-25">
                <svg className="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,60L48,70C96,80,192,100,288,100C384,100,480,80,576,76.7C672,73,768,86,864,86.7C960,86,1056,73,1152,73.3C1248,73,1344,86,1392,93.3L1440,100L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z" fill="rgba(34, 197, 94, 0.15)" />
                    <path d="M0,120L48,130C96,140,192,160,288,160C384,160,480,140,576,136.7C672,133,768,146,864,146.7C960,146,1056,133,1152,133.3C1248,133,1344,146,1392,153.3L1440,160L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z" fill="rgba(34, 197, 94, 0.08)" />
                </svg>
            </div>

            {/* Floating Animated Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-32 right-24 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20"
                />
                <motion.div
                    animate={{
                        y: [0, 25, 0],
                        rotate: [0, -8, 0],
                        scale: [1, 0.9, 1]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-18"
                />
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        x: [0, 10, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 4
                    }}
                    className="absolute top-1/2 left-16 w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-full opacity-25"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -12, 0]
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-1/4 right-1/3 w-14 h-14 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full opacity-15"
                />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-white/15 backdrop-blur-md border-b border-white/25 sticky top-0"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-5">
                            <motion.div
                                whileHover={{ scale: 1.15, rotate: 10 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center w-18 h-18 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl shadow-2xl"
                            >
                                <Leaf className="w-10 h-10 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent">
                                    AI Crop Disease Detection
                                </h1>
                                <p className="text-gray-800 mt-3 text-xl font-medium">Advanced hyperspectral imaging analysis for precision agriculture</p>
                            </div>
                        </div>

                        {/* Environmental Indicators */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <motion.div
                                whileHover={{ scale: 1.08, y: -2 }}
                                className="flex items-center space-x-3 bg-white/25 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-white/30"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <Sun className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-gray-800">24°C</span>
                                    <p className="text-xs text-gray-600">Temperature</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.08, y: -2 }}
                                className="flex items-center space-x-3 bg-white/25 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-white/30"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                                    <Droplets className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-gray-800">68%</span>
                                    <p className="text-xs text-gray-600">Humidity</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.08, y: -2 }}
                                className="flex items-center space-x-3 bg-white/25 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-white/30"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full flex items-center justify-center">
                                    <Wind className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-gray-800">12 km/h</span>
                                    <p className="text-xs text-gray-600">Wind Speed</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Upload Section - MODIFIED */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white/25 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/40">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Crop Images</h2>
                                <p className="text-gray-700 text-base">Upload your crop images for AI-powered disease analysis</p>
                            </div>

                            {/* Normal Image Upload - MODIFIED */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="mb-10"
                            >
                                <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                                        <Camera className="w-3 h-3 text-white" />
                                    </div>
                                    Upload your normal crop image
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, 'normal');
                                        }}
                                        className="hidden"
                                        id="normal-upload"
                                    />
                                    <label
                                        htmlFor="normal-upload"
                                        className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-emerald-400 rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:from-emerald-100 hover:via-green-100 hover:to-teal-100 cursor-pointer transition-all duration-500 group-hover:border-emerald-500 group-hover:shadow-2xl relative overflow-hidden transform group-hover:scale-105"
                                    >
                                        {/* Animated Background Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        {normalImage.preview ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="relative w-full h-full z-10"
                                            >
                                                <img
                                                    src={normalImage.preview}
                                                    alt="Normal crop"
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="text-white font-bold mb-6 flex items-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                                        <Camera className="w-4 h-4 mr-2" />
                                                        Change Image
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="flex flex-col items-center z-10"
                                                whileHover={{ y: -8 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl flex items-center justify-center mb-5 shadow-2xl"
                                                >
                                                    <Upload className="w-8 h-8 text-white" />
                                                </motion.div>
                                                <p className="text-xl font-bold text-emerald-800 mb-2">Upload Normal Crop Image</p>
                                                <p className="text-emerald-700 font-medium text-sm">PNG, JPG up to 10MB • Drag & drop or click to browse</p>
                                            </motion.div>
                                        )}
                                    </label>
                                </div>
                            </motion.div>

                            {/* Hyperspectral Image Upload - MODIFIED */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="mb-10"
                            >
                                <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                        <Microscope className="w-3 h-3 text-white" />
                                    </div>
                                    Upload your hyperspectral crop image
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, 'hyperspectral');
                                        }}
                                        className="hidden"
                                        id="hyperspectral-upload"
                                    />
                                    <label
                                        htmlFor="hyperspectral-upload"
                                        className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-blue-400 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 cursor-pointer transition-all duration-500 group-hover:border-blue-500 group-hover:shadow-2xl relative overflow-hidden transform group-hover:scale-105"
                                    >
                                        {/* Animated Background Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        {hyperspectralImage.preview ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="relative w-full h-full z-10"
                                            >
                                                <img
                                                    src={hyperspectralImage.preview}
                                                    alt="Hyperspectral crop"
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="text-white font-bold mb-6 flex items-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                                                        <Microscope className="w-4 h-4 mr-2" />
                                                        Change Image
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="flex flex-col items-center z-10"
                                                whileHover={{ y: -8 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: -5, scale: 1.1 }}
                                                    className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-5 shadow-2xl"
                                                >
                                                    <Microscope className="w-8 h-8 text-white" />
                                                </motion.div>
                                                <p className="text-xl font-bold text-blue-800 mb-2">Upload Hyperspectral Image</p>
                                                <p className="text-blue-700 font-medium text-sm">Multispectral/Hyperspectral formats • Advanced spectral analysis</p>
                                            </motion.div>
                                        )}
                                    </label>
                                </div>
                            </motion.div>

                            {/* Analysis Button - MODIFIED */}
                            <motion.button
                                onClick={runAnalysis}
                                disabled={(!normalImage.file && !hyperspectralImage.file) || isAnalyzing}
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-5 px-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold text-lg rounded-3xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-4 relative overflow-hidden group border-2 border-white/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {isAnalyzing ? (
                                    <>
                                        <Loader className="w-6 h-6 animate-spin" />
                                        <span>Running AI Analysis...</span>
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-6 h-6" />
                                        <span>Analyze Crop Health</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Results Section - MODIFIED */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div className="bg-white/25 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/40 max-h-screen overflow-hidden">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Analysis Results</h2>
                                <p className="text-gray-700 text-base">AI-powered crop health assessment and disease detection</p>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                <AnimatePresence>
                                    {isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-white/35 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center border-2 border-white/50 relative overflow-hidden"
                                        >
                                            {/* Animated Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-green-400/15 to-teal-400/15" />
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mt-16" />
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/15 to-transparent rounded-full -ml-12 -mb-12" />

                                            <div className="relative z-10">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="flex justify-center mb-6"
                                                >
                                                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                                        <Brain className="w-10 h-10 text-white" />
                                                    </div>
                                                </motion.div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Processing Images</h3>
                                                <p className="text-gray-800 text-lg mb-6 font-medium">AI model analyzing spectral data and vegetation indices...</p>
                                                <div className="space-y-3">
                                                    <div className="w-full bg-white/40 rounded-full h-3 overflow-hidden shadow-inner">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 3, ease: "easeInOut" }}
                                                            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 h-3 rounded-full shadow-lg"
                                                        />
                                                    </div>
                                                    <p className="text-gray-700 font-medium text-sm">Analyzing spectral signatures and vegetation health...</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {result && !isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            {/* Main Result Card - MODIFIED */}
                                            <motion.div
                                                initial={{ scale: 0.9, rotateY: -15 }}
                                                animate={{ scale: 1, rotateY: 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                className={`bg-gradient-to-br ${getResultColor(result.class)} rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border-2 border-white/30`}
                                            >
                                                {/* Enhanced Animated Background Elements */}
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/15 rounded-full -mr-20 -mt-20" />
                                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
                                                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/8 rounded-full -ml-12 -mt-12" />
                                                <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-white/12 rounded-full" />

                                                <div className="relative z-10">
                                                    <div className="flex items-center space-x-6 mb-6">
                                                        <motion.div
                                                            whileHover={{ scale: 1.15, rotate: 10 }}
                                                            className="bg-white/25 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-white/30"
                                                        >
                                                            {getResultIcon(result.class)}
                                                        </motion.div>
                                                        <div className="flex-1">
                                                            <h3 className="text-3xl font-bold capitalize mb-2">
                                                                {result.class === 'rust' ? 'Rust Disease Detected' :
                                                                    result.class === 'healthy' ? 'Healthy Crop' :
                                                                        'Other Conditions Detected'}
                                                            </h3>
                                                            <div className="flex items-center space-x-4">
                                                                <p className="text-white/95 text-lg font-semibold">Confidence: {result.confidence}%</p>
                                                                <div className="flex-1 max-w-24 bg-white/25 rounded-full h-2 overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${result.confidence}%` }}
                                                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                                                        className="bg-white h-2 rounded-full shadow-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-white/95 text-lg leading-relaxed font-medium">{result.details}</p>
                                                </div>
                                            </motion.div>

                                            {/* Enhanced Classification Breakdown - MODIFIED */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-white/35 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white/50"
                                            >
                                                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
                                                    <Target className="w-6 h-6 mr-3 text-emerald-600" />
                                                    Classification Details
                                                </h4>
                                                <div className="space-y-4">
                                                    <motion.div
                                                        whileHover={{ scale: 1.03, x: 8 }}
                                                        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-3 border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                                <CheckCircle className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-emerald-900 text-lg">Healthy Crop</span>
                                                                <p className="text-emerald-800 font-medium text-sm">Normal vegetation indices & optimal growth</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Activity className="w-4 h-4 text-emerald-600" />
                                                            <div className="text-emerald-800 font-bold text-sm">Optimal</div>
                                                        </div>
                                                    </motion.div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.03, x: 8 }}
                                                        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-3 border-red-300 shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                                <AlertTriangle className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-red-900 text-lg">Rust Disease</span>
                                                                <p className="text-red-800 font-medium text-sm">Wheat stripe rust / yellow rust detected</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Zap className="w-4 h-4 text-red-600" />
                                                            <div className="text-red-800 font-bold text-sm">Action Required</div>
                                                        </div>
                                                    </motion.div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.03, x: 8 }}
                                                        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-3 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                                <XCircle className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-amber-900 text-lg">Other Conditions</span>
                                                                <p className="text-amber-800 font-medium text-sm">Stress, deficiency, or other diseases</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Activity className="w-4 h-4 text-amber-600" />
                                                            <div className="text-amber-800 font-bold text-sm">Monitor</div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {!result && !isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl p-16 text-center border-3 border-dashed border-gray-400 relative overflow-hidden shadow-inner"
                                        >
                                            {/* Animated Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-green-400/8 to-teal-400/8" />
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-200/50 to-transparent rounded-full -mr-16 -mt-16" />
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-200/30 to-transparent rounded-full -ml-12 -mb-12" />

                                            <div className="relative z-10">
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.15, 1],
                                                        rotate: [0, 8, -8, 0]
                                                    }}
                                                    transition={{
                                                        duration: 6,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="w-20 h-20 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                                                >
                                                    <Brain className="w-10 h-10 text-white" />
                                                </motion.div>
                                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready for Analysis</h3>
                                                <p className="text-gray-700 text-lg font-medium">Upload at least one crop image to begin AI-powered disease detection</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Footer with Gradient */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative z-10 bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 border-t-4 border-emerald-600/50 mt-20 overflow-hidden"
            >
                {/* Footer Wave Pattern */}
                <div className="absolute top-0 left-0 w-full">
                    <svg className="w-full h-16" viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M0,32 C240,0 480,0 720,16 C960,32 1200,32 1440,16 L1440,0 L0,0 Z" fill="rgba(255, 255, 255, 0.1)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center text-white">
                        <div className="flex justify-center items-center space-x-4 mb-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                            >
                                <Leaf className="w-6 h-6 text-white" />
                            </motion.div>
                            <h3 className="text-2xl font-bold">Precision Agriculture AI Platform</h3>
                        </div>
                        <p className="text-emerald-100 text-xl mb-3 font-medium">Powered by advanced hyperspectral imaging and deep learning models</p>
                        <p className="text-emerald-200 font-medium">Transforming agriculture through AI-driven crop monitoring and early disease detection</p>

                        {/* Feature Icons */}
                        <div className="flex justify-center items-center space-x-8 mt-8">
                            <motion.div whileHover={{ scale: 1.1, y: -2 }} className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm text-emerald-200">AI Analysis</span>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1, y: -2 }} className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                    <Microscope className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm text-emerald-200">Hyperspectral</span>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1, y: -2 }} className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm text-emerald-200">Precision</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CropDiseaseDetectionPage;