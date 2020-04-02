const browserLanguage =
  window.navigator.language || window.navigator.userLanguage;
const dtf = new Intl.DateTimeFormat(browserLanguage, {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

export const formatDate = dtf.format;

export const formatDays = days => {
  if (isNaN(days)) {
    return "-";
  }
  return days >= 365 ? `${(days / 365).toFixed(1)}y` : `${days.toFixed()}d`;
};
