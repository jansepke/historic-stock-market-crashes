import Head from "next/head";
import React from "react";
import App from "../src/App";

export default ({ index }) => (
  <>
    <Head>
      <title>Historic Stock Market Crashes</title>
      <meta
        name="description"
        content="Analyze historic stock market crashes for different popular indices (MSCI World, ACWI). Filter crashes with adjustable maximum drawdown. Support buy and hold strategy."
      />
    </Head>
    <App index={index} />
  </>
);

export const getServerSideProps = async ({
  query: { index = "msci-world" }
}) => {
  return {
    props: { index }
  };
};
