import { ResponsiveLine } from "@nivo/line";
import React from "react";

export default ({ data, markers }) =>
  data.length > 0 && (
    <ResponsiveLine
      data={data}
      animate={false}
      margin={{ bottom: 50, left: 60, right: 25 }}
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
      markers={markers.map((item, idx) => ({
        axis: "x",
        value: item.date,
        lineStyle: { strokeDasharray: "10 5" },
        legend: `${item.price.toFixed()} p`,
        legendOrientation: "vertical",
        legendPosition: idx % 2 === 0 ? "top-left" : "top-right"
      }))}
    />
  );
