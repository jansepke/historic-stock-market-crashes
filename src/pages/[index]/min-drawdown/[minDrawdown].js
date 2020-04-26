import Head from "next/head";
import React from "react";
import App from "../../../App";
import {
  calculateAllPaths,
  calculateTableData,
} from "../../../services/Calculator";
import { getIndexData } from "../../../services/Data";

export default ({
  index,
  minDrawdown,
  tableData,
  indexDataCount,
  indexDataUpdateDate,
}) => {
  const parsedTableData = tableData.map((item) => ({
    ...item,
    startDate: new Date(item.startDate),
    endDate: new Date(item.endDate),
    doneDate: item.doneDate ? new Date(item.doneDate) : null,
  }));
  const parsedIndexDataUpdateDate = new Date(indexDataUpdateDate);

  return (
    <>
      <Head>
        <title>Historic Stock Market Crashes</title>
        <meta
          name="description"
          content="Analyze historic stock market crashes for different popular indices (MSCI World, ACWI). Filter crashes with adjustable maximum drawdown. Supports buy and hold strategy with ETFs."
        />
      </Head>
      <App
        index={index}
        minDrawdown={minDrawdown}
        tableData={parsedTableData}
        indexDataCount={indexDataCount}
        indexDataUpdateDate={parsedIndexDataUpdateDate}
      />
    </>
  );
};

export const getStaticProps = async ({
  params: { index: indexAndInflation, minDrawdown },
}) => {
  const [index, inflation] = indexAndInflation.split("_");
  const parsedMinDrawdown = parseInt(minDrawdown);

  const indexData = await getIndexData(index);
  const tableData = calculateTableData(indexData, parsedMinDrawdown);
  const indexDataUpdateDate = indexData[indexData.length - 1].date.toString();

  return {
    props: {
      index,
      minDrawdown: parsedMinDrawdown,
      tableData,
      indexDataCount: indexData.length,
      indexDataUpdateDate,
    },
  };
};

export const getStaticPaths = async () => ({
  paths: calculateAllPaths(),
  fallback: false,
});
