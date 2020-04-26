export const indices = [
  { id: "msci-world", label: "MSCI World" },
  { id: "msci-acwi", label: "MSCI ACWI" },
  { id: "msci-acwi-imi", label: "MSCI ACWI IMI" },
];

export const inflations = [
  { id: "nominal", label: "nominal" },
  { id: "real-us", label: "real (US inflation)" },
];

export const minDrawdownStep = 5;
export const minDrawdowns = [...Array(9).keys()].map(
  (i) => 10 + i * minDrawdownStep
);
