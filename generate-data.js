const csv = require("csvtojson");
const fs = require("fs").promises;

// World http://www.msci.com/eqb/esg/performance/106.0.all.xls
// ACWI http://www.msci.com/eqb/esg/performance/2591.0.all.xls
// ACWI IMI http://www.msci.com/eqb/esg/performance/73562.0.all.xls

const dataDir = "index-data";

const parseFile = async fileName =>
  csv({
    colParser: {
      Price: item => parseFloat(item.replace(",", "")),
      Date: item => new Date(item)
    }
  }).fromFile(fileName);

const processIndex = async index => {
  const msciData = await parseFile(`./data-sources/msci/${index}.csv`);
  const investingData = (
    await parseFile(`./data-sources/investing/${index}.csv`)
  ).reverse();

  const result = msciData
    .concat(investingData)
    .map(({ Date: date, Price: price }) => ({ date, price: price.toFixed(2) }));

  await fs.writeFile(
    `./${dataDir}/${index}.json`,
    JSON.stringify({ data: result }, null, 2)
  );
};

(async () => {
  await fs.mkdir(dataDir, { recursive: true });

  for (const index of ["msci-world", "msci-acwi", "msci-acwi-imi"]) {
    await processIndex(index);
  }
})();
