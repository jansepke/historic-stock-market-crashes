import { promises as fs } from "fs";
import path from "path";
import { IndexData } from "./domain";

export const getIndexData = async (
  index,
  inflation,
  dataset
): Promise<IndexData[]> => {
  const indexFile = path.join(
    process.cwd(),
    "index-data",
    `${index}-${inflation}-${dataset}.json`
  );
  const rawData = await fs.readFile(indexFile, "utf-8");
  const data = JSON.parse(rawData);

  return data.data.map(({ date, price }) => ({
    date: new Date(date),
    price: parseFloat(price),
  }));
};
