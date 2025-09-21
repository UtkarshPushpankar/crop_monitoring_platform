import React from 'react';
import { motion } from 'framer-motion';
import { Eye, BarChart3, Bell, Thermometer, Droplets, Bug, MapPin, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Hyperspectral Imaging",
      description: "Advanced multispectral analysis reveals crop stress invisible to the naked eye using cutting-edge imaging technology",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Vegetation Indices",
      description: "Real-time NDVI, SAVI, and custom indices track crop health and growth patterns with unprecedented accuracy",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Proactive notifications for disease outbreaks, stress conditions, and optimal action windows delivered instantly",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Thermometer className="w-8 h-8" />,
      title: "Environmental Monitoring",
      description: "Integrated sensors track soil moisture, temperature, humidity, and leaf wetness for comprehensive field analysis",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Bug className="w-8 h-8" />,
      title: "Pest Risk Prediction",
      description: "AI models predict pest outbreaks and disease risks using environmental data and historical patterns",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Field Mapping",
      description: "Detailed spectral health maps show precise locations of stress, diseases, and optimal growth areas",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4"
          >
            Powerful AI-Driven Capabilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our platform combines hyperspectral imaging, environmental sensors, and machine learning to deliver
            comprehensive crop monitoring solutions.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              viewport={{ once: true }}
              className="group bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:border-emerald-200"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-6`}
              >
                {feature.icon}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.1 }}
                viewport={{ once: true }}
                className="text-xl font-semibold text-gray-900 mb-4"
              >
                {feature.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.15 }}
                viewport={{ once: true }}
                className="text-gray-600 leading-relaxed"
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;