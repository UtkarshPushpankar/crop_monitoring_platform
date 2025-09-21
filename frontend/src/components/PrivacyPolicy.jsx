import { motion } from 'framer-motion';
import { Shield, Eye, Database, Users, Lock, Mail, Leaf, Cpu, Camera, BarChart } from 'lucide-react';

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Reduced from 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // Reduced from y: 30
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4, // Reduced from 0.6
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5, // Reduced from 0.8
        ease: "easeOut"
      }
    }
  };

  const Section = ({ icon: Icon, title, children, delay = 0 }) => (
    <motion.section
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: delay * 0.3 }} // Reduced delay multiplier
      className="mb-12"
    >
      <motion.div
        className="flex items-center mb-6"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          variants={iconVariants}
          className="mr-4 p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          {title}
        </h2>
      </motion.div>
      <motion.div
        className="ml-16 text-gray-700 leading-relaxed"
        initial={{ opacity: 0, x: 15 }} // Reduced from x: 20
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay * 0.3 + 0.1, duration: 0.4 }} // Reduced delays and duration
      >
        {children}
      </motion.div>
    </motion.section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }} // Reduced from y: -100
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }} // Reduced from 0.8
        className="bg-white shadow-lg border-b-4 border-green-500"
      >
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }} // Reduced from 1
          >
            <motion.div
              className="mr-4 p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <Leaf className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                AI-Powered Precision Agriculture
              </p>
            </div>
          </motion.div>
          <motion.p
            className="text-center text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 15 }} // Reduced from y: 20
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }} // Reduced from delay: 0.5, duration: 0.6
          >
            Your privacy and data security are fundamental to our mission of advancing sustainable, precision agriculture through AI-driven insights.
          </motion.p>
          <motion.div
            className="text-center mt-4 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }} // Reduced from delay: 0.8, duration: 0.6
          >
            Last Updated: January 2025
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-12"
      >
        {/* Overview */}
        <Section icon={Shield} title="Overview" delay={0.1}>
          <p className="mb-4">
            This Privacy Policy describes how our AI-powered crop monitoring platform ("we," "our," or "the Platform") collects, uses, protects, and shares information when you use our services. Our platform leverages hyperspectral/multispectral imaging, environmental sensor data, and advanced AI models including LSTM and CNN networks to provide precision agriculture insights.
          </p>
          <p>
            We are committed to protecting your privacy while delivering cutting-edge agricultural monitoring solutions to agronomists, researchers, field technicians, and progressive farmers worldwide.
          </p>
        </Section>

        {/* Information We Collect */}
        <Section icon={Database} title="Information We Collect" delay={0.2}>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <Camera className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Spectral Imaging Data</h3>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Multispectral and hyperspectral image sequences</li>
                <li>• Vegetation indices (NDVI, GNDVI, etc.)</li>
                <li>• Soil spectral characteristics</li>
                <li>• Historical imaging datasets</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <BarChart className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Environmental Sensor Data</h3>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Soil moisture levels</li>
                <li>• Air temperature and humidity</li>
                <li>• Leaf wetness measurements</li>
                <li>• Weather pattern data</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-800">User Account Information</h3>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Name and contact details</li>
                <li>• Farm location and size</li>
                <li>• Crop types and farming practices</li>
                <li>• User preferences and settings</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <Cpu className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Platform Usage Data</h3>
              </div>
              <ul className="text-sm space-y-2">
                <li>• Dashboard interactions</li>
                <li>• Report generation history</li>
                <li>• Alert preferences</li>
                <li>• Mobile app usage patterns</li>
              </ul>
            </motion.div>
          </div>
        </Section>

        {/* How We Use Information */}
        <Section icon={Cpu} title="How We Use Your Information" delay={0.3}>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl border-l-4 border-green-500">
              <h3 className="font-semibold text-gray-800 mb-3">AI Model Training & Enhancement</h3>
              <p className="text-gray-700">
                We use spectral imaging and sensor data to train and improve our LSTM and CNN models for better crop health prediction, soil condition analysis, and pest risk assessment.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-xl border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-800 mb-3">Precision Agriculture Insights</h3>
              <p className="text-gray-700">
                Your data enables us to provide personalized crop monitoring, early disease detection, targeted alerts, and zone-specific recommendations for sustainable farming practices.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl border-l-4 border-purple-500">
              <h3 className="font-semibold text-gray-800 mb-3">Continuous Learning & Localization</h3>
              <p className="text-gray-700">
                We continuously refine our algorithms using aggregated data patterns to improve accuracy for specific geographic regions and crop types.
              </p>
            </div>
          </div>
        </Section>

        {/* Data Sharing */}
        <Section icon={Users} title="Data Sharing and Disclosure" delay={0.4}>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">We may share your information in the following circumstances:</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Research Partnerships:</strong> Anonymized, aggregated data may be shared with agricultural research institutions to advance crop science and sustainable farming practices.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Service Providers:</strong> Trusted third parties who assist in platform operations, cloud computing, and data analysis services under strict confidentiality agreements.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Legal Requirements:</strong> When required by law, regulation, or legal process to protect rights, property, or safety.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>We Never:</strong> Sell your personal data to marketers or use your farm-specific information for commercial purposes outside of platform services.
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Data Security */}
        <Section icon={Lock} title="Data Security and Protection" delay={0.5}>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className="text-center p-6 bg-white rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Encryption</h3>
              <p className="text-sm text-gray-600">
                End-to-end encryption for data transmission and AES-256 encryption for data storage
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-white rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Access Control</h3>
              <p className="text-sm text-gray-600">
                Multi-factor authentication and role-based access controls for platform security
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-white rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Database className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Data Backup</h3>
              <p className="text-sm text-gray-600">
                Regular automated backups with geographic redundancy and disaster recovery protocols
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Your Rights */}
        <Section icon={Eye} title="Your Privacy Rights" delay={0.6}>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-200">
            <h3 className="font-semibold text-gray-800 mb-6 text-lg">You have the right to:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Access your personal data and usage reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Correct inaccurate information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Request data deletion (with limitations)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Opt-out of data processing for research</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Export your farm data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Control notification preferences</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Cookies and Tracking */}
        <Section icon={Eye} title="Cookies and Tracking Technologies" delay={0.7}>
          <p className="mb-4">
            Our platform uses cookies and similar technologies to enhance user experience, remember preferences, and analyze platform usage. This includes:
          </p>
          <div className="space-y-3 ml-4">
            <div>• <strong>Essential Cookies:</strong> Required for platform functionality and security</div>
            <div>• <strong>Analytics Cookies:</strong> Help us understand usage patterns and improve services</div>
            <div>• <strong>Preference Cookies:</strong> Remember your dashboard settings and alert configurations</div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            You can manage cookie preferences through your browser settings, though disabling certain cookies may limit platform functionality.
          </p>
        </Section>

        <motion.div
          className="mt-16 p-6 bg-gray-100 rounded-xl border-l-4 border-gray-400"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }} // Reduced from 0.6
        >
          <h3 className="font-semibold text-gray-800 mb-2">Policy Updates</h3>
          <p className="text-gray-600 text-sm">
            This Privacy Policy may be updated periodically to reflect changes in our practices or legal requirements.
            We will notify users of significant changes through platform notifications and email alerts.
            Continued use of our services after updates constitutes acceptance of the revised policy.
          </p>
        </motion.div>
      </motion.main>

    </div>
  );
};

export default PrivacyPolicy;