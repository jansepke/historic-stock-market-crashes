import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Chart from "./chart";
import Footer from "./Footer";
import Form from "./form";
import { calculateChartData } from "./services/Calculator";
import { getIndexData } from "./services/Data";
import Table from "./table";

export default ({ index, minDrawdown, tableData }) => {
  const router = useRouter();

  const [state, setState] = useState({
    data: [],
    visibility: {
      table: true,
      chart: true
    },
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

  const onIndexChange = newIndex => {
    router.push(
      `${router.pathname}?index=${newIndex}&minDrawdown=${minDrawdown}`
    );
  };

  const onMinDrawdownChange = newMinDrawdown => {
    router.push(
      `${router.pathname}?index=${index}&minDrawdown=${newMinDrawdown}`
    );
  };

  useEffect(() => {
    if (state.data.length === 0) {
      return;
    }

    setTimeout(() => {
      const chartData = calculateChartData(state.data, 5000);

      setState(prevState => ({
        ...prevState,
        chartData
      }));
    });
  }, [state.data]);

  useEffect(() => {
    (async () => {
      const data = await getIndexData(index);

      setState(prevState => ({
        ...prevState,
        data
      }));
    })();
  }, [index]);

  const onVisibilityChange = (name, hide) => {
    setState(prevState => ({
      ...prevState,
      visibility: { ...prevState.visibility, [name]: !hide }
    }));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center">
        Historic Stock Market Crashes
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Form
            index={index}
            lastDataUpdate={
              state.data.length > 0 && state.data[state.data.length - 1].date
            }
            minDrawdown={minDrawdown}
            onMinDrawdownChange={onMinDrawdownChange}
            onIndexChange={onIndexChange}
            onVisibilityChange={onVisibilityChange}
          />
        </Grid>
        {state.visibility.table && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Table
                  tableData={tableData}
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
        {state.visibility.chart && (
          <Grid item xs={12}>
            <Chart
              data={state.chartData}
              markers={state.markers}
              dataCount={state.data.length}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </Container>
  );
};
