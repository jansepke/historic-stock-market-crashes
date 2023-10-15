const csv = require("csvtojson");
const axios = require("axios");
const fs = require("fs").promises;

const sourcePath = "https://download.bls.gov/pub/time.series/cu/cu.data.1.AllItems";
const seriesId = "CUUR0000SA0"; // Consumer Price Index - Not Seasonally Adjusted - Monthly - U.S. city average - All items
const outputPath = "./data-sources/inflation-us.json";

const parseString = async (data) =>
  csv({
    delimiter: "\t",
    colParser: {
      year: parseInt,
      value: parseFloat,
      period: (value) => parseInt(value.replace("M", "")),
    },
  }).fromString(data);

(async () => {
  console.log("updating us inflations");

  const response = await axios.get(sourcePath, {
    headers: {
      "User-Agent": "historic-stock-market-crashes.jansepke.de",
    },
  });

  const jsonData = await parseString(response.data);

  const relevantData = jsonData
    .filter(({ series_id, period }) => series_id === seriesId && period !== 13) // M13 = anual
    .reduce((acc, { year, period, value }) => {
      acc[year] = { ...acc[year], [period]: value };

      return acc;
    }, {});

  fs.writeFile(outputPath, JSON.stringify(relevantData, null, 2));
})();
