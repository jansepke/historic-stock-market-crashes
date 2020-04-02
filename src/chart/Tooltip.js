import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { formatDate } from "../services/Format";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  }
}));

export default ({
  point: {
    data: { x, y }
  }
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography>
        {formatDate(x)}: {y.toFixed()}p
      </Typography>
    </Paper>
  );
};
