const dtf = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

const minPercent = 20;
const msToDays = 1 / 60 / 60 / 24 / 1000;

(async () => {
  const response = await fetch("data/world.json");
  let data = await response.json();

  let lastPeak = { price: 0 },
    lastTrough = { price: 0 };

  data = data.map(({ date, price }) => ({
    date: new Date(date),
    price: parseFloat(price)
  }));

  const checkDrawdown = (newPeak = {}) => {
    const percent = (1 - lastTrough.price / lastPeak.price) * 100;
    if (percent > minPercent) {
      const daysDown = (lastTrough.date - lastPeak.date) * msToDays;
      const daysDone = (newPeak.date - lastPeak.date) * msToDays;

      const table = document.getElementById("result");
      let row = table.insertRow();
      row.insertCell().append(dtf.format(lastPeak.date));
      row.insertCell().append(dtf.format(lastTrough.date));
      row.insertCell().append(daysDown.toFixed());
      row.insertCell().append(-percent.toFixed());
      row.insertCell().append(daysDone.toFixed());
    }
  };

  for (const entry of data) {
    if (entry.price > lastPeak.price) {
      checkDrawdown(entry);
      lastPeak = entry;
      lastTrough = entry;
    } else if (entry.price < lastTrough.price) {
      lastTrough = entry;
    }
  }

  checkDrawdown();
})();
