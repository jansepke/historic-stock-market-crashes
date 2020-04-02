import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import React, { useState } from "react";
import { calculateTableData } from "./calculator";
import Chart from "./chart";
import Form from "./form";
import Table from "./table";

export default () => {
  const [state, setState] = useState({ tableData: [], chartData: [] });

  const onFormChange = async ({ index, minDrawdown }) => {
    let data = await loadIndexData(index);

    console.log(`Index contains ${data.length} days of data`);

    data = data.map(({ date, price }) => ({
      date: new Date(date),
      price: parseFloat(price)
    }));

    const tableData = calculateTableData(data, minDrawdown);
    const chartData = [
      {
        id: "1",
        data: data
          .filter((item, idx) => idx % 3 === 0)
          .map(({ price, date }) => ({ x: date, y: price }))
      }
    ];

    setState({ tableData, chartData });
  };

  const loadIndexData = async index => {
    if (index === "world") {
      return import(`../data/world.json`);
    }
    if (index === "acwi") {
      return import(`../data/acwi.json`);
    }
    if (index === "acwi-imi") {
      return import(`../data/acwi-imi.json`);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Form onChange={onFormChange}></Form>
        </Grid>
        <Grid item xs={12}>
          <Table tableData={state.tableData}></Table>
        </Grid>
        <Grid item xs={12} style={{ height: 500 }}>
          <Chart data={state.chartData} />
        </Grid>
      </Grid>
    </Container>
  );
};
