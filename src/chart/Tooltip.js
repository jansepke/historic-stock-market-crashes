import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import { formatDate, formatNumber } from "../services/Format";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}));

const Tooltip = ({
  point: {
    data: { x, y },
  },
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography>
        {formatDate(x)}: {formatNumber(y, " USD")}
      </Typography>
    </Paper>
  );
};

export default Tooltip;
