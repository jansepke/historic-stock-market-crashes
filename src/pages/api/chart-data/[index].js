import { calculateChartData } from "../../../services/Calculator";
import { getIndexData } from "../../../services/Data";

export default async ({ query: { index } }, res) => {
  const indexData = await getIndexData(index);
  const chartData = calculateChartData(indexData, 5000);

  res.status(200).json(chartData);
};
