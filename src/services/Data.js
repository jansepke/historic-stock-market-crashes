const loadIndexData = async index => {
  if (index === "msci-world") {
    return import(`../../data/msci-world.json`);
  }
  if (index === "msci-acwi") {
    return import(`../../data/msci-acwi.json`);
  }
  if (index === "msci-acwi-imi") {
    return import(`../../data/msci-acwi-imi.json`);
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
