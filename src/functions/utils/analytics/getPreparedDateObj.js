function getPreparedDateObj(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = date.toTimeString().slice(0, 8);
  const hour = Number(date.toTimeString().slice(0, 2));

  return {
    year, month, day, hour, time,
  };
}

export default getPreparedDateObj;
