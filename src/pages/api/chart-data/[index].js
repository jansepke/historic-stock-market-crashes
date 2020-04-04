export default async ({ query: { index } }, res) => {
  const data = await import(`../../../../index-data/chart-${index}.json`)
    .default;

  res.status(200).json(data);
};
