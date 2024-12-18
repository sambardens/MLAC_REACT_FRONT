import normalyzeBrandKitPalette from './normalyzeBrandKitPalette';

const defaultPalette = {
	name: 'Major Labl theme',
	id: 0,
	colors: ['#FFFFFF', '#282727', '#FF0151'],
};

function prepareInitialPalette(brandKitPalette = []) {
	const normalyzedBrandKitPalette = normalyzeBrandKitPalette(brandKitPalette);
	const preparedPalette = [...normalyzedBrandKitPalette, defaultPalette];

	return preparedPalette;
}

export default prepareInitialPalette;
