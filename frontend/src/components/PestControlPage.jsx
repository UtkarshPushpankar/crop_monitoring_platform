import React, { useState, useEffect } from 'react';
import { Upload, Play, Download, AlertTriangle, TrendingUp, Droplets, Wind, Gauge, ThermometerSun } from 'lucide-react';

const PYTHON_URL = import.meta.env.VITE_PYTHON_URL || 'http://localhost:8000';
const PestControlMonitoring = () => {
    const [formData, setFormData] = useState({
        surfacePressure: '',
        windSpeed: '',
        relativeHumidity: '',
        totalEvaporation: ''
    });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setUploadedFile(file);
        } else {
            alert('Please upload a CSV file');
        }
    };

    const [result, setResult] = useState(null);

    const generateOutput = async () => {
        if (!uploadedFile) {
            alert('Please upload a CSV file before generating output');
            return;
        }

        setIsGenerating(true);

        try {
            const form = new FormData();
            form.append('file', uploadedFile);
            form.append('surfacePressure', formData.surfacePressure);
            form.append('windSpeed', formData.windSpeed);
            form.append('relativeHumidity', formData.relativeHumidity);
            form.append('totalEvaporation', formData.totalEvaporation);

            const res = await fetch(`${PYTHON_URL}/predict`, {
                method: "POST",
                body: form
            });

            const data = await res.json();
            console.log(data)
            setResult(data);
            setShowResults(true);
        } catch (err) {
            console.error(err);
            alert("Error while generating output");
        } finally {
            setIsGenerating(false);
        }
    };

    const HeatmapCell = ({ intensity, color }) => (
        <div
            className={`w-4 h-4 ${color} transition-all duration-300 hover:scale-110 hover:z-10 relative rounded-sm`}
            style={{ opacity: intensity }}
        />
    );

    const generateHeatmapData = (baseColor) => {
        return Array.from({ length: 15 }, (_, row) =>
            Array.from({ length: 20 }, (_, col) => ({
                intensity: Math.random() * 0.8 + 0.2,
                value: Math.random() * 100
            }))
        );
    };

    const HeatmapVisualization = ({ title, data, colorClass, unit, date }) => (
        <div className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <span className="text-sm text-gray-600 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full border border-blue-200">{date}</span>
            </div>

            <div className="relative">
                <div className="grid grid-cols-20 gap-0 mb-4 p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg">
                    {data.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <HeatmapCell
                                key={`${rowIndex}-${colIndex}`}
                                intensity={cell.intensity}
                                color={colorClass}
                            />
                        ))
                    )}
                </div>

                {/* Axes labels */}
                <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
                    <span>76° longitude</span>
                </div>
                <div className="absolute -bottom-8 right-0 text-xs text-gray-500">
                    <span>84° longitude</span>
                </div>
                <div className="absolute -left-12 top-0 text-xs text-gray-500 transform -rotate-90 origin-center">
                    <span>19° latitude</span>
                </div>
                <div className="absolute -left-12 bottom-0 text-xs text-gray-500 transform -rotate-90 origin-center">
                    <span>12° latitude</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-600">Low</span>
                <div className="flex space-x-1">
                    {Array.from({ length: 10 }, (_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 ${colorClass} rounded-sm`}
                            style={{ opacity: (i + 1) / 10 }}
                        />
                    ))}
                </div>
                <span className="text-xs text-gray-600">High</span>
                <span className="text-xs text-gray-500 ml-4">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-200 to-cyan-300 relative overflow-hidden">
            {/* Wavy Top Border */}
            <div className="absolute top-0 left-0 w-full">
                <svg className="w-full h-24" viewBox="0 0 1440 96" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,0 C240,72 480,72 720,36 C960,0 1200,0 1440,36 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.6)" />
                    <path d="M0,12 C240,84 480,84 720,48 C960,12 1200,12 1440,48 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.4)" />
                    <path d="M0,24 C240,96 480,96 720,60 C960,24 1200,24 1440,60 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.2)" />
                </svg>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,48L48,56C96,64,192,80,288,80C384,80,480,64,576,61.3C672,58,768,69,864,69.3C960,69,1056,58,1152,58.7C1248,58,1344,69,1392,74.7L1440,80L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z" fill="rgba(34, 197, 94, 0.1)" />
                </svg>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-3 h-3 bg-gradient-to-br from-green-300 to-blue-300 rounded-full opacity-30 animate-bounce transform transition-all duration-500 ${isLoaded ? 'scale-100 opacity-30' : 'scale-0 opacity-0'}`}
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${15 + (i % 4) * 20}%`,
                            animationDelay: `${i * 0.6}s`,
                            animationDuration: `${3 + i * 0.4}s`,
                            transitionDelay: `${1000 + i * 150}ms`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className={`mb-8 text-center transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="flex items-center justify-center mb-4">
                            {/* Logo */}
                            <div className="relative mr-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                                    </svg>
                                </div>
                                <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-ping opacity-30"></div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-black">
                                AgriConnect AI- Powered Pest Control Monitoring
                            </h1>
                        </div>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            Empowering farmers with AI-powered monitoring of crop health, soil condition, and pest risks using multispectral imaging and environmental data analysis
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className={`bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/30 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center">
                            <Gauge className="mr-3 text-blue-600" size={28} />
                            Environmental Parameters
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Gauge className="mr-2 text-blue-500" size={16} />
                                    Surface Pressure (hPa)
                                </label>
                                <input
                                    type="number"
                                    value={formData.surfacePressure}
                                    onChange={(e) => handleInputChange('surfacePressure', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gradient-to-br from-white to-blue-50 group-hover:shadow-lg"
                                    placeholder="e.g., 1013.25"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Wind className="mr-2 text-green-500" size={16} />
                                    Wind Speed (m/s)
                                </label>
                                <input
                                    type="number"
                                    value={formData.windSpeed}
                                    onChange={(e) => handleInputChange('windSpeed', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gradient-to-br from-white to-green-50 group-hover:shadow-lg"
                                    placeholder="e.g., 5.2"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Droplets className="mr-2 text-blue-500" size={16} />
                                    Relative Humidity (%)
                                </label>
                                <input
                                    type="number"
                                    value={formData.relativeHumidity}
                                    onChange={(e) => handleInputChange('relativeHumidity', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gradient-to-br from-white to-blue-50 group-hover:shadow-lg"
                                    placeholder="e.g., 65.8"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <ThermometerSun className="mr-2 text-orange-500" size={16} />
                                    Total Evaporation (mm)
                                </label>
                                <input
                                    type="number"
                                    value={formData.totalEvaporation}
                                    onChange={(e) => handleInputChange('totalEvaporation', e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gradient-to-br from-white to-orange-50 group-hover:shadow-lg"
                                    placeholder="e.g., 2.4"
                                />
                            </div>
                        </div>

                        {/* File Upload and Generate Section */}
                        <div className="flex flex-col lg:flex-row gap-6 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Upload className="mr-2 text-purple-500" size={16} />
                                    Upload CSV Data File
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gradient-to-br from-white to-purple-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-50 file:to-blue-50 file:text-purple-700 hover:file:from-purple-100 hover:file:to-blue-100"
                                    />
                                    {uploadedFile && (
                                        <div className="mt-3 text-sm text-green-600 flex items-center bg-green-50 p-2 rounded-lg">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                            {uploadedFile.name} uploaded successfully
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={generateOutput}
                                disabled={isGenerating || !uploadedFile}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-3" size={20} />
                                        Generate Analysis
                                    </>
                                )}
                            </button>
                        </div>
                    </div>



                    {/* Processing Status */}
                    {isGenerating && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-2xl shadow-lg backdrop-blur-sm">
                            <div className="flex items-center">
                                <TrendingUp className="text-blue-500 mr-4" size={28} />
                                <div>
                                    <p className="text-blue-800 font-semibold text-lg">AI Analysis in Progress</p>
                                    <p className="text-blue-600">Processing spectral data and environmental parameters...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Section */}
 

                            {showResults && result && (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center">
                                            <AlertTriangle className="mr-3 text-orange-500" size={32} />
                                            Pest Risk Analysis Results
                                        </h2>
                                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105">
                                            <Download className="mr-2" size={18} />
                                            Export Report
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-lg p-6">
                                        <p className="text-lg font-semibold text-gray-700">
                                            Predicted Pest Risk Probability:{" "}
                                            <span className="text-red-600">{(result.predicted_prob * 100).toFixed(2)}%</span>
                                        </p>
                                        <div className="mt-4">
                                            <img src={result.graph} alt="Pest Risk Graph" className="rounded-lg shadow-md" />
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Analysis Summary */}
                            <div className={`bg-gradient-to-r from-white/60 via-green-50/80 to-blue-50/60 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl transform transition-all duration-700 delay-300 ${showResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <h3 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">Analysis Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-white/80 to-red-50/80 rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300">
                                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">High Risk Zones</h4>
                                        <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">23%</p>
                                        <p className="text-sm text-gray-600 mt-1">of monitored area</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-white/80 to-orange-50/80 rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300">
                                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">Treatment Recommended</h4>
                                        <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">156</p>
                                        <p className="text-sm text-gray-600 mt-1">hectares</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-white/80 to-green-50/80 rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-white/30 transform hover:scale-105 transition-all duration-300">
                                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">Confidence Level</h4>
                                        <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">87%</p>
                                        <p className="text-sm text-gray-600 mt-1">prediction accuracy</p>
                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        </div>
    );
};

export default PestControlMonitoring;