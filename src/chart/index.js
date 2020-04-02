import { ResponsiveLineCanvas } from "@nivo/line";
import React from "react";

export default ({ data }) =>
  data.length > 0 && (
    <ResponsiveLineCanvas
      data={data}
      margin={{ bottom: 50, left: 60, right: 20 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        precision: "day"
      }}
      xFormat="time:%Y-%m-%d"
      axisBottom={{
        format: "%Y",
        tickValues: "every 5 years",
        legend: "year",
        legendOffset: -12
      }}
      axisLeft={{
        legend: "points",
        legendOffset: 12
      }}
      colors={{ scheme: "spectral" }}
      lineWidth={1}
      isInteractive={false}
      enablePoints={false}
    />
  );
