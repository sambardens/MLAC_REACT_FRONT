const getAccurateCartText = (itemsNumber) => {
  if (itemsNumber === 1) {
    return 'Buy 1 item';
  }

  if (itemsNumber > 1) {
    return `Buy ${itemsNumber} items`;
  }
};

export default getAccurateCartText;
