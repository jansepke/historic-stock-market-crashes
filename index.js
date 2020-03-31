const csv = require("csvtojson");
const { table, getBorderCharacters } = require("table");

// World http://www.msci.com/eqb/esg/performance/106.0.all.xls
// ACWI http://www.msci.com/eqb/esg/performance/2591.0.all.xls
// ACWI IMI http://www.msci.com/eqb/esg/performance/73562.0.all.xls

const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

const minPercent = process.argv[2];
const index = process.argv[3];

const msToDays = 1 / 60 / 60 / 24 / 1000;

const parseFile = async fileName =>
  csv({
    colParser: {
      Price: item => parseFloat(item.replace(",", "")),
      Date: item => new Date(item)
    }
  }).fromFile(fileName);

(async () => {
  const data1 = await parseFile(`msci/${index}.csv`);
  const data2 = (await parseFile(`investing/${index}.csv`)).reverse();

  let lastPeak = { Price: 0 },
    lastTrough = { Price: 0 },
    tableData = [];

  const checkDrawdown = (newPeak = {}) => {
    const percent = (1 - lastTrough.Price / lastPeak.Price) * 100;
    if (percent > minPercent) {
      const daysDown = (lastTrough.Date - lastPeak.Date) * msToDays;
      const daysDone = (newPeak.Date - lastPeak.Date) * msToDays;

      tableData.push([
        dtf.format(lastPeak.Date),
        dtf.format(lastTrough.Date),
        daysDown.toFixed(),
        -percent.toFixed(),
        daysDone.toFixed()
      ]);
    }
  };

  for (const entry of data1.concat(data2)) {
    if (entry.Price > lastPeak.Price) {
      checkDrawdown(entry);
      lastPeak = entry;
      lastTrough = entry;
    } else if (entry.Price < lastTrough.Price) {
      lastTrough = entry;
    }
  }

  checkDrawdown();

  const header = ["StartDate", "EndDate", "DaysDown", "Percent", "DaysDone"];

  const output = table([header, ...tableData], {});

  console.log(output);
})();
