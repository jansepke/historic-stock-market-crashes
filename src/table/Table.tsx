import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { formatDate, formatDays, formatNumber } from "../services/format";
import TouchTooltip from "./TouchTooltip";
import { Crash } from "../services/domain";

interface TableProps {
  tableData: Crash[];
  onRowHoverStart: (row: Crash) => void;
  onRowHoverEnd: (row: Crash) => void;
}

const Table: React.FC<TableProps> = ({
  tableData,
  onRowHoverStart,
  onRowHoverEnd,
}) => (
  <TableContainer component={Paper}>
    <MuiTable>
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
            key={row.startDate.toString()}
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
    </MuiTable>
  </TableContainer>
);

export default Table;
