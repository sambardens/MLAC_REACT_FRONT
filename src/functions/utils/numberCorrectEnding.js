export const numberCorrectEnding = (number, arrStr) => {
  if (number % 10 === 1 && number !== 11) {
    return arrStr[0];
  }
  if ([2, 3, 4].includes(number % 10) && Math.trunc(number / 10) !== 1) {
    return arrStr[1];
  }
  return arrStr[2];
};
