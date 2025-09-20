const express = require("express");
const router = express.Router();
const xml2js = require("xml2js"); 
const axios = require("axios");

const STATE_CODES = { "Uttar Pradesh": 9 }; // add more
const DISTRICT_CODES = { "Gautam Buddha Nagar": 31 }; // add more

const DEFAULT_PRICES = [
  { crop: "Wheat", price: "₹2475/qtl", change: "+0.5%" },
  { crop: "Rice", price: "₹2880/qtl", change: "-0.3%" },
  { crop: "Maize", price: "₹2594/qtl", change: "+1.2%" },
  { crop: "Onion", price: "₹1420/qtl", change: "-2%" },
  { crop: "Potato", price: "₹1040/qtl", change: "+0.8%" }
];

const COMMODITY_CODES = {
  Wheat: 12,
  Rice: 1,
  Maize: 4,
  Onion: 22,
  Potato: 23,
};

const fetchCommodityData = async (stateCode, districtCode, commodityName, commodityCode) => {
  try {
    const url = `https://agmarknet.gov.in/AgriMarkNet/PriceTrendAction.do?CommCode=${commodityCode}&State_Code=${stateCode}&District_Code=${districtCode}&Market_Code=&DateFrom=&DateTo=&hylk=0`;
    const response = await axios.get(url);
    const rawXml = response.data;
    const xmlData = rawXml.replace(/&(?!(?:apos|quot|[gl]t|amp);)/g, "&amp;");
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);

    let mandiPrices = [];
    if (result?.DataSet?.Table) {
      const table = Array.isArray(result.DataSet.Table)
        ? result.DataSet.Table
        : [result.DataSet.Table];

      mandiPrices = table.map((item) => ({
        commodity: commodityName,
        market: item.MARKET || item.MarketName,
        variety: item.VARIETY || item.Variety,
        minPrice: item.MIN || item.MinPrice,
        maxPrice: item.MAX || item.MaxPrice,
        modalPrice: item.MODAL || item.ModalPrice,
        date: item.DATE || item.Date,
      }));
    }

    return mandiPrices.length ? mandiPrices : null; // return null if empty
  } catch (err) {
    console.error(`Error fetching ${commodityName}:`, err.message);
    return null;
  }
};

router.get('/data', async (req, res) => {
  try {
    const { state, district } = req.query;
    const stateCode = STATE_CODES[state];
    const districtCode = DISTRICT_CODES[district];

    if (!stateCode || !districtCode)
      return res.status(400).json({ error: "Invalid state/district" });

    const allData = [];

    for (const [name, code] of Object.entries(COMMODITY_CODES)) {
      const fetchedData = await fetchCommodityData(stateCode, districtCode, name, code);
      if (!fetchedData) {
        // If empty, use default
        const defaultEntry = DEFAULT_PRICES.find((c) => c.crop === name);
        allData.push(defaultEntry);
      } else {
        // Calculate average modal price for fetched data
        const prices = fetchedData.map((item) => parseInt(item.modalPrice));
        const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        allData.push({
          crop: name,
          price: `₹${avgPrice}/qtl`,
          change: "+0%" // you can modify logic to calculate change if needed
        });
      }
    }

    res.json(allData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch mandi prices" });
  }
});

module.exports = router;
