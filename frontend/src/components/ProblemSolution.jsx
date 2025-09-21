import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Clock, Target, Brain, Zap } from 'lucide-react';

const ProblemSolution = () => {
  const problems = [
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Delayed Detection",
      description: "Traditional monitoring methods identify issues too late, resulting in significant crop losses and reduced productivity"
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Reduced Yields",
      description: "Soil degradation and pest outbreaks lead to decreased productivity and substantial economic losses for farmers"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Labor Intensive",
      description: "Manual field surveys are time-consuming, costly, and lack the precision needed for optimal crop management"
    }
  ];

  const solutions = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Driven Analysis",
      description: "Advanced LSTM and CNN models analyze hyperspectral data for precise crop health assessment and predictive insights"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Insights",
      description: "Continuous monitoring provides immediate alerts and actionable recommendations for proactive farm management"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Agriculture",
      description: "Field-level insights enable targeted interventions and optimized resource allocation for maximum efficiency"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4"
          >
            From Reactive to Proactive Agriculture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Traditional farming faces unprecedented challenges. Our AI platform transforms how farmers monitor and manage their crops.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-red-600 mb-8 flex items-center gap-3"
            >
              <AlertTriangle className="w-8 h-8" />
              Current Challenges
            </motion.h3>
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-red-500 mt-1"
                    >
                      {problem.icon}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">{problem.title}</h4>
                      <p className="text-gray-600">{problem.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-emerald-600 mb-8 flex items-center gap-3"
            >
              <Target className="w-8 h-8" />
              Our Solution
            </motion.h3>
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl shadow-md border-l-4 border-emerald-400 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-emerald-600 mt-1"
                    >
                      {solution.icon}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">{solution.title}</h4>
                      <p className="text-gray-600">{solution.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;