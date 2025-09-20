import React from 'react';

const Dashboard = () => {
    return (
<div>
      <h1>🌾 Farmer Dashboard</h1>

      {/* Section 1: Real-Time Weather + Microclimate Predictions */}
      <section>
        <h2>Real-Time Weather + Microclimate Predictions</h2>
        <p>Shows weather forecast for your farm location.</p>
        <p>
          AI predicts future trends → e.g. “Wheat price may rise 12% next month;
          store harvest if possible.”
        </p>
      </section>

      {/* Section 2: Market Price Forecasting */}
      <section>
        <h2>Market Price Forecasting</h2>
        <p>Shows local mandi (market) prices for farmer’s crop.</p>
        <p>AI predicts future price changes for better decision-making.</p>
      </section>

      {/* Section 3: Carbon Credit & Sustainability Score */}
      <section>
        <h2>Carbon Credit & Sustainability Score</h2>
        <p>
          Dashboard shows how much carbon footprint reduction farmer achieved
          (e.g., using less fertilizer/water).
        </p>
        <p>
          Helps farmers sell carbon credits to companies → extra income source.
        </p>
      </section>

      {/* Image Upload Section */}
      <section>
        <h2>Upload Farm Images</h2>
        <p>Upload soil or plant images for analysis</p>
        <input type="file" accept="image/*" />
        <input type="file" accept="image/*" />
        <input type="file" accept="image/*" />
      </section>

      {/* Graph / Analytics Section */}
      <section>
        <h2>Analytics & Reports</h2>
        <p>[Graph Placeholder - Carbon Score Trend]</p>
        <p>[Graph Placeholder - Crop Health Analysis]</p>
      </section>
    </div>
    );
}

export default Dashboard;
