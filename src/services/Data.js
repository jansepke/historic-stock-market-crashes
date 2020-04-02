const loadIndexData = async index => {
  if (index === "world") {
    return import(`../../data/world.json`);
  }
  if (index === "acwi") {
    return import(`../../data/acwi.json`);
  }
  if (index === "acwi-imi") {
    return import(`../../data/acwi-imi.json`);
  }
};

export const getIndexData = async index => {
  const data = await loadIndexData(index);

  console.log(`Index contains ${data.length} days of data`);

  return data.map(({ date, price }) => ({
    date: new Date(date),
    price: parseFloat(price)
  }));
};
