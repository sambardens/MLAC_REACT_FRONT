export const getColorByIndex = index => {
	if (index === 0) {
		return 'accent';
	} else if (index === 1) {
		return 'black';
	} else if (index === 2) {
		return 'brand.blue';
	} else if (index === 3) {
		return 'brand.stateGray';
	} else {
		return 'bg.secondary';
	}
};
