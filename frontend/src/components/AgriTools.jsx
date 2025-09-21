import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Bug, MapPin, Thermometer, Camera, Shield, Globe, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const AgriTools = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const { isLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    if (isLoggedIn) {
      setIsLoaded(true);
    } else {
      navigate("/login");
    }
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.03,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      id: 1,
      title: "Crop Health Diagnostics",
      description: "AI-powered analysis using hyperspectral imaging to detect disease symptoms, nutrient deficiencies, and stress indicators before visible symptoms appear.",
      icon: Camera,
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50 to-green-100",
      iconBg: "from-emerald-400 to-green-600",
      stats: "98% Accuracy",
      features: ["Real-time Analysis", "Early Detection", "Disease Classification"]
    },
    {
      id: 2,
      title: "Intelligent Pest Detection",
      description: "Advanced computer vision and machine learning algorithms identify pest species, population density, and infestation patterns across your fields.",
      icon: Bug,
      gradient: "from-orange-400 via-red-500 to-pink-600",
      bgGradient: "from-orange-50 to-red-100",
      iconBg: "from-orange-400 to-red-600",
      stats: "15+ Pest Types",
      features: ["Species Identification", "Population Tracking", "Damage Assessment"]
    },
    {
      id: 3,
      title: "Geographic Risk Mapping",
      description: "Location-based risk assessment combining weather patterns, historical data, and regional pest/disease prevalence for predictive insights.",
      icon: MapPin,
      gradient: "from-blue-400 via-indigo-500 to-purple-600",
      bgGradient: "from-blue-50 to-indigo-100",
      iconBg: "from-blue-400 to-indigo-600",
      stats: "Field-Level Precision",
      features: ["Weather Integration", "Risk Modeling", "Zone Mapping"]
    },
    {
      id: 4,
      title: "Soil & Environmental Monitor",
      description: "Comprehensive monitoring of soil moisture, pH levels, temperature, humidity, soil and crop nutrient content using IoT sensors and satellite data.",
      icon: Thermometer,
      gradient: "from-violet-400 via-purple-500 to-indigo-600",
      bgGradient: "from-violet-50 to-purple-100",
      iconBg: "from-violet-400 to-purple-600",
      stats: "24/7 Monitoring",
      features: ["Soil Analysis", "Environmental Tracking", "Nutrient Mapping"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-200 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Wave */}
        <motion.div
          className="absolute top-0 left-0 w-full"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <svg className="w-full h-32" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <motion.path
              d="M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,40 L1440,0 L0,0 Z"
              fill="rgba(16, 185, 129, 0.4)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,20 C240,100 480,100 720,60 C960,20 1200,20 1440,60 L1440,0 L0,0 Z"
              fill="rgba(16, 185, 129, 0.2)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Bottom Wave */}
        <motion.div
          className="absolute bottom-0 left-0 w-full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <svg className="w-full h-32" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <motion.path
              d="M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,133.3C672,139,768,117,864,112C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
              fill="rgba(13, 148, 136, 0.3)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-40"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: 0
            }}
            animate={{
              y: [null, -20, 0, -10, 0],
              scale: [0, 1, 0.8, 1, 0.9],
              opacity: [0, 0.6, 0.3, 0.6, 0.4]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <motion.div
          className="text-center py-16 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center space-x-4 mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-green-400 opacity-30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                AgriConnect
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                AI-Powered Precision Agriculture
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Transform Your Farming with AI-Powered Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge hyperspectral imaging, machine learning, and IoT sensors to monitor crop health,
              detect pests, assess risks, and optimize your agricultural operations in real-time.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="flex-1 px-4 pb-16">
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  className="group"
                >
                  <motion.div
                    className="relative h-full"
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Glow Effect */}
                    <motion.div
                      className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                    />

                    {/* Main Card */}
                    <div className={`relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/50 h-full transform transition-all duration-500`}>

                      {/* Header */}
                      <div className="flex items-start space-x-6 mb-6">
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                          whileHover={{ rotate: 5, scale: 1.05 }}
                        >
                          <feature.icon className="w-8 h-8 text-white" />
                        </motion.div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                            {feature.title}
                          </h3>
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${feature.bgGradient} rounded-full`}>
                            <Sparkles className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">{feature.stats}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed mb-6 text-base">
                        {feature.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-3 mb-8">
                        {feature.features.map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * idx }}
                          >
                            <div className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full`} />
                            <span className="text-gray-700 font-medium text-sm">{item}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <motion.button
                        className={`w-full cursor-pointer bg-gradient-to-r ${feature.gradient} text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group/btn relative overflow-hidden`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10">Launch {feature.title.split(' ')[0]} Analysis</span>
                        <motion.div
                          initial={{ x: -5, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-5 h-5 relative z-10" />
                        </motion.div>

                        {/* Button Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                          whileHover={{ x: "200%" }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>


      </div>
    </div>
  );
};

export default AgriTools;