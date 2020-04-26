import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import TouchAppOutlinedIcon from "@material-ui/icons/TouchAppOutlined";
import Alert from "@material-ui/lab/Alert";
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

export default ({
  index,
  inflation,
  dataResolution,
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

  const onIndexChange = (newIndex) => {
    router.push(
      `/[index]/min-drawdown/[minDrawdown]`,
      `/${newIndex}_nominal_${dataResolution}/min-drawdown/${minDrawdown}`
    );
  };

  const onDataResolutionChange = (newDataResolution) => {
    router.push(
      `/[index]/min-drawdown/[minDrawdown]`,
      `/${index}_nominal_${newDataResolution}/min-drawdown/${minDrawdown}`
    );
  };

  const onMinDrawdownChange = (newMinDrawdown) => {
    router.push(
      `/[index]/min-drawdown/[minDrawdown]`,
      `/${index}_nominal_${dataResolution}/min-drawdown/${newMinDrawdown}`
    );
  };

  useEffect(() => {
    setChart({ loading: true, data: [] });

    (async () => {
      const response = await fetch(
        `/api/chart-data/${index}-${inflation}-${dataResolution}`
      );
      const chartData = await response.json();

      chartData[0].data.forEach((item) => {
        item.x = new Date(item.x);
      });

      setChart({ loading: false, data: chartData });
    })();
  }, [index, dataResolution]);

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
            dataResolution={dataResolution}
            onMinDrawdownChange={onMinDrawdownChange}
            onDataResolutionChange={onDataResolutionChange}
            onIndexChange={onIndexChange}
          />
        </Grid>
        {dataResolution === "end-of-day" && (
          <Grid item xs={12}>
            <Alert severity="info">
              When using daily values instead of monthly values the results are
              less comparable to other statistics that often use monthly dates.
            </Alert>
          </Grid>
        )}
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
                <TouchAppOutlinedIcon fontSize="inherit" /> Click on a row to
                mark crash on graph.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {loading || chart.loading ? (
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
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </Container>
  );
};
