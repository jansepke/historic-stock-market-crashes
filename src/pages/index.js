import { datasets, indices, inflations } from "../services/Config";
import page, {
  getStaticProps as pageGetStaticProps,
} from "./[index]/[inflation]/[dataset]/min-drawdown/[minDrawdown]";

export default page;

export const getStaticProps = async () => {
  return pageGetStaticProps({
    params: {
      index: indices[0].id,
      inflation: inflations[0].id,
      dataset: datasets[0].id,
      minDrawdown: 30,
    },
  });
};
