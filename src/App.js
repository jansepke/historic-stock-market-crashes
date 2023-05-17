import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import Alert from "@mui/material/Alert";
import dynamic from "next/dynamic";
import { Router, useRouter } from "next/router";
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
  ),
});

const App = ({
  index,
  inflation,
  dataset,
  minDrawdown,
  tableData,
  indexDataCount,
  indexDataUpdateDate,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [chart, setChart] = useState({
    data: [],
    loading: false,
  });

  Router.events.on("routeChangeStart", () => setLoading(true));
  Router.events.on("routeChangeComplete", () => setLoading(false));

  const addMarker = (item) => {
    setMarkers([
      { date: item.startDate, price: item.startPrice },
      { date: item.endDate, price: item.endPrice },
    ]);
  };

  const removeMarkers = () => {
    setMarkers([]);
  };

  const changeRoute = (part) => (newValue) => {
    const values = { index, dataset, minDrawdown, [part]: newValue };

    router.push(
      `/[index]/[inflation]/[dataset]/min-drawdown/[minDrawdown]`,
      `/${values.index}/nominal/${values.dataset}/min-drawdown/${values.minDrawdown}`
    );
  };

  useEffect(() => {
    setChart({ loading: true, data: [] });

    (async () => {
      const response = await fetch(
        `/api/chart-data/${index}-${inflation}-${dataset}`
      );
      const chartData = await response.json();

      chartData[0].data.forEach((item) => {
        item.x = new Date(item.x); // Dates are serialized in JSON
      });

      setChart({ loading: false, data: chartData });
    })();
  }, [index, dataset]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center">
        Historic Stock Market Crashes
      </Typography>
      <Box m={2}>
        <Typography align="justify">
          Analyze historic stock market crashes for different indices based on
          the maximum drawdown.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Form
            index={index}
            lastDataUpdate={indexDataUpdateDate}
            initialMinDrawdown={minDrawdown}
            dataset={dataset}
            onMinDrawdownChange={changeRoute("minDrawdown")}
            onDatasetChange={changeRoute("dataset")}
            onIndexChange={changeRoute("index")}
          />
        </Grid>
        {dataset === "end-of-day" && (
          <Grid item xs={12}>
            <Alert severity="info">
              When using daily values instead of monthly values the results are
              less comparable to other statistics that often use monthly dates.
            </Alert>
          </Grid>
        )}
        {loading ? (
          <Grid item xs={12} align="center">
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Table
                    tableData={tableData}
                    onRowHoverStart={addMarker}
                    onRowHoverEnd={removeMarkers}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography variant="body2">
                    <InfoOutlinedIcon fontSize="inherit" /> Returns are nominal
                    without costs and taxes. Values are in USD.
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography variant="body2" align="right">
                    <TouchAppOutlinedIcon fontSize="inherit" /> Click on a row
                    to mark crash on graph.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {chart.loading ? (
              <Grid item xs={12} align="center">
                <CircularProgress />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Chart
                  data={chart.data}
                  markers={markers}
                  dataCount={indexDataCount}
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

export default App;
