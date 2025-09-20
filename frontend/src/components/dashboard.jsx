
import React, { useState, useEffect } from "react";
import { Leaf, Thermometer, TrendingUp, UploadCloud, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WiDaySunny, WiCloudy, WiThunderstorm, WiRain } from "react-icons/wi";
import axios from "axios";
import CarbonDashboard from "./carbondashboard.jsx";

const API_URL = import.meta.env.VITE_PYTHON_URL;
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Dashboard = () => {

    const [lat, setlat] = useState(null);
    const [lon, setlon] = useState(null);

    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mandiData, setMandiData] = useState([]);
    const [recommendation, setRecommendation] = useState("");


    const soilUploads = [
        { image: "/dummy_soil.jpg", analysis: "Nitrogen deficiency detected" },
        { image: "/dummy_soil2.jpg", analysis: "pH low, add lime" },
    ];

    const plantUploads = [
        { image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", analysis: "Leaf spot detected, apply fungicide" },
        { image: "/dummy_plant2.jpg", analysis: "Yellowing leaves, check nitrogen" },
    ];



    // ------------------------------------------------------------------------------------4


    const getAISuggestion = () => {
        try {
            axios.post(`${API_URL}/weather`, {"weather_data":weatherData})
                .then((res) => {
                    // console.log("AI Suggestion:", res.data.recommendation);
                    setRecommendation(res.data.recommendation);
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const getWeatherIcon = (condition) => {
        switch (condition.toLowerCase()) {
            case "sunny": return <WiDaySunny className="w-12 h-12 text-yellow-500" />;
            case "cloudy": return <WiCloudy className="w-12 h-12 text-gray-500" />;
            case "rain": return <WiRain className="w-12 h-12 text-blue-500" />;
            case "thunderstorm": return <WiThunderstorm className="w-12 h-12 text-purple-700" />;
            default: return <WiDaySunny className="w-12 h-12 text-yellow-500" />;
        }
    };

    // Carousel states
    const [soilSlide, setSoilSlide] = useState(0);
    const [plantSlide, setPlantSlide] = useState(0);

    const nextSlide = (type) => {
        if (type === "soil") setSoilSlide((prev) => (prev + 1) % soilUploads.length);
        else setPlantSlide((prev) => (prev + 1) % plantUploads.length);
    };

    const prevSlide = (type) => {
        if (type === "soil") setSoilSlide((prev) => (prev - 1 + soilUploads.length) % soilUploads.length);
        else setPlantSlide((prev) => (prev - 1 + plantUploads.length) % plantUploads.length);
    };


    // Location
    const handleDetectLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                setlat(pos.coords.latitude);
                setlon(pos.coords.longitude);
                if (lat && lon) console.log(lat, lon);
            });
        } else {
            alert("Geolocation not supported");
        }

    };

    useEffect(() => {
        handleDetectLocation();
    }, []);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchWeather = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
                );
                const data = await res.json();
                // console.log(data);

                // Group 3-hourly forecasts by day
                const daysMap = {};
                data.list.forEach(item => {
                    const date = new Date(item.dt * 1000);
                    const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
                    if (!daysMap[dayKey]) daysMap[dayKey] = [];
                    daysMap[dayKey].push(item);
                });

                // Get today + next 2 days
                const forecast = Object.keys(daysMap)
                    .slice(0, 3)
                    .map(dayKey => {
                        const dayItems = daysMap[dayKey];
                        const temps = dayItems.map(d => d.main.temp);
                        const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
                        const condition = dayItems[0].weather[0].main;
                        const weekday = new Date(dayItems[0].dt * 1000).toLocaleDateString("en-US", { weekday: "short" });

                        return {
                            day: weekday,
                            temp: `${avgTemp}°C`,
                            condition
                        };
                    });

                setWeatherData(forecast);
                // console.log("3-day Weather:", forecast);
            } catch (err) {
                console.error(err);
            } finally {
                // getAISuggestion();
                setLoading(false);
            }
        };

        fetchWeather();
    }, [lat, lon]);

    useEffect(() => {
        if (weatherData.length === 0) return;
        getAISuggestion();
    }, [weatherData]);


    useEffect(() => {
        if (!lat || !lon) return;
        console.log("Fetching Mandi data for:", lat, lon);
        const fetchMandi = async () => {
            try {
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                const data = res.data;
                console.log("Mandi Data:", data.address.state_district);
                const district = data.address.state_district
                const state = data.address.state
                const price = await axios.get(`http://localhost:5000/mandidata/data/?state=${state}&district=${district}`);
                // console.log("Mandi Price:",price.data);
                setMandiData(price.data);

            } catch (err) {
                console.log(err);
            }
        }
        fetchMandi();
    }, [lat, lon]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-2 flex justify-center items-center gap-3">
                        <Leaf className="text-green-700 w-12 h-12" />
                        फसलSaathi
                    </h1>
                    <p className="text-gray-700 max-w-3xl mx-auto">
                        AI-powered crop & soil monitoring, real-time weather & mandi forecasting, and sustainability insights.
                    </p>
                    <p className="text-gray-600 mt-2 font-semibold"></p>
                </div>

                {/* Weather & Mandi Unified Card */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {<motion.div whileHover={{ scale: 1.05 }} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                            <Thermometer className="w-8 h-8 text-red-500" />
                            Real-Time 3-Day Weather
                        </h2>

                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                            {weatherData.map((day, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="bg-green-50/50 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm"
                                >
                                    <span className="font-semibold text-gray-800">{day.day}</span>
                                    <div className="my-2">{getWeatherIcon(day.condition)}</div>
                                    <span className="text-gray-700">{day.temp}</span>
                                    <span className="text-sm text-gray-600">{day.condition}</span>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-green-700 font-semibold mt-2 text-center">
                            AI Suggestion: {recommendation || "Loading..."}
                        </p>
                    </motion.div>}


                    <motion.div whileHover={{ scale: 1.05 }} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-800">(Your District) Mandi Price Forecast</h2>
                        </div>
                        {mandiData.map((item, index) => (
                            <div key={index} className="flex justify-between text-gray-700 mb-1">
                                <span>{item.crop}</span>
                                <span className="font-semibold">{item.price} ({item.change})</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Previous Uploads */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex justify-center items-center gap-3">
                    <UploadCloud className="w-8 h-8 text-green-600" /> Previous Uploads
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Soil Analysis Box */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-4 relative overflow-hidden">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Soil Analysis</h3>
                        <div className="relative">
                            <button
                                onClick={() => prevSlide("soil")}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-full shadow-lg z-10"
                            >
                                ◀
                            </button>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={soilSlide}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full text-center"
                                >
                                    <img
                                        src={soilUploads[soilSlide].image}
                                        alt="soil"
                                        className="rounded-xl w-full h-40 object-cover"
                                    />
                                    <p className="text-gray-600 text-sm mt-2">{soilUploads[soilSlide].analysis}</p>
                                </motion.div>
                            </AnimatePresence>
                            <button
                                onClick={() => nextSlide("soil")}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-full shadow-lg z-10"
                            >
                                ▶
                            </button>
                        </div>
                    </div>

                    {/* Plant Analysis Box */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-4 relative overflow-hidden">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Plant Analysis</h3>
                        <div className="relative">
                            <button
                                onClick={() => prevSlide("plant")}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-full shadow-lg z-10"
                            >
                                ◀
                            </button>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={plantSlide}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full text-center"
                                >
                                    <img
                                        src={plantUploads[plantSlide].image}
                                        alt="plant"
                                        className="rounded-xl w-full h-40 object-cover"
                                    />
                                    <p className="text-gray-600 text-sm mt-2">{plantUploads[plantSlide].analysis}</p>
                                </motion.div>
                            </AnimatePresence>
                            <button
                                onClick={() => nextSlide("plant")}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-full shadow-lg z-10"
                            >
                                ▶
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carbon & Analytics */}
                {/* <motion.div  className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-12"> */}
                <CarbonDashboard />
                {/* </motion.div> */}
            </div>
        </div>
    );
};

export default Dashboard;
