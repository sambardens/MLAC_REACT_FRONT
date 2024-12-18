export const maxAllowedSizeError = file => {
	const maxAllowedSize = 10 * 1024 * 1024;
	const minAllowedSize = 100 * 1024;
	const fileSize = file?.size;

	if (fileSize < maxAllowedSize && fileSize > minAllowedSize) {
		return false;
	}
	return true;
};

export const maxWidthAndHeightError = (
	file,
	minW = 1400,
	minH = 1400,
	maxW = 4000,
	maxH = 4000,
) => {
	return new Promise((resolve, reject) => {
		let img = new Image();

		img.src = window.URL.createObjectURL(file);
		img.onload = () => {
			if (
				img.width === img.height &&
				img.width >= minW &&
				img.height >= minH &&
				img.width <= maxW &&
				img.height <= maxH
			) {
				resolve(false);
			} else {
				resolve(true);
			}
		};
		img.onerror = reject;
	});
};

export const maxWidthAndHeightErrorInCanva = url => {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = url;
		img.onload = () => {
			if (img.width === img.height) {
				resolve(false);
			} else {
				resolve(true);
			}
		};
		img.onerror = reject;
	});
};
