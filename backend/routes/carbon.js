const express = require("express");
const router = express.Router();

const FACTORS = {
  fertilizer: 6.3, // kg CO₂ per kg fertilizer reduced
  diesel: 2.6,     // kg CO₂ per litre diesel saved
  water: 0.0003,   // kg CO₂ per litre water saved
  tree: 21         // kg CO₂ per tree planted
};

const farmerData = [
  {
    month: "May",
    co2Saved: 93,
    actions: { fertilizer: 50, solarPump: 14, water: 1, coverCrop: 40 }
  },
  {
    month: "Jun",
    co2Saved: 145,
    actions: { fertilizer: 75, solarPump: 22, water: 1, coverCrop: 60 }
  },
  {
    month: "Jul",
    co2Saved: 74,
    actions: { fertilizer: 40, solarPump: 16, water: 0, coverCrop: 20 }
  },
  {
    month: "Aug",
    co2Saved: 201,
    actions: { fertilizer: 100, solarPump: 32, water: 1, coverCrop: 80 }
  }
]

router.post("/carbon", (req, res) => {
  const { farmer, month, fertilizerReduced, dieselSaved, waterSaved, treesPlanted } = req.body;

  const co2Saved =
    fertilizerReduced * FACTORS.fertilizer +
    dieselSaved * FACTORS.diesel +
    waterSaved * FACTORS.water +
    treesPlanted * FACTORS.tree;

  const entry = {
    month,
    co2Saved: Math.round(co2Saved),
    actions: {
      fertilizer: Math.round(fertilizerReduced * FACTORS.fertilizer),
      solarPump: Math.round(dieselSaved * FACTORS.diesel),
      coverCrop: Math.round(treesPlanted * FACTORS.tree)
    }
  };

//   if (!farmerData[farmer]) farmerData[farmer] = [];
  farmerData.push(entry);

  res.json({ success: true, entry });
});

router.get("/:farmer", (req, res) => {
  const farmer = req.params.farmer;
  const data = farmerData || [];

  let recommendation = "Keep up the great work!";
  if (data.length > 0) {
    const last = data[data.length - 1];
    if (last.actions.fertilizer < 50) {
      recommendation = "💡 Use organic compost to reduce fertilizer emissions";
    } else if (last.actions.solarPump < 40) {
      recommendation = "💡 Switch more irrigation to solar pumps";
    }
  }

  res.json({ data, recommendation });
});

module.exports = router;