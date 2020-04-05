const csv = require("csvtojson");
const axios = require("axios");
const fs = require("fs").promises;

const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const getName = (index) => {
  if (index === "msci-world") {
    return "106,C,16";
  }
  if (index === "msci-acwi") {
    return "2591,C,36";
  }
  if (index === "msci-acwi-imi") {
    return "73562,C,41";
  }
};

const convertDate = (date) =>
  `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;

const toDateParam = (date) => {
  const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(
    date
  );
  return `${da} ${mo}, ${ye}`;
};

const parseFile = async (fileName) =>
  csv({
    colParser: {
      price: (item) => parseFloat(item.replace(",", "")),
      date: (item) => new Date(item),
    },
  }).fromFile(fileName);

const processIndex = async (index) => {
  const msciData = await parseFile(`./data-sources/${index}.csv`);
  const lastEntry = msciData[msciData.length - 1];

  const response = await axios.get(
    "https://app2.msci.com/webapp/indexperf/charts",
    {
      params: {
        indices: getName(index),
        startDate: toDateParam(lastEntry.date),
        endDate: toDateParam(new Date()),
        priceLevel: 0,
        currency: 15,
        frequency: "D",
        scope: "R",
        format: "CSV",
        baseValue: false,
        site: "gimi",
      },
    }
  );

  const rawCSV = response.data
    .replace(/".*?",/, "") // remove first item
    .replace(/(\d\d\/\d\d\/\d\d\d\d,".*?"),/g, "$1\n"); // add line breaks

  const json = await csv({
    headers: ["date", "price"],
    noheader: true,
    colParser: {
      date: (item) => new Date(item),
      price: (item) => parseFloat(item.replace(",", "")),
    },
  }).fromString(rawCSV);

  json.shift();

  if (json.length === 0) {
    console.log("nothing to update");
    return;
  }

  const newCSV = json
    .map(({ date, price }) => ({
      date: convertDate(date),
      price: price.toFixed(2),
    }))
    .map((data) => `"${data.date}","${data.price}"`)
    .join("\n");

  await fs.appendFile(`./data-sources/${index}.csv`, "\n" + newCSV);

  console.log(`added ${json.length} entries`);
};

(async () => {
  for (const index of ["msci-world", "msci-acwi", "msci-acwi-imi"]) {
    console.log(`updating ${index}`);

    await processIndex(index);
  }
})();
