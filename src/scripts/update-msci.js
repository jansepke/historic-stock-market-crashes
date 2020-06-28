const csv = require("csvtojson");
const axios = require("axios");
const fs = require("fs").promises;

// initials data from http://www.msci.com/eqb/esg/performance/106.0.all.xls

const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const indices = {
  "msci-world": {
    name: "106,C,16",
  },
  "msci-world-momentum": {
    name: "103214,1,36",
  },
  "msci-world-quality": {
    name: "100106,U,36",
  },
  "msci-world-value": {
    name: "96561,L,36",
  },
  "msci-world-esg-screened": {
    name: "132866,SR,36",
  },
  "msci-acwi": {
    name: "2591,C,36",
  },
  "msci-acwi-imi": {
    name: "73562,C,41",
  },
};

const getName = (index) => {
  return indices[index]?.name;
};

const regexOverThousand = /(\d\d\/\d\d\/\d\d\d\d,".*?"),/g;
const regexUnderThousand = /(\d\d\/\d\d\/\d\d\d\d,.*?),/g;

const getRegex = (line) => {
  if (regexOverThousand.test(line)) {
    return regexOverThousand;
  } else if (regexUnderThousand.test(line)) {
    return regexUnderThousand;
  } else {
    return undefined;
  }
};

const createCSV = (data) => {
  return data
    .replace(/".*?",/, "") // remove first item
    .replace(getRegex(data), "$1\n"); // add line breaks
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
  const startDate = lastEntry.date;
  let endDate = new Date();

  let oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  let incomplete = false;

  if (startDate < oneYearAgo) {
    endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    incomplete = true;
  }
  console.log(`startDate: ${startDate} endDate: ${endDate}`);

  const response = await axios
    .get("https://app2.msci.com/webapp/indexperf/charts", {
      params: {
        indices: getName(index),
        startDate: toDateParam(startDate),
        endDate: toDateParam(endDate),
        priceLevel: 0,
        currency: 15,
        frequency: "D",
        scope: "R",
        format: "CSV",
        baseValue: false,
        site: "gimi",
      },
    })
    .catch((error) => {
      console.log(error);
    });

  const rawCSV = createCSV(response.data);

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
    .map((data) => `${data.date},${data.price}`)
    .join("\n");

  await fs.appendFile(`./data-sources/${index}.csv`, "\n" + newCSV);

  console.log(`added ${json.length} entries`);

  if (incomplete) {
    await processIndex(index);
  }
};

(async () => {
  for (const index of Object.keys(indices)) {
    console.log(`updating ${index}`);

    await processIndex(index);
  }
})();
