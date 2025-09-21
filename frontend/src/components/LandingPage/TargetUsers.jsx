import React from 'react';
import { motion } from 'framer-motion';
import { Users, Microscope, Wrench, Tractor } from 'lucide-react';

const TargetUsers = () => {
  const users = [
    {
      icon: <Microscope className="w-12 h-12" />,
      title: "Agronomists",
      description: "Get detailed crop analysis and scientific insights to make data-driven recommendations for optimal farming practices",
      benefits: ["Scientific accuracy", "Research capabilities", "Data export options"]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Researchers",
      description: "Access comprehensive datasets and advanced analytics for agricultural research and academic studies",
      benefits: ["Historical data", "Research tools", "Publication support"]
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: "Field Technicians",
      description: "Mobile-friendly interface provides real-time field data and guidance for efficient crop management tasks",
      benefits: ["Mobile access", "Real-time updates", "Field guidance"]
    },
    {
      icon: <Tractor className="w-12 h-12" />,
      title: "Progressive Farmers",
      description: "Transform traditional farming with AI-powered insights that increase yields and reduce operational costs",
      benefits: ["Increased yields", "Cost reduction", "Risk mitigation"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent mb-4"
          >
            Built for Agriculture Professionals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Our platform serves diverse users in the agricultural ecosystem, from researchers to farmers,
            providing tailored insights for each role.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {users.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{
                scale: 1.05,
                y: -10,
                backgroundColor: "rgba(31, 41, 55, 0.8)"
              }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 transition-all duration-300 group hover:border-emerald-500/50"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="text-emerald-400 mb-6"
              >
                {user.icon}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.1 }}
                viewport={{ once: true }}
                className="text-xl font-semibold text-white mb-4"
              >
                {user.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.15 }}
                viewport={{ once: true }}
                className="text-gray-300 mb-6 leading-relaxed"
              >
                {user.description}
              </motion.p>
              <div className="space-y-2">
                {user.benefits.map((benefit, benefitIndex) => (
                  <motion.div
                    key={benefitIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.2 + benefitIndex * 0.03 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: benefitIndex * 0.2 }}
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                    />
                    <span className="text-sm text-gray-400">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetUsers;