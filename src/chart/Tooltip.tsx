import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import { formatDate, formatNumber } from "../services/format";
import { PointTooltip } from "@nivo/line";

const Tooltip: PointTooltip = ({
  point: {
    data: { x, y },
  },
}) => (
  <Paper sx={{ padding: 1 }}>
    <Typography>
      {formatDate(x as Date)}: {formatNumber(y as number, " USD")}
    </Typography>
  </Paper>
);

export default Tooltip;
