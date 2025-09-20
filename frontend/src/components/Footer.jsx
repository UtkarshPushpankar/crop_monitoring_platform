import React from 'react'
import { MapPin, Phone, Mail, Leaf, Sprout, TreePine } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-300 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
            </div>

            {/* Decorative Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Leaf className="absolute top-16 right-32 w-8 h-8 text-emerald-300 opacity-20 animate-pulse" />
                <Sprout className="absolute bottom-32 left-16 w-6 h-6 text-green-300 opacity-30 animate-bounce" style={{ animationDelay: '1s' }} />
                <TreePine className="absolute top-1/3 right-16 w-10 h-10 text-teal-300 opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-8">
            <div className="relative max-w-7xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Section - Company Info */}
                    <div className="space-y-2">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Leaf className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                                    AgriConnect HUB
                                </h2>
                            </div>
                            <p className="text-emerald-50 leading-relaxed max-w-lg text-md font-[500]">
                                We provide comprehensive agricultural monitoring solutions tailored to modern farming needs.
                                Our platform combines advanced multispectral imaging with AI-powered analytics, ensuring
                                precise crop health assessment, soil condition monitoring, and pest risk detection.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-1">
                            <h3 className="text-lg mt-2 font-semibold text-emerald-100 mb-2">Get In Touch</h3>
                            
                            <div className="flex items-start space-x-2 group">
                                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                                    <MapPin className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <p className="text-emerald-50 font-medium text-xs">Our Location</p>
                                    <p className="text-emerald-100 text-xs">
                                        Agricultural Research Center, Sector 15,<br />
                                        Greater Noida, Uttar Pradesh - 201310
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 group">
                                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                                    <Phone className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <p className="text-emerald-50 font-medium text-xs">Call Us</p>
                                    <p className="text-emerald-100 text-xs">+91 9876543210</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 group">
                                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                                    <Mail className="w-3 h-3 text-white" />
                                </div>
                                <div>
                                    <p className="text-emerald-50 font-medium text-xs">Email Us</p>
                                    <p className="text-emerald-100 text-xs">info@agriconnecthub.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Quick Links */}
                    <div className="lg:flex lg:justify-end">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-emerald-100 mb-1">Quick Links</h3>
                            <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
                                {[
                                    { href: "#about", text: "About Us" },
                                    // { href: "#services", text: "Our Services" },
                                    { href: "#technology", text: "Technology" },
                                    { href: "#contact", text: "Contact" },
                                    { href: "#privacy", text: "Privacy Policy" },
                                    // { href: "#terms", text: "Terms & Conditions" },
                                    // { href: "#support", text: "Technical Support" }
                                ].map((link, index) => (
                                    <a 
                                        key={index}
                                        href={link.href} 
                                        className="group flex items-center space-x-1 text-emerald-100 hover:text-white transition-all duration-300 py-0.5 px-1 rounded text-sm hover:bg-white/10 backdrop-blur-sm"
                                    >
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:bg-white transition-colors duration-300"></div>
                                        <span className="font-medium">{link.text}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="relative mt-3 pt-2">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
                        <p className="text-emerald-100 font-medium text-xs">
                            © 2025 AgriConnect Hub. All Rights Reserved.
                        </p>
                        <p className="text-emerald-100 text-xs">
                            Designed And Developed By{' '}
                            <span className="text-white font-semibold">
                                AgriConnect Team
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"></div>
        </footer>
    )
}

export default Footer