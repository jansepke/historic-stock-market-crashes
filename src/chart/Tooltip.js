import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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
