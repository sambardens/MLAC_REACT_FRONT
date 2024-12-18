const geLandingPalette = theme => {
	return {
		paletteName: theme.paletteName,
		id: theme.id,
		colors: theme.designBlocks.map(el => ({ id: el.landingDesignTypeId, hex: el.hex })),
	};
};

export default geLandingPalette;
