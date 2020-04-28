const csv = require("csvtojson");
const fs = require("fs").promises;
const { LTD } = require("downsample");

const dataDir = "index-data";

const calculateChartData = (data, sampleRate) => {
  const newData = data.map(({ price, date }) => ({ x: date, y: price }));
  const downsampledData =
    sampleRate < data.length ? LTD(newData, sampleRate) : newData;

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

const readFile = async (fileName) => {
  const rawData = await fs.readFile(fileName);
  return JSON.parse(rawData);
};

const inflationByDate = (inflationData, date) =>
  inflationData[date.getFullYear()][date.getMonth() + 1];

const processIndex = async (index, inflation, dataset) => {
  const msciData = await parseFile(`./data-sources/${index}.csv`);

  let indexData = msciData.map(({ date, price }) => ({
    date,
    price: price.toFixed(2),
  }));

  if (dataset === "end-of-month") {
    indexData = indexData.reduce((acc, item) => {
      if (acc.length === 0) {
        return [item];
      }

      const lastItem = acc.pop();
      if (lastItem.date.getMonth() === item.date.getMonth()) {
        if (lastItem.date.getDate() < item.date.getDate()) {
          return [...acc, item];
        } else {
          return [...acc, lastItem];
        }
      } else {
        return [...acc, lastItem, item];
      }
    }, []);
  }

  if (inflation !== "nominal") {
    const inflationData = await readFile(`./data-sources/inflation-us.json`);
    const firstIndexDate = indexData[0].date;
    const firstInflation = inflationByDate(
      inflationData,
      new Date(firstIndexDate)
    );

    indexData = indexData.map(({ date, price }) => {
      const inflation = inflationByDate(inflationData, new Date(date));
      const inflationPrice = (parseFloat(price) / inflation) * firstInflation;

      return {
        date,
        price: inflationPrice.toFixed(2),
      };
    });
  }

  await fs.writeFile(
    `./${dataDir}/${index}-${inflation}-${dataset}.json`,
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
    `./${dataDir}/chart-${index}-${inflation}-${dataset}.json`,
    JSON.stringify({ data: chartData }, null, 2)
  );
};

(async () => {
  await fs.mkdir(dataDir, { recursive: true });

  for (const index of ["msci-world", "msci-acwi", "msci-acwi-imi"]) {
    await processIndex(index, "nominal", "end-of-day");
    await processIndex(index, "nominal", "end-of-month");
    await processIndex(index, "real-us", "end-of-month");
  }
})();
