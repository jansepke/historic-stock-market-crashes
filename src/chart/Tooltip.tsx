import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import { formatDate, formatNumber } from "../services/format";

const Tooltip = ({
  point: {
    data: { x, y },
  },
}) => (
  <Paper sx={{ padding: 1 }}>
    <Typography>
      {formatDate(x)}: {formatNumber(y, " USD")}
    </Typography>
  </Paper>
);

export default Tooltip;
