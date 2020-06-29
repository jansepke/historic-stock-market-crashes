export const indices = [
  {
    groupId: "msci",
    label: "MSCI",
    indices: [
      { id: "msci-world", label: "MSCI World" },
      { id: "msci-world-momentum", label: "MSCI World Momentum" },
      { id: "msci-world-quality", label: "MSCI World Quality" },
      { id: "msci-world-value", label: "MSCI World Value" },
      { id: "msci-world-growth", label: "MSCI World Growth" },
      { id: "msci-acwi", label: "MSCI ACWI" },
      { id: "msci-acwi-imi", label: "MSCI ACWI IMI" },
      { id: "msci-world-esg-screened", label: "MSCI World ESG Screened" },
    ],
  },
  {
    groupId: "us",
    label: "U.S.",
    indices: [
      { id: "yahoo-spx", label: "S&P 500" },
      { id: "yahoo-dji", label: "Dow Jones Industrial Average" },
      { id: "yahoo-ndx", label: "NASDAQ 100" },
      { id: "yahoo-vix", label: "CBOE Volatility Index" },
      { id: "yahoo-rut", label: "Russell 2000" },
    ],
  },
  {
    groupId: "us-bonds",
    label: "U.S. Bonds",
    indices: [
      { id: "yahoo-tnx", label: "U.S. Treasury Yield 10 Years" },
      { id: "yahoo-zb", label: "U.S. Treasury Bond" },
    ],
  },
  {
    groupId: "other",
    label: "Other",
    indices: [{ id: "yahoo-n225", label: "Nikkei 225" }],
  },
];

export const inflations = [
  { id: "nominal", label: "nominal" },
  { id: "real-us", label: "real (US inflation)" },
];

export const datasets = [
  { id: "end-of-day", label: "day" },
  { id: "end-of-month", label: "month" },
];

export const minDrawdownStep = 5;
export const minDrawdowns = [...Array(9).keys()].map(
  (i) => 10 + i * minDrawdownStep
);
