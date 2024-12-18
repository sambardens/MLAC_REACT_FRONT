function getAccurateTooltipLabel(itemType, i) {
  if (itemType === 'color') {
    if (i === 0) {
      return 'Text color';
    }
    if (i === 1) {
      return 'Background color';
    }
    if (i === 2) {
      return 'Details color';
    }
  }

  if (itemType === 'font') {
    if (i === 0) {
      return 'General text style. Main titles styles';
    }
    if (i === 1) {
      return 'Second titles styles';
    }
    if (i === 2) {
      return 'Small text styles';
    }
  }
}

export default getAccurateTooltipLabel;
