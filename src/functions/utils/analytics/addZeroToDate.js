function addZeroToDate(date) {
  const dateStting = String(date);

  return dateStting.length === 1 ? `0${dateStting}` : dateStting;
}

export default addZeroToDate;
