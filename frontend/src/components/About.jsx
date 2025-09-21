import React from "react";
import { Leaf, Cpu, BarChart3, AlertTriangle, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Chatbot from "../Chatbot/Chatbutton";
const About = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const handlestart = () => {
    window.location.href = '/signup';
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full">
        <svg className="w-full h-20" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 C240,60 480,60 720,30 C960,0 1200,0 1440,30 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.6)" />
          <path d="M0,10 C240,70 480,70 720,40 C960,10 1200,10 1440,40 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.4)" />
          <path d="M0,20 C240,80 480,80 720,50 C960,20 1200,20 1440,50 L1440,0 L0,0 Z" fill="rgba(34, 197, 94, 0.2)" />
        </svg>
      </div>

      <motion.div ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4 flex justify-center items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              AgriConnect – AI for Smart Farming
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Empowering farmers with AI-powered monitoring of crop health, soil condition, and pest risks
              using multispectral/hyperspectral imaging and IoT sensors.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-green-700 mb-3">🌍 The Challenge</h2>
              <p className="text-gray-700 leading-relaxed">
                Agriculture faces threats from <strong>soil degradation, unpredictable weather, and pest outbreaks</strong>.
                Traditional monitoring is delayed, labor-intensive, and lacks precision—leading to reduced yields and losses.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-green-700 mb-3">💡 Our Solution</h2>
              <p className="text-gray-700 leading-relaxed">
                फसलSaathi integrates <strong>AI + remote sensing + IoT sensors</strong> into a unified platform.
                Farmers get <strong>real-time insights</strong> on soil health, crop diseases, and pest risks—shifting from
                reactive to proactive crop management.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">✨ Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
              <Cpu className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 text-sm">
                LSTM & CNN models detect crop stress, soil condition, and predict disease risks early.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
              <BarChart3 className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Spectral Imaging</h3>
              <p className="text-gray-600 text-sm">
                Hyperspectral & multispectral imaging with vegetation indices for precision farming.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
              <AlertTriangle className="w-10 h-10 text-red-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pest & Risk Alerts</h3>
              <p className="text-gray-600 text-sm">
                Early detection of pest risks and soil anomalies with zone-specific alerts.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mt-16 mb-8">👨‍🌾 Who Can Use?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-green-50 rounded-xl p-6 shadow-md">
              <Users className="w-8 h-8 text-green-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800">Farmers</h4>
              <p className="text-sm text-gray-600">Get instant soil & crop health insights.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 shadow-md">
              <Globe className="w-8 h-8 text-green-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800">Agronomists</h4>
              <p className="text-sm text-gray-600">Research with real-time field data.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 shadow-md">
              <Leaf className="w-8 h-8 text-green-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800">Researchers</h4>
              <p className="text-sm text-gray-600">Monitor crop patterns and soil trends.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 shadow-md">
              <Cpu className="w-8 h-8 text-green-700 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800">Govt & NGOs</h4>
              <p className="text-sm text-gray-600">Support sustainable precision agriculture.</p>
            </div>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🌱 Join us in building the future of farming!
            </h2>
            <p className="text-gray-600 mb-6">
              फसलSaathi empowers farmers with AI to improve yield, cut losses, and enable sustainable agriculture.
            </p>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition cursor-pointer" onClick={handlestart}>
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;

