const csv = require("csvtojson");
const xml = require("fast-xml-parser");
const axios = require("axios");
const fs = require("fs").promises;

process.env.TZ = "UTC";

const dateTimeFormatCSV = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const indices = {
  spx: {
    ticker: "^GSPC",
  },
  dji: {
    ticker: "^DJI",
  },
  ndx: {
    ticker: "^NDX",
  },
  vix: {
    ticker: "^VIX",
  },
  rut: {
    ticker: "^RUT",
  },
  tnx: {
    ticker: "^TNX",
  },
  n225: {
    ticker: "^N225",
  },
  zb: {
    ticker: "ZB=F",
  },
};

const getTicker = (index) => {
  return indices[index]?.ticker;
};

const parseFile = async (fileName) =>
  csv({
    colParser: {
      price: (item) => parseFloat(item.replace(",", "")),
      date: (item) => new Date(item),
    },
  }).fromFile(fileName);

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

const processIndex = async (index) => {
  const existingData = await parseFile(`./data-sources/${index}.csv`);
  const lastEntry = existingData[existingData.length - 1];
  const ticker = getTicker(index);
  let startDate = lastEntry.date;

  let endDate = new Date();

  console.log(`startDate: ${startDate} endDate: ${endDate}`);

  // https://query1.finance.yahoo.com/v7/finance/download/^GSPC?period1=1561759178&period2=1593381578&interval=1d&events=history
  const response = await axios
    .get(
      `https://query1.finance.yahoo.com/v7/finance/download/${encodeURIComponent(
        ticker
      )}`,
      {
        params: {
          period1: parseInt((startDate.getTime() / 1000).toFixed(0)),
          period2: parseInt((endDate.getTime() / 1000).toFixed(0)),
          interval: "1d",
          events: "history",
        },
      }
    )
    .catch((error) => {
      console.log(error);
    });

  const data = await csv({
    noheader: false,
    includeColumns: /^(Date|Close)$/,
    colParser: {
      Date: (item) => new Date(item),
      Close: (item) => parseFloat(item),
    },
  }).fromString(response.data);

  let filteredData = data.filter(
    (value) => value.Date.toISOString() !== startDate.toISOString()
  );
  filteredData = filteredData.filter((value) => !isNaN(value.Close));

  if (filteredData.length === 0) {
    console.log("nothing to update");
    return;
  }

  const newCSV = filteredData
    .map(({ Date, Close }) => ({
      Date: convertDate(Date),
      Close: convertPrice(Close),
    }))
    .map((data) => `${data.Date},${data.Close}`)
    .join("\n");

  await fs.appendFile(`./data-sources/${index}.csv`, "\n" + newCSV);

  console.log(`added ${data.length} entries`);
};

(async () => {
  for (const index of Object.keys(indices)) {
    console.log(`updating ${index}`);

    await processIndex(index);
  }
})();
