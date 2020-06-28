const csv = require("csvtojson");
const xml = require("fast-xml-parser");
const axios = require("axios");
const fs = require("fs").promises;

process.env.TZ = "UTC";

// initials data from http://www.msci.com/eqb/esg/performance/106.0.all.xls

const dateTimeFormatParam = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const dateTimeFormatCSV = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "2-digit",
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
    name: "2993,V,36",
  },
  "msci-world-growth": {
    name: "2992,G,36",
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

const convertDate = (date) => {
  const [
    { value: mo },
    ,
    { value: da },
    ,
    { value: ye },
  ] = dateTimeFormatCSV.formatToParts(date);
  return `${ye}-${mo}-${da}`;
};

const convertPrice = (value) => {
  if (typeof value === "string") {
    return parseFloat(value.replace(",", "")).toFixed(2);
  } else if (typeof value === "number") {
    return value.toFixed(2);
  }
  return undefined;
};

const toDateParam = (date) => {
  const [
    { value: mo },
    ,
    { value: da },
    ,
    { value: ye },
  ] = dateTimeFormatParam.formatToParts(date);
  return `${da} ${mo}, ${ye}`;
};

const parseFile = async (fileName) =>
  csv({
    colParser: {
      price: (item) => parseFloat(item.replace(",", "")),
      date: (item) => new Date(item),
    },
  }).fromFile(fileName);

const processIndex = async (index, date) => {
  const msciData = await parseFile(`./data-sources/${index}.csv`);
  const lastEntry = msciData[msciData.length - 1];
  let startDate = lastEntry.date;

  if (typeof date !== "undefined") {
    startDate = date;
  }

  let oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  let incomplete = false;

  let endDate = new Date();
  if (startDate < oneYearAgo) {
    endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 2);
    incomplete = true;
  }
  console.log(`startDate: ${startDate} endDate: ${endDate}`);

  const response = await axios.get(
    "https://app2.msci.com/webapp/indexperf/charts",
    {
      params: {
        indices: getName(index),
        startDate: toDateParam(startDate),
        endDate: toDateParam(endDate),
        priceLevel: 0,
        currency: 15,
        frequency: "D",
        scope: "R",
        format: "XML",
        baseValue: false,
        site: "gimi",
      },
    }
  );

  if (xml.validate(response.data) !== true) {
    console.log("Could not parse response");
    return;
  }

  const json = xml.parse(response.data).performance.index.asOf;
  let data = [];

  if (Array.isArray(json) === false) {
    data.push(json);
  } else {
    data = json;
  }

  let filteredData = data.filter(
    (value) => new Date(data[0].date).toISOString() !== startDate.toISOString()
  );

  if (filteredData.length === 0) {
    console.log("nothing to update");
    return;
  }

  const newCSV = filteredData
    .map(({ date, value }) => ({
      date: convertDate(new Date(date)),
      value: convertPrice(value),
    }))
    .map((data) => `${data.date},${data.value}`)
    .join("\n");

  await fs.appendFile(`./data-sources/${index}.csv`, "\n" + newCSV);

  console.log(`added ${data.length} entries`);

  if (incomplete) {
    await processIndex(index, endDate);
  }
};

(async () => {
  for (const index of Object.keys(indices)) {
    console.log(`updating ${index}`);

    await processIndex(index);
  }
})();
