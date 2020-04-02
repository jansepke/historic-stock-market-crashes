import { ResponsiveLineCanvas } from "@nivo/line";
import React from "react";

export default ({ data }) =>
  data.length > 0 && (
    <ResponsiveLineCanvas
      data={data}
      margin={{ bottom: 50, left: 60, right: 20 }}
      xScale={{ type: "time", precision: "day" }}
      yScale={{ type: "linear", min: "auto" }}
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
      colors={{ scheme: "set1" }}
      lineWidth={1}
      isInteractive={false}
      enablePoints={false}
    />
  );
