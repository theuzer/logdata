const format = (number) => {
  if (number.toString().length === 1) {
    return `0${number.toString()}`;
  }
  return number;
};

exports.getDateString = m => `${m.year()}-${format(m.month() + 1)}-${format(m.date())}T${format(m.hour())}:${format(m.minute())}:00Z`;

exports.getIndividualDateFields = (dateString) => {
  const date = dateString.split('T');
  const date1 = date[0].split('-');
  const date2 = date[1].slice(0, -1).split(':');
  return {
    year: Number(date1[0]),
    month: Number(date1[1]),
    day: Number(date1[2]),
    hour: Number(date2[0]),
    minute: Number(date2[1]),
    second: Number(date2[2]),
  };
};
