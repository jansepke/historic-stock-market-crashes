import { datasets, indiceGroups, inflations } from "../services/config";
import page, { getStaticProps as pageGetStaticProps } from "./[index]/[inflation]/[dataset]/min-drawdown/[minDrawdown]";

export default page;

export const getStaticProps = async () =>
  pageGetStaticProps({
    params: {
      index: indiceGroups[0].indices[0].id,
      inflation: inflations[0].id,
      dataset: datasets[0].id,
      minDrawdown: "30",
    },
  });
