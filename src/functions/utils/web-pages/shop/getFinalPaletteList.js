import isPaletteChecked from './isPaletteSelected';

function getFinalPaletteList(initialPalettes, selectedPalette) {
	const isSelectedPaletteAlreadyInList = initialPalettes.some(pal => {
		return isPaletteChecked(pal, selectedPalette);
	});

	if (isSelectedPaletteAlreadyInList) {
		return initialPalettes;
	}

	if (!isSelectedPaletteAlreadyInList) {
		const paletteListWithPaletteFromShop = [selectedPalette, ...initialPalettes];

		return paletteListWithPaletteFromShop;
	}

	console.log(isSelectedPaletteAlreadyInList, 'isSelectedPaletteAlreadyInList');
}

export default getFinalPaletteList;
