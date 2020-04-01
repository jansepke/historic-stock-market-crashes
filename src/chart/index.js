import { ResponsiveLineCanvas } from "@nivo/line";
import React from "react";

export default ({ data }) => (
  <ResponsiveLineCanvas
    data={data}
    margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
    xScale={{ type: "linear" }}
    yScale={{ type: "linear", stacked: true }}
    curve="monotoneX"
    axisTop={null}
    enableGridX={false}
    colors={{ scheme: "spectral" }}
    lineWidth={1}
    isInteractive={false}
    enablePoints={false}
    enablePointLabel={false}
    pointLabel="y"
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[]}
  />
);
