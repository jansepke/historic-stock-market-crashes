import { datasets, indiceGroups, inflations, minDrawdowns } from "./config";
import { IndexData, TableData } from "./domain";

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

const nullIndexData = { date: new Date(0), price: 0 };
export const calculateTableData = (data: IndexData[], minDrawdown) => {
  const newTableData: TableData[] = [];
  let lastPeak: IndexData = nullIndexData,
    lastTrough: IndexData = nullIndexData;

  const checkDrawdown = (newPeak = nullIndexData) => {
    const percent = (1 - lastTrough.price / lastPeak.price) * 100;
    if (percent > minDrawdown) {
      const daysDown = (+lastTrough.date - +lastPeak.date) * msToDays;
      const daysDone = (+newPeak.date - +lastPeak.date) * msToDays;

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

  return newTableData.map((item) => ({
    ...item,
    startDate: item.startDate.toString(),
    endDate: item.endDate.toString(),
    doneDate: item.doneDate?.toString() || null,
  }));
};

const cartesianProduct = <T>(...sets: T[][]) =>
  sets.reduce<T[][]>(
    (accSets, set) =>
      accSets.flatMap((accSet) => set.map((value) => [...accSet, value])),
    [[]]
  );

const getIndices = () => {
  let indicesList = [];

  indiceGroups.forEach((group) => {
    indicesList = indicesList.concat(group.indices);
  });

  return indicesList;
};

export const calculateAllPaths = () =>
  cartesianProduct(
    getIndices().map((i) => i.id),
    inflations.map((i) => i.id),
    datasets.map((i) => i.id),
    minDrawdowns
  )
    .filter(
      (params) => !(params[2] === "end-of-day" && params[1] !== "nominal")
    )
    .map((params) => ({
      params: {
        index: params[0],
        inflation: params[1],
        dataset: params[2],
        minDrawdown: params[3].toString(),
      },
    }));
