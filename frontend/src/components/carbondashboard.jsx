
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const  CarbonDashboard = () =>{
    const [chartData, setChartData] = useState([]);
    const [recommendation, setRecommendation] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);
    const [form, setForm] = useState({
        farmer: "Ramesh",
        month: "Sep",
        fertilizerReduced: 0,
        dieselSaved: 0,
        waterSaved: 0,
        treesPlanted: 0
    });

    const fetchData = async () => {
        const res = await axios.get("http://localhost:5000/farmer/Ramesh");
        setChartData(res.data.data);
        setRecommendation(res.data.recommendation);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:5000/farmer/carbon", form);
        fetchData();
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-12"
        >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                🌱 Carbon Credit & Sustainability
            </h2>

            {/* Farmer Input Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6"
            >
                {Object.keys(form).map((key) =>
                    key !== "farmer" && key !== "month" ? (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 capitalize">{key}</label>
                            <input
                                type="number"
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                                className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    ) : null
                )}
                <button
                    type="submit"
                    className="col-span-2 md:col-span-1 bg-green-600 text-white rounded-lg px-3 py-2 hover:bg-green-700"
                >
                    Add Data
                </button>
            </form>

            <p className="text-gray-600 mb-4">Your CO₂ reduction trend:</p>

            {/* CO2 Line Chart */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="co2Saved" stroke="#22c55e" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>

            {/* CO2 Breakdown */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {chartData[chartData.length - 1]?.actions &&
                    Object.entries(chartData[chartData.length - 1].actions).map(([action, value]) => (
                        <div
                            key={action}
                            className="bg-green-50 text-green-800 rounded-xl p-4 text-center font-semibold"
                        >
                            {action === "fertilizer" && "Reduced Fertilizer"}
                            {action === "solarPump" && "Used Solar Pump"}
                            {action === "coverCrop" && "Planted Cover Crops"}
                            <div className="text-xl mt-2">{value} kg CO₂</div>
                        </div>
                    ))}
            </div>

            {/* Recommendation */}
            <div className="mt-6 bg-green-100 text-green-900 rounded-xl p-4 font-medium">
                💡 Recommendation: {recommendation}
            </div>

            {/* Equivalent Trees */}
            <div className="mt-4 text-gray-700 font-semibold">
                🌳 Equivalent Trees Planted:{" "}
                {Math.round(chartData.reduce((sum, item) => sum + item.co2Saved, 0) / 20)}
            </div>

            {/* <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">🏆 Farmer Leaderboard</h3>
        <ul className="bg-gray-50 rounded-xl p-4">
          {leaderboard.map((f, i) => (
            <li key={i} className="flex justify-between py-1">
              <span>{i + 1}. {f.farmer}</span>
              <span className="font-semibold">{f.totalCO2} kg CO₂</span>
            </li>
          ))}
        </ul>
      </div> */}
        </motion.div>
    );
}


export default CarbonDashboard;