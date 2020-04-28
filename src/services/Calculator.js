import { datasets, indices, inflations, minDrawdowns } from "./Config";

const msToDays = 1 / 60 / 60 / 24 / 1000;

const addPercentUp = (data, newTableData, years) => {
  for (const entry of data) {
    const lastCrash = newTableData.find((crash) => !crash[`percentUp${years}`]);
    if (
      lastCrash &&
      (entry.date - lastCrash.endDate) * msToDays >= 365 * years
    ) {
      lastCrash[`percentUp${years}`] =
        (1 / lastCrash.endPrice) * entry.price * 100 - 100;
    }
  }
};

export const calculateTableData = (data, minDrawdown) => {
  const newTableData = [];
  let lastPeak = { price: 0 },
    lastTrough = { price: 0 };

  const checkDrawdown = (newPeak = {}) => {
    const percent = (1 - lastTrough.price / lastPeak.price) * 100;
    if (percent > minDrawdown) {
      const daysDown = (lastTrough.date - lastPeak.date) * msToDays;
      const daysDone = (newPeak.date - lastPeak.date) * msToDays;

      newTableData.push({
        startDate: lastPeak.date,
        endDate: lastTrough.date,
        startPrice: lastPeak.price,
        endPrice: lastTrough.price,
        daysDown: daysDown,
        percent: percent,
        daysDone: daysDone,
        doneDate: newPeak.date,
      });
    }
  };

  for (const entry of data) {
    if (entry.price > lastPeak.price) {
      checkDrawdown(entry);
      lastPeak = entry;
      lastTrough = entry;
    } else if (entry.price < lastTrough.price) {
      lastTrough = entry;
    }
  }

  checkDrawdown();

  addPercentUp(data, newTableData, 2);
  addPercentUp(data, newTableData, 5);

  newTableData.forEach((item) => {
    item.startDate = item.startDate.toString();
    item.endDate = item.endDate.toString();
    item.doneDate = item.doneDate?.toString() || null;
  });

  return newTableData;
};

const f = (a, b) => [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

export const calculateAllPaths = () =>
  cartesian(
    indices.map((i) => i.id),
    inflations.map((i) => i.id),
    datasets.map((i) => i.id),
    minDrawdowns
  )
    .filter((params) => params[1] === "end-of-day" && params[2] !== "nominal")
    .map((params) => ({
      params: {
        index: params[0],
        inflation: params[1],
        dataset: params[2],
        minDrawdown: params[3].toString(),
      },
    }));
