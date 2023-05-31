import { promises as fs } from "fs";
import path from "path";
import { IndexData, IndexRawData } from "./domain";

export const getIndexData = async (index: string, inflation: string, dataset: string): Promise<IndexData[]> => {
  const indexFile = path.join(process.cwd(), "index-data", `${index}-${inflation}-${dataset}.json`);
  const rawData = await fs.readFile(indexFile, "utf-8");
  const data = JSON.parse(rawData);

  const rawIndexData = data.data as IndexRawData[];
  return rawIndexData.map(({ date, price }) => ({
    date: new Date(date),
    price: parseFloat(price),
  }));
};
