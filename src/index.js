import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";

const browserLanguage =
  window.navigator.language || window.navigator.userLanguage;
const dtf = new Intl.DateTimeFormat(browserLanguage, {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

const msToDays = 1 / 60 / 60 / 24 / 1000;

const calculateTableData = (data, minDrawdown) => {
  const newTableData = [];
  let lastPeak = { price: 0 },
    lastTrough = { price: 0 };

  data = data.map(({ date, price }) => ({
    date: new Date(date),
    price: parseFloat(price)
  }));

  const checkDrawdown = (newPeak = {}) => {
    const percent = (1 - lastTrough.price / lastPeak.price) * 100;
    if (percent > minDrawdown) {
      const daysDown = (lastTrough.date - lastPeak.date) * msToDays;
      const daysDone = (newPeak.date - lastPeak.date) * msToDays;

      newTableData.push({
        startDate: lastPeak.date,
        endDate: lastTrough.date,
        daysDown: daysDown,
        percent: percent,
        daysDone: daysDone
      });
    }
  };

  for (const entry of data) {
    if (entry.price > lastPeak.price) {
      checkDrawdown(entry);
      lastPeak = entry;
      lastTrough = entry;
    } else if (entry.price < lastTrough.price) {
      lastTrough = entry;
    }
  }

  checkDrawdown();

  return newTableData;
};

const formatDays = days => {
  if (isNaN(days)) {
    return "-";
  }
  return days >= 365 ? `${(days / 365).toFixed(1)}y` : `${days.toFixed()}d`;
};

const App = () => {
  const [tableData, setTableData] = useState([]);
  const [minDrawdown, setMinDrawdown] = useState(30);
  const [index, setIndex] = useState("world");

  const handleMinDrawdownChange = (event, newValue) => {
    setMinDrawdown(newValue);
  };

  const handleIndexChange = event => {
    setIndex(event.target.value);
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

  useEffect(() => {
    (async () => {
      let data = await loadIndexData(index);

      const newTableData = calculateTableData(data, minDrawdown);

      setTableData(newTableData);
    })();
  }, [minDrawdown, index]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl>
            <InputLabel>Index</InputLabel>
            <Select value={index} onChange={handleIndexChange}>
              <MenuItem value={"world"}>MSCI World</MenuItem>
              <MenuItem value={"acwi"}>MSCI ACWI</MenuItem>
              <MenuItem value={"acwi-imi"}>MSCI ACWI IMI</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Minimum accumulated loss</Typography>
          <Slider
            value={minDrawdown}
            onChange={handleMinDrawdownChange}
            valueLabelDisplay="auto"
            step={5}
            marks
            valueLabelDisplay="on"
            min={10}
            max={50}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Start of crash</TableCell>
                  <TableCell align="center">End of crash</TableCell>
                  <TableCell align="center">
                    Time until
                    <br />
                    lowest point
                  </TableCell>
                  <TableCell align="center">
                    Accumulated loss
                    <br />
                    (maximum drawdown)
                  </TableCell>
                  <TableCell align="center">
                    Time until last
                    <br />
                    highest point
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map(row => (
                  <TableRow key={row.startDate}>
                    <TableCell align="center">
                      {dtf.format(row.startDate)}
                    </TableCell>
                    <TableCell align="center">
                      {dtf.format(row.endDate)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDays(row.daysDown)}
                    </TableCell>
                    <TableCell align="center">
                      {-row.percent.toFixed()}%
                    </TableCell>
                    <TableCell align="center">
                      {formatDays(row.daysDone)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
