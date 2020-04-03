import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";
import { formatDate, formatDays, formatNumber } from "../services/Format";

export default ({ tableData, onRowHoverStart, onRowHoverEnd }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Begin of crash</TableCell>
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
              <Tooltip title="Time from begin of crash until new highest point">
                <span>
                  Time until new
                  <br />
                  highest point <HelpOutlineIcon fontSize="inherit" />
                </span>
              </Tooltip>
            </TableCell>
            <TableCell align="center">
              Accumulated return
              <br />
              after 2 years
            </TableCell>
            <TableCell align="center">
              Accumulated return
              <br />
              after 5 years
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
              <TableCell align="center">
                <Tooltip title={formatNumber(row.startPrice, " points")}>
                  <span>{formatDate(row.startDate)}</span>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={formatNumber(row.endPrice, " points")}>
                  <span>{formatDate(row.endDate)}</span>
                </Tooltip>
              </TableCell>
              <TableCell align="center">{formatDays(row.daysDown)}</TableCell>
              <TableCell align="center">
                <Box color="error.main">{-row.percent.toFixed()}%</Box>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={formatDate(row.doneDate)}>
                  <span>{formatDays(row.daysDone)}</span>
                </Tooltip>
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
};
