import Head from "next/head";
import React from "react";
import App from "../../../App";
import { calculateTableData } from "../../../services/Calculator";
import { getIndexData } from "../../../services/Data";

export default ({
  index,
  minDrawdown,
  tableData,
  indexDataCount,
  indexDataUpdateDate
}) => {
  const parsedTableData = tableData.map(item => ({
    ...item,
    startDate: new Date(item.startDate),
    endDate: new Date(item.endDate),
    doneDate: item.doneDate ? new Date(item.doneDate) : null
  }));
  const parsedIndexDataUpdateDate = new Date(indexDataUpdateDate);

  return (
    <>
      <Head>
        <title>Historic Stock Market Crashes</title>
        <meta
          name="description"
          content="Analyze historic stock market crashes for different popular indices (MSCI World, ACWI). Filter crashes with adjustable maximum drawdown. Support buy and hold strategy."
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

export const getStaticProps = async ({ params: { index, minDrawdown } }) => {
  const parsedMinDrawdown = parseInt(minDrawdown);
  const indexData = await getIndexData(index);
  const tableData = calculateTableData(indexData, parsedMinDrawdown).map(
    item => ({
      ...item,
      startDate: item.startDate.toString(),
      endDate: item.endDate.toString(),
      doneDate: item.doneDate?.toString() || null
    })
  );

  return {
    props: {
      index,
      minDrawdown: parsedMinDrawdown,
      tableData,
      indexDataCount: indexData.length,
      indexDataUpdateDate: indexData[indexData.length - 1].date.toString()
    }
  };
};

const indeces = ["msci-world", "msci-acwi", "msci-acwi-imi"];
const minDrawdowns = [...Array(9).keys()].map(i => 10 + i * 5);
const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

export const getStaticPaths = async () => {
  return {
    paths: cartesian(indeces, minDrawdowns).map(params => ({
      params: { index: params[0], minDrawdown: params[1].toString() }
    })),
    fallback: false
  };
};
