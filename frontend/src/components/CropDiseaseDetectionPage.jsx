import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Microscope, Brain, Leaf, AlertTriangle, CheckCircle, XCircle, Loader, Droplets, Sun, Wind, Activity, Zap, Target, FileText } from 'lucide-react';

const CropDiseaseDetectionPage = () => {
    const [normalImage, setNormalImage] = useState({ file: null, preview: null });
    const [hyperspectralImage, setHyperspectralImage] = useState({ file: null, preview: null });
    const [trueLabel, setTrueLabel] = useState({ file: null, preview: null });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [visualizationImage, setVisualizationImage] = useState(null);

    // Backend URL - update this to match your Flask server
    const BACKEND_URL = 'http://localhost:8080';

    const handleImageUpload = (file, type) => {
        // Add file validation
        if (!file) return;

        // Validate file types for .pt files
        if (type !== 'normal' && !file.name.toLowerCase().endsWith('.pt') && !file.name.toLowerCase().endsWith('.pth')) {
            setError(`Please upload a valid .pt or .pth file for ${type === 'hyperspectral' ? 'hyperspectral' : 'true label'} data.`);
            return;
        }

        const preview = type === 'normal' ? URL.createObjectURL(file) : null;

        if (type === 'normal') {
            setNormalImage({ file, preview });
        } else if (type === 'hyperspectral') {
            setHyperspectralImage({ file, preview });
        } else if (type === 'truelabel') {
            setTrueLabel({ file, preview: null });
        }

        // Clear any previous errors
        setError(null);
    };

    const runAnalysis = async () => {
        if (!normalImage.file || !hyperspectralImage.file) {
            setError("Please upload both RGB and hyperspectral files for analysis.");
            return;
        }

        setIsAnalyzing(true);
        setResult(null);
        setError(null);
        setVisualizationImage(null);

        try {
            // Create FormData for file upload - using correct field names for Flask server
            const formData = new FormData();

            // Use the correct field names that match your Flask server
            formData.append('rgb', normalImage.file);  // Changed to 'rgb'
            formData.append('hsi', hyperspectralImage.file);  // Changed to 'hsi'

            if (trueLabel.file) {
                formData.append('label', trueLabel.file);  // Optional true label
            }

            // First get the JSON prediction result
            const response = await fetch(`${BACKEND_URL}/predict_dual_stream`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Transform the Flask API response to match frontend expectations
            const transformedResult = {
                class: mapPredictionToClass(data.predicted_class),
                details: generateDetailMessage(data.predicted_class, data.predicted_label),
                predicted_class: data.predicted_class,
                predicted_label: data.predicted_label,
                true_class: data.true_class
            };

            setResult(transformedResult);

            // Now get the visualization image
            try {
                const imageFormData = new FormData();
                imageFormData.append('rgb', normalImage.file);
                imageFormData.append('hsi', hyperspectralImage.file);
                if (trueLabel.file) {
                    imageFormData.append('label', trueLabel.file);
                }

                const imageResponse = await fetch(`${BACKEND_URL}/predict_image`, {
                    method: 'POST',
                    body: imageFormData,
                });

                if (imageResponse.ok) {
                    const imageBlob = await imageResponse.blob();
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setVisualizationImage(imageUrl);
                }
            } catch (imageError) {
                console.log('Could not get visualization image:', imageError);
                // Continue without image - not critical
            }

        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze images. Please check your connection and try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const mapPredictionToClass = (predictedClass) => {
        // Map Flask API class names to frontend class names
        switch (predictedClass.toLowerCase()) {
            case 'health':
                return 'healthy';
            case 'yellow rust disease':
                return 'rust';
            case 'non-rust disease':
                return 'other';
            default:
                return 'other';
        }
    };

    const generateDetailMessage = (predictedClass, predictedLabel) => {
        switch (predictedClass.toLowerCase()) {
            case 'health':
                return `Crop shows healthy vegetation indices with normal spectral signatures and optimal chlorophyll content. (Prediction index: ${predictedLabel})`;
            case 'yellow rust disease':
                return `Detected wheat stripe rust patterns in hyperspectral analysis with characteristic yellow-orange pustules. (Prediction index: ${predictedLabel})`;
            case 'non-rust disease':
                return `Identified stress indicators suggesting nutrient deficiency, water stress, or early-stage disease symptoms. (Prediction index: ${predictedLabel})`;
            default:
                return `Analysis completed. Prediction index: ${predictedLabel}`;
        }
    };

    const getResultIcon = (resultClass) => {
        switch (resultClass) {
            case 'healthy': return <CheckCircle className="w-4 h-4 text-white" />;
            case 'rust': return <AlertTriangle className="w-4 h-4 text-white" />;
            case 'other': return <XCircle className="w-4 h-4 text-white" />;
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

    const getResultTitle = (resultClass) => {
        switch (resultClass) {
            case 'healthy': return 'Healthy Crop';
            case 'rust': return 'Rust Disease Detected';
            case 'other': return 'Other Conditions Detected';
            default: return 'Analysis Complete';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">
            {/* Wavy Top Border */}
            <div className="absolute top-0 left-0 w-full">
                <svg className="w-full h-16" viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,0 C240,50 480,50 720,25 C960,0 1200,0 1440,25 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.7)" />
                    <path d="M0,10 C240,60 480,60 720,35 C960,10 1200,10 1440,35 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.5)" />
                    <path d="M0,20 C240,70 480,70 720,45 C960,20 1200,20 1440,45 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.3)" />
                </svg>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-25">
                <svg className="absolute bottom-0 left-0 w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40L48,50C96,60,192,80,288,80C384,80,480,60,576,56.7C672,53,768,66,864,66.7C960,66,1056,53,1152,53.3C1248,53,1344,66,1392,73.3L1440,80L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="rgba(34, 197, 94, 0.15)" />
                </svg>
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-white/15 backdrop-blur-md border-b border-white/25 sticky top-0"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl shadow-xl"
                            >
                                <Leaf className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent">
                                    AI Crop Disease Detection
                                </h1>
                                <p className="text-gray-800 mt-1 text-sm font-medium">Advanced hyperspectral imaging analysis for precision agriculture</p>
                            </div>
                        </div>

                        {/* Environmental Indicators */}
                        <div className="hidden lg:flex items-center space-x-2">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                className="flex items-center space-x-2 bg-white/25 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/30"
                            >
                                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <Sun className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-800">24°C</span>
                                    <p className="text-xs text-gray-600">Temp</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                className="flex items-center space-x-2 bg-white/25 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/30"
                            >
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                                    <Droplets className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-800">68%</span>
                                    <p className="text-xs text-gray-600">Humidity</p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                className="flex items-center space-x-2 bg-white/25 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/30"
                            >
                                <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full flex items-center justify-center">
                                    <Wind className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-800">12 km/h</span>
                                    <p className="text-xs text-gray-600">Wind</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/40">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Upload Crop Files</h2>
                                <p className="text-gray-700 text-sm">Upload your crop files for AI-powered disease analysis</p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                                >
                                    <div className="flex items-center">
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        <span>{error}</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Normal Image Upload */}
                            <motion.div
                                whileHover={{ scale: 1.01, y: -1 }}
                                className="mb-4"
                            >
                                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center">
                                    <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex items-center justify-center mr-2">
                                        <Camera className="w-2 h-2 text-white" />
                                    </div>
                                    Upload RGB crop file (.pt format)
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pt,.pth,.pkl"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, 'normal');
                                        }}
                                        className="hidden"
                                        id="normal-upload"
                                    />
                                    <label
                                        htmlFor="normal-upload"
                                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-emerald-400 rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:from-emerald-100 hover:via-green-100 hover:to-teal-100 cursor-pointer transition-all duration-300 group-hover:border-emerald-500 group-hover:shadow-lg relative overflow-hidden transform group-hover:scale-102"
                                    >
                                        {normalImage.file ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="relative w-full h-full z-10 flex items-center justify-center"
                                            >
                                                <div className="text-center">
                                                    <Camera className="w-8 h-8 text-green-600 mx-auto mb-1" />
                                                    <p className="text-green-800 font-bold text-xs truncate max-w-32">
                                                        {normalImage.file.name}
                                                    </p>
                                                    <p className="text-green-600 text-xs">RGB data loaded</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="flex flex-col items-center z-10"
                                                whileHover={{ y: -2 }}
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                                    className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-2 shadow-lg"
                                                >
                                                    <Upload className="w-4 h-4 text-white" />
                                                </motion.div>
                                                <p className="text-sm font-bold text-emerald-800 mb-1">Upload RGB File</p>
                                                <p className="text-emerald-700 font-medium text-xs">.pt format preferred</p>
                                            </motion.div>
                                        )}
                                    </label>
                                </div>
                            </motion.div>

                            {/* Hyperspectral Image Upload */}
                            <motion.div
                                whileHover={{ scale: 1.01, y: -1 }}
                                className="mb-4"
                            >
                                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center">
                                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center mr-2">
                                        <Microscope className="w-2 h-2 text-white" />
                                    </div>
                                    Upload hyperspectral file (.pt format)
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pt,.pth,.pkl"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, 'hyperspectral');
                                        }}
                                        className="hidden"
                                        id="hyperspectral-upload"
                                    />
                                    <label
                                        htmlFor="hyperspectral-upload"
                                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-400 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 cursor-pointer transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-lg relative overflow-hidden transform group-hover:scale-102"
                                    >
                                        {hyperspectralImage.file ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="relative w-full h-full z-10 flex items-center justify-center"
                                            >
                                                <div className="text-center">
                                                    <Microscope className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                                                    <p className="text-blue-800 font-bold text-xs truncate max-w-32">
                                                        {hyperspectralImage.file.name}
                                                    </p>
                                                    <p className="text-blue-600 text-xs">Hyperspectral loaded</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="flex flex-col items-center z-10"
                                                whileHover={{ y: -2 }}
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: -5, scale: 1.1 }}
                                                    className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 shadow-lg"
                                                >
                                                    <Microscope className="w-4 h-4 text-white" />
                                                </motion.div>
                                                <p className="text-sm font-bold text-blue-800 mb-1">Upload Hyperspectral</p>
                                                <p className="text-blue-700 font-medium text-xs">.pt format preferred</p>
                                            </motion.div>
                                        )}
                                    </label>
                                </div>
                            </motion.div>

                            {/* True Label Upload */}
                            <motion.div
                                whileHover={{ scale: 1.01, y: -1 }}
                                className="mb-4"
                            >
                                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center">
                                    <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center mr-2">
                                        <FileText className="w-2 h-2 text-white" />
                                    </div>
                                    Upload true label file (.pt format) - Optional
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pt,.pth,.pkl"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file, 'truelabel');
                                        }}
                                        className="hidden"
                                        id="truelabel-upload"
                                    />
                                    <label
                                        htmlFor="truelabel-upload"
                                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-purple-400 rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 hover:from-purple-100 hover:via-pink-100 hover:to-rose-100 cursor-pointer transition-all duration-300 group-hover:border-purple-500 group-hover:shadow-lg relative overflow-hidden transform group-hover:scale-102"
                                    >
                                        {trueLabel.file ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="relative w-full h-full z-10 flex items-center justify-center"
                                            >
                                                <div className="text-center">
                                                    <FileText className="w-8 h-8 text-purple-600 mx-auto mb-1" />
                                                    <p className="text-purple-800 font-bold text-xs truncate max-w-32">
                                                        {trueLabel.file.name}
                                                    </p>
                                                    <p className="text-purple-600 text-xs">Label data loaded</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="flex flex-col items-center z-10"
                                                whileHover={{ y: -2 }}
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: -5, scale: 1.1 }}
                                                    className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-2 shadow-lg"
                                                >
                                                    <FileText className="w-4 h-4 text-white" />
                                                </motion.div>
                                                <p className="text-sm font-bold text-purple-800 mb-1">Upload True Label</p>
                                                <p className="text-purple-700 font-medium text-xs">.pt format (optional)</p>
                                            </motion.div>
                                        )}
                                    </label>
                                </div>
                            </motion.div>

                            {/* Analysis Button */}
                            <motion.button
                                onClick={runAnalysis}
                                disabled={(!normalImage.file || !hyperspectralImage.file) || isAnalyzing}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group border border-white/20"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>Running AI Analysis...</span>
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-4 h-4" />
                                        <span>Analyze Crop Health</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Results Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/40 h-[500px] overflow-hidden">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Analysis Results</h2>
                                <p className="text-gray-700 text-sm">AI-powered crop health assessment and disease detection</p>
                            </div>

                            <div className="h-[420px] overflow-y-auto">
                                <AnimatePresence>
                                    {isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-white/35 backdrop-blur-sm rounded-2xl shadow-2xl p-6 text-center border-2 border-white/50 relative overflow-hidden"
                                        >
                                            <div className="relative z-10">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="flex justify-center mb-4"
                                                >
                                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                                                        <Brain className="w-6 h-6 text-white" />
                                                    </div>
                                                </motion.div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Files</h3>
                                                <p className="text-gray-800 text-sm mb-4 font-medium">AI model analyzing spectral data and vegetation indices...</p>
                                                <div className="space-y-2">
                                                    <div className="w-full bg-white/40 rounded-full h-2 overflow-hidden shadow-inner">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 3, ease: "easeInOut" }}
                                                            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 h-2 rounded-full shadow-lg"
                                                        />
                                                    </div>
                                                    <p className="text-gray-700 font-medium text-xs">Analyzing spectral signatures and vegetation health...</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {result && !isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-3"
                                        >
                                            {/* Main Result Card */}
                                            <motion.div
                                                initial={{ scale: 0.9, rotateY: -15 }}
                                                animate={{ scale: 1, rotateY: 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                className={`bg-gradient-to-br ${getResultColor(result.class)} rounded-2xl shadow-xl p-4 text-white relative overflow-hidden border border-white/30`}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <motion.div
                                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                                            className="bg-white/25 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-white/30"
                                                        >
                                                            {getResultIcon(result.class)}
                                                        </motion.div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold capitalize mb-1">
                                                                {getResultTitle(result.class)}
                                                            </h3>
                                                            <p className="text-white/90 text-sm font-semibold">
                                                                Predicted: {result.predicted_class}
                                                            </p>
                                                            <p className="text-white/85 text-sm">
                                                                Label Index: {result.predicted_label}
                                                            </p>
                                                            {result.true_class && (
                                                                <p className="text-white/85 text-sm">True Class: {result.true_class}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-white/95 text-xs leading-relaxed font-medium">{result.details}</p>
                                                </div>
                                            </motion.div>

                                            {/* Visualization Image */}
                                            {visualizationImage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="bg-white/35 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/50"
                                                >
                                                    <h4 className="text-sm font-bold text-gray-900 mb-3 text-center flex items-center justify-center">
                                                        <Camera className="w-4 h-4 mr-2 text-emerald-600" />
                                                        Analysis Visualization
                                                    </h4>
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={visualizationImage}
                                                            alt="Analysis result with predictions"
                                                            className="max-w-full h-auto rounded-xl shadow-lg border border-gray-200 max-h-96 min-h-64"
                                                            style={{ maxHeight: '400px', minHeight: '250px' }}
                                                        />
                                                    </div>
                                                    <p className="text-center text-gray-600 text-xs mt-2">
                                                        RGB image with AI prediction overlay
                                                    </p>
                                                </motion.div>
                                            )}

                                            {/* Classification Details */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-white/35 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/50"
                                            >
                                                <h4 className="text-sm font-bold text-gray-900 mb-3 text-center flex items-center justify-center">
                                                    <Target className="w-4 h-4 mr-2 text-emerald-600" />
                                                    Model Classification Details
                                                </h4>
                                                <div className="space-y-2">
                                                    <motion.div
                                                        whileHover={{ scale: 1.02, x: 4 }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-300 shadow-md hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <CheckCircle className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-emerald-900 text-xs">Health (Class 0)</span>
                                                                <p className="text-emerald-800 font-medium text-xs">Normal vegetation indices</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Activity className="w-3 h-3 text-emerald-600" />
                                                            <div className="text-emerald-800 font-bold text-xs">
                                                                {result.predicted_class === 'Health' ? 'PREDICTED' : 'Not detected'}
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.02, x: 4 }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300 shadow-md hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <XCircle className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-amber-900 text-xs">Non-Rust Disease (Class 1)</span>
                                                                <p className="text-amber-800 font-medium text-xs">Other stress conditions</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Activity className="w-3 h-3 text-amber-600" />
                                                            <div className="text-amber-800 font-bold text-xs">
                                                                {result.predicted_class === 'non-rust disease' ? 'PREDICTED' : 'Not detected'}
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    <motion.div
                                                        whileHover={{ scale: 1.02, x: 4 }}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-2 border-red-300 shadow-md hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                <AlertTriangle className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-red-900 text-xs">Yellow Rust Disease (Class 2)</span>
                                                                <p className="text-red-800 font-medium text-xs">Wheat stripe rust detected</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Zap className="w-3 h-3 text-red-600" />
                                                            <div className="text-red-800 font-bold text-xs">
                                                                {result.predicted_class === 'yellow rust disease' ? 'PREDICTED' : 'Not detected'}
                                                            </div>
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
                                            className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl p-8 text-center border-2 border-dashed border-gray-400 relative overflow-hidden shadow-inner"
                                        >
                                            <div className="relative z-10">
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        rotate: [0, 5, -5, 0]
                                                    }}
                                                    transition={{
                                                        duration: 4,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="w-12 h-12 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl"
                                                >
                                                    <Brain className="w-6 h-6 text-white" />
                                                </motion.div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">Ready for Analysis</h3>
                                                <p className="text-gray-700 text-sm font-medium">Upload both RGB and hyperspectral files to begin AI-powered disease detection</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative z-10 bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 border-t-2 border-emerald-600/50 mt-12 overflow-hidden"
            >
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-white">
                        <div className="flex justify-center items-center space-x-3 mb-3">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg"
                            >
                                <Leaf className="w-4 h-4 text-white" />
                            </motion.div>
                            <h3 className="text-lg font-bold">Precision Agriculture AI Platform</h3>
                        </div>
                        <p className="text-emerald-100 text-sm mb-2 font-medium">Powered by advanced hyperspectral imaging and deep learning models</p>
                        <p className="text-emerald-200 font-medium text-sm">Transforming agriculture through AI-driven crop monitoring and early disease detection</p>

                        <div className="flex justify-center items-center space-x-6 mt-4">
                            <motion.div whileHover={{ scale: 1.1, y: -1 }} className="flex flex-col items-center">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-1">
                                    <Brain className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs text-emerald-200">AI Analysis</span>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1, y: -1 }} className="flex flex-col items-center">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-1">
                                    <Microscope className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs text-emerald-200">Hyperspectral</span>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1, y: -1 }} className="flex flex-col items-center">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-1">
                                    <Target className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs text-emerald-200">Precision</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CropDiseaseDetectionPage;