const transformPaletteToDesignObj = (palette, design) => {
	return {
		paletteName: palette.paletteName,
		id: palette.id,
		designBlocks: [
			{
				hex: palette.colors[0].hex,
				font: design.designBlocks[0].font,
				size: design.designBlocks[0].size,
				weight: +design.designBlocks[0].weight,
				italic: design.designBlocks[0].italic,
				landingDesignTypeId: 1,
			},
			{
				hex: palette.colors[1].hex,
				font: design.designBlocks[1].font,
				size: design.designBlocks[1].size,
				weight: +design.designBlocks[1].weight,
				italic: design.designBlocks[1].italic,
				landingDesignTypeId: 2,
			},
			{
				hex: palette.colors[2].hex,
				font: design.designBlocks[2].font,
				size: design.designBlocks[2].size,
				weight: +design.designBlocks[2].weight,
				italic: design.designBlocks[2].italic,
				landingDesignTypeId: 3,
			},
		],
	};
};

export default transformPaletteToDesignObj;
