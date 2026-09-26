export const calculateExperience = (startDate) => {
  if (!startDate) {
    return {
      years: 0,
      months: 0,
      text: "0 years",
    };
  }

  const start = new Date(startDate);
  const now = new Date();

  if (isNaN(start.getTime())) {
    return {
      years: 0,
      months: 0,
      text: "0 years",
    };
  }

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  // Current day is before career start day
  if (now.getDate() < start.getDate()) {
    months--;
  }

  // Adjust negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  years = Math.max(years, 0);
  months = Math.max(months, 0);

  let text = "";

  if (years > 0) {
    text += `${years} year${years !== 1 ? "s" : ""}`;
  }

  if (months > 0) {
    if (text) text += " ";
    text += `${months} month${months !== 1 ? "s" : ""}`;
  }

  if (!text) {
    text = "0 months";
  }

  return {
    years,
    months,
    text,
  };
};