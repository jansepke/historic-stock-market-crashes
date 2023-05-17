import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import React, { useState } from "react";
import {
  datasets,
  indiceGroups,
  minDrawdowns,
  minDrawdownStep,
} from "../services/Config";
import { formatDate } from "../services/Format";

const Index = ({
  index,
  dataset,
  lastDataUpdate,
  initialMinDrawdown,
  onMinDrawdownChange,
  onDatasetChange,
  onIndexChange,
}) => {
  const [minDrawdown, setMinDrawdown] = useState(initialMinDrawdown);

  const handleMinDrawdownChange = (event, newValue) => {
    if (newValue !== initialMinDrawdown) {
      onMinDrawdownChange(newValue);
    }
  };

  const handleIndexChange = (event) => {
    onIndexChange(event.target.value);
  };

  const handleDatasetChange = (event) => {
    onDatasetChange(event.target.value);
  };

  const handleMinDrawdownMove = (event, newValue) => {
    setMinDrawdown(newValue);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={4} md={2}>
            <FormControl fullWidth={true}>
              <InputLabel>Index</InputLabel>
              <Select native value={index} onChange={handleIndexChange}>
                {indiceGroups.map((g) => (
                  <optgroup key={g.groupId} label={g.label}>
                    {g.indices.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8} md={3}>
            {lastDataUpdate && (
              <Typography variant="body2" color="textSecondary">
                Last updated on: {formatDate(lastDataUpdate)}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={5} md={3}>
            <FormControl fullWidth={true}>
              <InputLabel>Values from end of</InputLabel>
              <Select value={dataset} onChange={handleDatasetChange}>
                {datasets.map((i) => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={7} md={4}>
            <FormLabel>Loss of at least {minDrawdown}%</FormLabel>
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
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Index;
