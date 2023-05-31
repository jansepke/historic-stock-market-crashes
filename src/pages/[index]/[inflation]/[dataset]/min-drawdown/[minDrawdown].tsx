import Head from "next/head";
import React from "react";
import App from "../../../../../App";
import { calculateAllPaths, calculateTableData } from "../../../../../services/calculator";
import { getIndexData } from "../../../../../services/data";
import { Crash } from "../../../../../services/domain";
import { GetStaticProps } from "next";

interface PageProps {
  index: string;
  inflation: string;
  dataset: string;
  minDrawdown: number;
  tableData: Crash[];
  indexDataCount: number;
  indexDataUpdateDate: Date;
}

export default function Page({
  index,
  inflation,
  dataset,
  minDrawdown,
  tableData,
  indexDataCount,
  indexDataUpdateDate,
}: PageProps) {
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
        dataset={dataset}
        inflation={inflation}
        minDrawdown={minDrawdown}
        tableData={parsedTableData}
        indexDataCount={indexDataCount}
        indexDataUpdateDate={parsedIndexDataUpdateDate}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const parsedMinDrawdown = parseInt(params!.minDrawdown as string);

  const index = params!.index as string;
  const inflation = params!.inflation as string;
  const dataset = params!.dataset as string;

  const indexData = await getIndexData(index, inflation, dataset);
  const tableData = calculateTableData(indexData, parsedMinDrawdown);
  const indexDataUpdateDate = indexData[indexData.length - 1].date.toString();

  return {
    props: {
      index,
      inflation,
      dataset,
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
