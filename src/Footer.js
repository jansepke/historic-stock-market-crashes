import { Grid } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "inline",
    boxShadow: "none",
  },
  summary: {
    display: "inline-flex",
  },
}));

const FootNote = ({ header, children }) => {
  const classes = useStyles();

  return (
    <Accordion className={classes.root}>
      <AccordionSummary
        className={classes.summary}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="body2" color="textSecondary">
          {header}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="textSecondary">
          {children}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <FootNote header="Data sources">
            MSCI index data is gathered from:{" "}
            <a href="https://www.msci.com/end-of-day-data-search">
              MSCI End of day index data search
            </a>
            <br />
            Various ticker data is gathered from:{" "}
            <a href="https://finance.yahoo.com/">Yahoo Finance</a>
          </FootNote>
        </Grid>
        <Grid item xs={12}>
          <FootNote header="Legal Disclaimer">
            This website is created and authored by Jan Sepke and is published
            and provided for informational and entertainment purposes only. The
            opinions expressed on this Site are for general informational
            purposes only and are not intended to provide specific advice or
            recommendations for any individual or on any specific security or
            investment product. It is only intended to provide education about
            the financial industry. Nothing on this Site constitutes investment
            advice, performance data or any recommendation that any security,
            portfolio of securities, investment product, transaction or
            investment strategy is suitable for any specific person. You should
            not use this Site to make financial decisions and I highly
            recommended you seek professional advice from someone who is
            authorised to provide investment advice. Investments in securities
            involve the risk of loss. Past performance is no guarantee of future
            results.
          </FootNote>
        </Grid>
        <Grid item xs={12}>
          <FootNote header="Source Code">
            The Source Code can be found on{" "}
            <a href="https://github.com/jansepke/historic-stock-market-crashes">
              GitHub
            </a>
          </FootNote>
        </Grid>
      </Grid>
    </>
  );
};
