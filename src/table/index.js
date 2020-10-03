import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { formatDate, formatDays, formatNumber } from "../services/Format";
import TouchTooltip from "./TouchTooltip";

const Index = ({ tableData, onRowHoverStart, onRowHoverEnd }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Begin of crash</TableCell>
          <TableCell align="center">Date of lowest point</TableCell>
          <TableCell align="center">
            Time until
            <br />
            lowest point
          </TableCell>
          <TableCell align="center">
            Loss of value
            <br />
            (maximum drawdown)
          </TableCell>
          <TableCell align="center">
            <TouchTooltip
              withIcon
              title="Time from begin of crash until new highest point"
            >
              Time until new
              <br />
              highest point
            </TouchTooltip>
          </TableCell>
          <TableCell align="center">
            <TouchTooltip
              withIcon
              title="Return of an investment from the lowest point after 2 years"
            >
              ROI after
              <br />2 years
            </TouchTooltip>
          </TableCell>
          <TableCell align="center">
            <TouchTooltip
              withIcon
              title="Return of an investment from the lowest point after 5 years"
            >
              ROI after
              <br />5 years
            </TouchTooltip>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map((row) => (
          <TableRow
            key={row.startDate}
            hover={true}
            onMouseOver={() => onRowHoverStart(row)}
            onMouseOut={() => onRowHoverEnd(row)}
          >
            <TableCell align="center">
              <TouchTooltip title={formatNumber(row.startPrice, " USD")}>
                {formatDate(row.startDate)}
              </TouchTooltip>
            </TableCell>
            <TableCell align="center">
              <TouchTooltip title={formatNumber(row.endPrice, " USD")}>
                {formatDate(row.endDate)}
              </TouchTooltip>
            </TableCell>
            <TableCell align="center">{formatDays(row.daysDown)}</TableCell>
            <TableCell align="center">
              <Box color="error.main">{-row.percent.toFixed()}%</Box>
            </TableCell>
            <TableCell align="center">
              <TouchTooltip
                title={row.doneDate ? formatDate(row.doneDate) : ""}
              >
                {formatDays(row.daysDone)}
              </TouchTooltip>
            </TableCell>
            <TableCell align="center">
              {formatNumber(row.percentUp2, "%")}
            </TableCell>
            <TableCell align="center">
              {formatNumber(row.percentUp5, "%")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default Index;
