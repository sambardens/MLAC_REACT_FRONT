function isPaletteChecked(currentPalette, selectedPalette) {
	return currentPalette.colors.every((color, i) => color === selectedPalette?.colors[i]);
}

export default isPaletteChecked;
