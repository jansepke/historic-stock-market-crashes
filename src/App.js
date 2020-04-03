import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Chart from "./chart";
import Footer from "./Footer";
import Form from "./form";
import { calculateChartData, calculateTableData } from "./services/Calculator";
import { getIndexData } from "./services/Data";
import Table from "./table";

export default ({ index }) => {
  const router = useRouter();

  const [loading, setLoading] = useState({ chart: true, table: true });
  const [state, setState] = useState({
    data: [],
    minDrawdown: 30,
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

  const onIndexChange = newIndex => {
    setLoading({ chart: true, table: true });

    router.push(`${router.pathname}?index=${newIndex}`);
  };

  const onMinDrawdownChange = minDrawdown => {
    setState(prevState => ({
      ...prevState,
      minDrawdown
    }));
  };

  useEffect(() => {
    if (state.data.length === 0) {
      return;
    }

    setLoading(prevState => ({ ...prevState, table: true }));

    setTimeout(() => {
      const tableData = calculateTableData(state.data, state.minDrawdown);

      setState(prevState => ({
        ...prevState,
        tableData
      }));
      setLoading(prevState => ({ ...prevState, table: false }));
    });
  }, [state.minDrawdown, state.data]);

  useEffect(() => {
    if (state.data.length === 0) {
      return;
    }

    setLoading(prevState => ({ ...prevState, chart: true }));

    setTimeout(() => {
      const chartData = calculateChartData(state.data, 5000);

      setState(prevState => ({
        ...prevState,
        chartData
      }));
      setLoading(prevState => ({ ...prevState, chart: false }));
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
            minDrawdown={state.minDrawdown}
            onMinDrawdownChange={onMinDrawdownChange}
            onIndexChange={onIndexChange}
            onVisibilityChange={onVisibilityChange}
          />
        </Grid>
        {loading.chart || loading.table ? (
          <Grid item xs={12} align="center">
            <CircularProgress />
          </Grid>
        ) : (
          <>
            {state.visibility.table && (
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
            {state.visibility.chart && (
              <Grid item xs={12}>
                <Chart
                  data={state.chartData}
                  markers={state.markers}
                  dataCount={state.data.length}
                />
              </Grid>
            )}
          </>
        )}
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </Container>
  );
};
