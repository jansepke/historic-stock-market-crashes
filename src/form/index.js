import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import React from "react";

export default ({
  minDrawdown,
  onMinDrawdownChange,
  onVisibilityChange,
  onIndexChange
}) => {
  const handleMinDrawdownChange = (event, newValue) => {
    onMinDrawdownChange(newValue);
  };

  const handleIndexChange = event => {
    onIndexChange(event.target.value);
  };

  const handleVisibility = name => event => {
    onVisibilityChange(name, event.target.checked);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <InputLabel>Index</InputLabel>
              <Select defaultValue={"world"} onChange={handleIndexChange}>
                <MenuItem value={"world"}>MSCI World</MenuItem>
                <MenuItem value={"acwi"}>MSCI ACWI</MenuItem>
                <MenuItem value={"acwi-imi"}>MSCI ACWI IMI</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>Minimum accumulated loss</FormLabel>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TrendingDownIcon />
              </Grid>
              <Grid item xs>
                <Slider
                  value={minDrawdown}
                  onChange={handleMinDrawdownChange}
                  step={5}
                  min={10}
                  max={50}
                />
              </Grid>
              <Grid item>
                <Input
                  value={minDrawdown}
                  margin="dense"
                  readOnly={true}
                  style={{ width: 20 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
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
