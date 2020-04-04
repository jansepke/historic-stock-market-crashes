import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import React, { useState } from "react";
import { indices, minDrawdowns, minDrawdownStep } from "../services/Config";
import { formatDate } from "../services/Format";

export default ({
  index,
  lastDataUpdate,
  initialMinDrawdown,
  onMinDrawdownChange,
  onVisibilityChange,
  onIndexChange
}) => {
  const [minDrawdown, setMinDrawdown] = useState(initialMinDrawdown);

  const handleMinDrawdownChange = (event, newValue) => {
    if (newValue !== initialMinDrawdown) {
      onMinDrawdownChange(newValue);
    }
  };

  const handleIndexChange = event => {
    onIndexChange(event.target.value);
  };

  const handleVisibility = name => event => {
    onVisibilityChange(name, event.target.checked);
  };

  const handleMinDrawdownMove = (event, newValue) => {
    setMinDrawdown(newValue);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={4} md={2}>
            <FormControl>
              <InputLabel>Index</InputLabel>
              <Select value={index} onChange={handleIndexChange}>
                {indices.map(i => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8} md={4}>
            {lastDataUpdate && (
              <Typography variant="body2" color="textSecondary">
                Last data from: {formatDate(lastDataUpdate)}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <FormLabel>Minimum accumulated loss</FormLabel>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TrendingDownIcon />
              </Grid>
              <Grid item xs>
                <Slider
                  value={minDrawdown}
                  onChange={handleMinDrawdownMove}
                  onChangeCommitted={handleMinDrawdownChange}
                  marks={true}
                  step={minDrawdownStep}
                  min={minDrawdowns[0]}
                  max={minDrawdowns[minDrawdowns.length - 1]}
                />
              </Grid>
              <Grid item>
                <Typography>{minDrawdown}%</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <FormLabel>Customizations</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox onChange={handleVisibility("table")} />}
                  label="Hide Table"
                />
                <FormControlLabel
                  control={<Checkbox onChange={handleVisibility("chart")} />}
                  label="Hide Chart"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
