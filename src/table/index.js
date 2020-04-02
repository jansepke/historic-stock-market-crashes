import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

const browserLanguage =
  window.navigator.language || window.navigator.userLanguage;
const dtf = new Intl.DateTimeFormat(browserLanguage, {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

const formatDays = days => {
  if (isNaN(days)) {
    return "-";
  }
  return days >= 365 ? `${(days / 365).toFixed(1)}y` : `${days.toFixed()}d`;
};

export default ({ tableData, onRowHoverStart, onRowHoverEnd }) => {
  return (
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
            <TableRow
              key={row.startDate}
              hover={true}
              onMouseOver={() => onRowHoverStart(row)}
              onMouseOut={() => onRowHoverEnd(row)}
            >
              <TableCell align="center">{dtf.format(row.startDate)}</TableCell>
              <TableCell align="center">{dtf.format(row.endDate)}</TableCell>
              <TableCell align="center">{formatDays(row.daysDown)}</TableCell>
              <TableCell align="center">{-row.percent.toFixed()}%</TableCell>
              <TableCell align="center">{formatDays(row.daysDone)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
