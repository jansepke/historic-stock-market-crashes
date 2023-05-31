import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import React, { SyntheticEvent, useState } from "react";
import { datasets, indiceGroups, minDrawdowns, minDrawdownStep } from "../services/config";
import { formatDate } from "../services/format";

interface FormProps {
  index: string;
  dataset: string;
  lastDataUpdate: Date;
  initialMinDrawdown: number;
  onMinDrawdownChange: (value: number) => void;
  onDatasetChange: (value: string) => void;
  onIndexChange: (value: string) => void;
}

const Form: React.FC<FormProps> = ({
  index,
  dataset,
  lastDataUpdate,
  initialMinDrawdown,
  onMinDrawdownChange,
  onDatasetChange,
  onIndexChange,
}) => {
  const [minDrawdown, setMinDrawdown] = useState(initialMinDrawdown);

  const handleMinDrawdownChange = (event: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue !== initialMinDrawdown) {
      onMinDrawdownChange(newValue);
    }
  };

  const handleIndexChange = (event: SelectChangeEvent<string>) => {
    onIndexChange(event.target.value);
  };

  const handleDatasetChange = (event: SelectChangeEvent<string>) => {
    onDatasetChange(event.target.value);
  };

  const handleMinDrawdownMove = (event: Event, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setMinDrawdown(newValue);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Index</InputLabel>
              <Select label="Index" native value={index} onChange={handleIndexChange}>
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
            <FormControl fullWidth>
              <InputLabel>Values from end of</InputLabel>
              <Select label="Values from end of" value={dataset} onChange={handleDatasetChange}>
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

export default Form;
