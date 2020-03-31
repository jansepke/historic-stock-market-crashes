import { Container } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";

const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

const minPercent = 20;
const msToDays = 1 / 60 / 60 / 24 / 1000;

function App() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    (async () => {
      let data = await import("../data/world.json");

      const newTableData = [];
      let lastPeak = { price: 0 },
        lastTrough = { price: 0 };

      data = data.map(({ date, price }) => ({
        date: new Date(date),
        price: parseFloat(price)
      }));

      const checkDrawdown = (newPeak = {}) => {
        const percent = (1 - lastTrough.price / lastPeak.price) * 100;
        if (percent > minPercent) {
          const daysDown = (lastTrough.date - lastPeak.date) * msToDays;
          const daysDone = (newPeak.date - lastPeak.date) * msToDays;

          newTableData.push({
            startDate: dtf.format(lastPeak.date),
            endDate: dtf.format(lastTrough.date),
            daysDown: daysDown.toFixed(),
            percent: -percent.toFixed(),
            daysDone: daysDone.toFixed()
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

      setTableData(newTableData);
    })();
  }, []);

  return (
    <Container maxWidth="md">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>StartDate</TableCell>
              <TableCell>EndDate</TableCell>
              <TableCell>DaysDown</TableCell>
              <TableCell>Percent</TableCell>
              <TableCell>DaysDone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map(row => (
              <TableRow key={row.startDate}>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                <TableCell>{row.daysDown}</TableCell>
                <TableCell>{row.percent}</TableCell>
                <TableCell>{row.daysDone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));
