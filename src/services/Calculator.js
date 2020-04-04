import { LTD } from "downsample";
import { indices, minDrawdowns } from "./Config";

const msToDays = 1 / 60 / 60 / 24 / 1000;

const addPercentUp = (data, newTableData, years) => {
  for (const entry of data) {
    const lastCrash = newTableData.find(crash => !crash[`percentUp${years}`]);
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
        startDate: lastPeak.date.toString(),
        endDate: lastTrough.date.toString(),
        startPrice: lastPeak.price,
        endPrice: lastTrough.price,
        daysDown: daysDown,
        percent: percent,
        daysDone: daysDone,
        doneDate: newPeak.date?.toString() || null
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

  console.log("done with max drawdown calculation");

  return newTableData;
};

export const calculateChartData = (data, sampleRate) => {
  const newData = data.map(({ price, date }) => ({ x: date, y: price }));
  const numPointsInDownsampledData = sampleRate;
  const downsampledData = LTD(newData, numPointsInDownsampledData);

  console.log("done with data sampling");

  return [
    {
      id: "sampled",
      data: downsampledData
    }
  ];
};

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

export const calculateAllPaths = () =>
  cartesian(
    indices.map(i => i.id),
    minDrawdowns
  ).map(params => ({
    params: { index: params[0], minDrawdown: params[1].toString() }
  }));
