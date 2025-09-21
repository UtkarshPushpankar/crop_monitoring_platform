import React, { useState, useEffect } from 'react';
import {
    Wheat,
    Sprout,
    MapPin,
    Phone,
    Mail,
    Send,
    CheckCircle,
    AlertCircle,
    User,
    Building,
    MessageSquare,
    Loader,
    ArrowRight,
    Shield,
    BarChart3
} from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        userType: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('idle');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const userTypes = [
        { value: 'agronomist', label: 'Agronomist', icon: BarChart3 },
        { value: 'researcher', label: 'Researcher', icon: Shield },
        { value: 'field-technician', label: 'Field Technician', icon: User },
        { value: 'farmer', label: 'Progressive Farmer', icon: Wheat },
        { value: 'consultant', label: 'Agricultural Consultant', icon: Building },
        { value: 'other', label: 'Other', icon: User }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.userType) newErrors.userType = 'Please select your role';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                organization: '',
                userType: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const inputClasses = (fieldName) => `
    w-full px-4 py-3 border-2 rounded-xl transition-all duration-300
    ${errors[fieldName]
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 bg-white focus:border-green-500 focus:ring-green-200'
        }
    focus:ring-4 focus:outline-none placeholder-gray-400
    hover:border-gray-300 transform hover:scale-[1.01]
  `;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-4 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute -bottom-8 left-20 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full animate-spin-slow"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white/20 rounded-full animate-bounce"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                                <Wheat className="h-16 w-16 text-green-200 mr-4 animate-bounce" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
                            </div>
                            <Sprout className="h-20 w-20 text-blue-200 animate-pulse" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                            Contact AgriConnect
                        </h1>
                        <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
                            Connect with our team of agricultural technology experts to discover how AI-powered crop monitoring
                            can revolutionize your farming operations through precision agriculture and data-driven insights.
                        </p>
                        <div className="mt-8 flex items-center justify-center space-x-8">
                            <div className="flex items-center space-x-2 text-green-200">
                                <Shield className="h-5 w-5" />
                                <span>AI-Powered Analysis</span>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-200">
                                <BarChart3 className="h-5 w-5" />
                                <span>Real-time Monitoring</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Information */}
                    <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Ready to revolutionize your crop monitoring with AI? Our agricultural technology experts are here to discuss
                                how multispectral imaging, sensor data integration, and machine learning can transform your farming operations.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="group flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                                    <MapPin className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Research Headquarters</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Bennett University<br />
                                        Greater Noida, Uttar Pradesh - 201310
                                    </p>
                                </div>
                            </div>

                            <div className="group flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                                    <Phone className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                                    <p className="text-gray-600">+91 9508133792</p>
                                    <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM CST</p>
                                    <p className="text-sm text-gray-500">24/7 Emergency Support Available</p>
                                </div>
                            </div>

                            <div className="group flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors duration-300">
                                    <Mail className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                                    <p className="text-gray-600">support@agriconnect.com</p>
                                    <p className="text-gray-600">research@agriconnect.com</p>
                                    <p className="text-sm text-gray-500">Response within 4 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                                <div className="text-2xl font-bold text-green-800">500+</div>
                                <div className="text-sm text-green-600">Farms Monitored</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                                <div className="text-2xl font-bold text-blue-800">95%</div>
                                <div className="text-sm text-blue-600">Accuracy Rate</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                                <div className="text-2xl font-bold text-emerald-800">24/7</div>
                                <div className="text-sm text-emerald-600">Monitoring</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                                <p className="text-gray-600">Fill out the form below and we'll get back to you within 4 hours.</p>
                            </div>

                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-600 animate-bounce" />
                                        <p className="text-green-800 font-medium">Thank you! Your message has been sent successfully.</p>
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                                    <div className="flex items-center space-x-3">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                        <p className="text-red-800 font-medium">Sorry, there was an error sending your message. Please try again.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name and Email Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="inline h-4 w-4 mr-2" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={inputClasses('name')}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="inline h-4 w-4 mr-2" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={inputClasses('email')}
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Organization */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Building className="inline h-4 w-4 mr-2" />
                                        Organization (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className={inputClasses('organization')}
                                        placeholder="Your organization or farm name"
                                    />
                                </div>

                                {/* User Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <User className="inline h-4 w-4 mr-2" />
                                        Your Role *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {userTypes.map((type) => {
                                            const IconComponent = type.icon;
                                            return (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, userType: type.value }));
                                                        if (errors.userType) setErrors(prev => ({ ...prev, userType: '' }));
                                                    }}
                                                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${formData.userType === type.value
                                                            ? 'border-green-500 bg-green-50 text-green-700'
                                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <IconComponent className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{type.label}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.userType && <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.userType}</p>}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MessageSquare className="inline h-4 w-4 mr-2" />
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={inputClasses('subject')}
                                        placeholder="What can we help you with?"
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.subject}</p>}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className={inputClasses('message')}
                                        placeholder="Tell us more about your agricultural monitoring needs and how we can help..."
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.message}</p>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold
                           hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-green-200 
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="h-5 w-5 animate-spin" />
                                            <span>Sending Message...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            <span>Send Message</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional CTA Section */}
            <div className="bg-gradient-to-r from-gray-900 to-green-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Agriculture?</h3>
                    <p className="text-xl text-gray-300 mb-8">
                        Join hundreds of progressive farmers and agricultural professionals who trust AgriVision AI
                        for precision crop monitoring and data-driven decision making.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300 transform hover:scale-105">
                            Schedule a Demo
                        </button>
                        <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                            Download Brochure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;