const getLandingFonts = design => {
	return design.designBlocks.map(el => ({
		title:
			el.landingDesignTypeId === 1 ? 'Header' : el.landingDesignTypeId === 2 ? 'Subtitle' : 'Buttons',
		font: el.font,
		size: el.size,
		weight: el.weight.toString(),
		italic: el.italic ? 'italic' : '',
		id: el.landingDesignTypeId,
	}));
};

export default getLandingFonts;
