import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import React, { useState } from "react";
import { calculateTableData } from "./calculator";
import Chart from "./chart";
import Form from "./form";
import Table from "./table";

export default () => {
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const onFormChange = async ({ index, minDrawdown }) => {
    let data = await loadIndexData(index);

    console.log(`Index contains ${data.length} days of data`);

    data = data.map(({ date, price }) => ({
      date: new Date(date),
      price: parseFloat(price)
    }));

    const newTableData = calculateTableData(data, minDrawdown);

    setTableData(newTableData);
    setChartData([
      {
        id: "1",
        data: data.map(({ price, date }) => ({ x: date, y: price }))
      }
    ]);
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
          <Table tableData={tableData}></Table>
        </Grid>
        <Grid item xs={12} style={{ height: 500 }}>
          <Chart data={chartData} />
        </Grid>
      </Grid>
    </Container>
  );
};
