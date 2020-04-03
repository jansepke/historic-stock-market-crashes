export const getIndexData = async index => {
  const data = await import(`../../data/${index}.json`);

  console.log(`Index contains ${data.data.length} days of data`);

  return data.data.map(({ date, price }) => ({
    date: new Date(date),
    price: parseFloat(price)
  }));
};
