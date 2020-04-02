import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { calculateTableData } from "./calculator";
import Chart from "./chart";
import Form from "./form";
import Table from "./table";

export default () => {
  const [state, setState] = useState({
    tableData: [],
    chartData: [],
    markers: []
  });

  const addMarker = item => {
    setState(prevState => ({
      ...prevState,
      markers: [item.startDate, item.endDate]
    }));
  };

  const removeMarkers = () => {
    setState(prevState => ({
      ...prevState,
      markers: []
    }));
  };

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

    setState(prevState => ({ ...prevState, tableData, chartData }));
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
          <Table
            tableData={state.tableData}
            onRowHoverStart={addMarker}
            onRowHoverEnd={removeMarkers}
          ></Table>
        </Grid>
        <Grid item xs={12}>
          <Typography>Tip: Hover over a row to mark crash on graph.</Typography>
        </Grid>
        <Grid item xs={12} style={{ height: 500 }}>
          <Chart data={state.chartData} markers={state.markers} />
        </Grid>
      </Grid>
    </Container>
  );
};
