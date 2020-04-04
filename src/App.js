import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Form from "./form";
import Table from "./table";

const Chart = dynamic(() => import("./chart"), {
  ssr: false,
  loading: () => (
    <Grid item xs={12} align="center">
      <CircularProgress />
    </Grid>
  )
});

export default ({
  index,
  minDrawdown,
  tableData,
  indexDataCount,
  indexDataUpdateDate
}) => {
  const router = useRouter();

  const [state, setState] = useState({
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
    router.push(`/${newIndex}/min-drawdown/${minDrawdown}`);
  };

  const onMinDrawdownChange = newMinDrawdown => {
    router.push(`/${index}/min-drawdown/${newMinDrawdown}`);
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/chart-data/${index}`);
      const chartData = await response.json();

      chartData[0].data.forEach(item => {
        item.x = new Date(item.x);
      });

      setState(prevState => ({
        ...prevState,
        chartData
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
            lastDataUpdate={indexDataUpdateDate}
            initialMinDrawdown={minDrawdown}
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
              dataCount={indexDataCount}
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
