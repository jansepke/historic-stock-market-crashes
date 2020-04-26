import { dataResolutions, indices, inflations } from "../services/Config";
import page, {
  getStaticProps as pageGetStaticProps,
} from "./[index]/min-drawdown/[minDrawdown]";

export default page;

export const getStaticProps = async () => {
  return pageGetStaticProps({
    params: {
      index: `${indices[0].id}_${inflations[0].id}_${dataResolutions[0].id}`,
      minDrawdown: 30,
    },
  });
};
