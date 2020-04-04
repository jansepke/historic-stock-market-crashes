export default async ({ query: { index } }, res) => {
  const data = await import(`../../../../index-data/chart-${index}.json`);

  res.status(200).json(data.data);
};
