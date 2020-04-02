import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import Chart from "./chart";
import Form from "./form";
import { calculateChartData, calculateTableData } from "./services/Calculator";
import { getIndexData } from "./services/Data";
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
    const data = await getIndexData(index);

    const tableData = calculateTableData(data, minDrawdown);
    const chartData = calculateChartData(data);

    setState(prevState => ({ ...prevState, tableData, chartData }));
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
