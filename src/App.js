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
    dataCount: 0,
    visibility: {
      table: true,
      chart: true
    },
    tableData: [],
    chartData: [],
    markers: []
  });

  const addMarker = item => {
    setState(prevState => ({
      ...prevState,
      markers: [
        { date: item.startDate, price: item.startPrice },
        { date: item.endDate, price: item.endPrice }
      ]
    }));
  };

  const removeMarkers = () => {
    setState(prevState => ({
      ...prevState,
      markers: []
    }));
  };

  const onFormChange = async ({ index, minDrawdown, sampleRate }) => {
    const data = await getIndexData(index);

    const tableData = calculateTableData(data, minDrawdown);
    const chartData = calculateChartData(data, sampleRate);

    setState(prevState => ({
      ...prevState,
      tableData,
      chartData,
      dataCount: data.length
    }));
  };

  const onVisibilityChange = (name, hide) => {
    setState(prevState => ({
      ...prevState,
      visibility: { ...prevState.visibility, [name]: !hide }
    }));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h1">Historic Crashes</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Form
            onChange={onFormChange}
            onVisibilityChange={onVisibilityChange}
          />
        </Grid>
        {state.visibility.table && state.dataCount > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Table
                  tableData={state.tableData}
                  onRowHoverStart={addMarker}
                  onRowHoverEnd={removeMarkers}
                />
              </Grid>
              {state.visibility.chart && (
                <Grid item xs={12}>
                  <Typography variant="body2" align="right">
                    Tip: Hover over a row to mark crash on graph.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
        {state.visibility.chart && state.dataCount > 0 && (
          <Grid item xs={12}>
            <Chart
              data={state.chartData}
              markers={state.markers}
              dataCount={state.dataCount}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
