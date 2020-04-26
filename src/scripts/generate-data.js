const csv = require("csvtojson");
const fs = require("fs").promises;
const { LTD } = require("downsample");

const dataDir = "index-data";

const calculateChartData = (data, sampleRate) => {
  const newData = data.map(({ price, date }) => ({ x: date, y: price }));
  const numPointsInDownsampledData = sampleRate;
  const downsampledData = LTD(newData, numPointsInDownsampledData);

  return [
    {
      id: "sampled",
      data: downsampledData,
    },
  ];
};

const parseFile = async (fileName) =>
  csv({
    colParser: {
      price: (item) => parseFloat(item),
      date: (item) => new Date(item),
    },
  }).fromFile(fileName);

const processIndex = async (index) => {
  const msciData = await parseFile(`./data-sources/${index}.csv`);

  const indexData = msciData.map(({ date, price }) => ({
    date,
    price: price.toFixed(2),
  }));

  await fs.writeFile(
    `./${dataDir}/${index}.json`,
    JSON.stringify({ data: indexData }, null, 2)
  );

  const chartData = calculateChartData(
    indexData.map(({ date, price }) => ({
      date: new Date(date),
      price: parseFloat(price),
    })),
    5000
  );

  await fs.writeFile(
    `./${dataDir}/chart-${index}.json`,
    JSON.stringify({ data: chartData }, null, 2)
  );
};

(async () => {
  await fs.mkdir(dataDir, { recursive: true });

  for (const index of ["msci-world", "msci-acwi", "msci-acwi-imi"]) {
    await processIndex(index);
  }
})();
