import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import React, { useEffect, useState } from "react";

export default ({ onChange }) => {
  const [minDrawdown, setMinDrawdown] = useState(30);
  const [index, setIndex] = useState("world");

  const handleMinDrawdownChange = (event, newValue) => {
    setMinDrawdown(newValue);
    onChange({ minDrawdown, index });
  };

  const handleIndexChange = event => {
    setIndex(event.target.value);
    onChange({ minDrawdown, index });
  };

  useEffect(() => {
    onChange({ minDrawdown, index });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl>
          <InputLabel>Index</InputLabel>
          <Select value={index} onChange={handleIndexChange}>
            <MenuItem value={"world"}>MSCI World</MenuItem>
            <MenuItem value={"acwi"}>MSCI ACWI</MenuItem>
            <MenuItem value={"acwi-imi"}>MSCI ACWI IMI</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography gutterBottom>Minimum accumulated loss</Typography>
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
    </Grid>
  );
};
