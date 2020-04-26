import { promises as fs } from "fs";
import path from "path";

export const getIndexData = async (index, inflation, dataset) => {
  const indexFile = path.join(
    process.cwd(),
    "index-data",
    `${index}-${inflation}-${dataset}.json`
  );
  const rawData = await fs.readFile(indexFile);
  const data = JSON.parse(rawData);

  console.log(`Index contains ${data.data.length} days of data`);

  return data.data.map(({ date, price }) => ({
    date: new Date(date),
    price: parseFloat(price),
  }));
};
