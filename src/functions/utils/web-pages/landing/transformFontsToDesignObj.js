const transformFontsToDesignObj = (fonts, design) => {
	return {
		paletteName: design.paletteName,
		id: design.id,
		designBlocks: [
			{
				hex: design.designBlocks[0]?.hex || '#FFFFFF',
				font: fonts[0]?.font || 'Poppins',
				size: fonts[0]?.size || 32,
				weight: +fonts[0]?.weight || 600,
				italic: fonts[0]?.italic || '',
				landingDesignTypeId: 1,
			},
			{
				hex: design.designBlocks[1]?.hex || '#282727',
				font: fonts[1]?.font || 'Poppins',
				size: fonts[1]?.size || 18,
				weight: +fonts[1]?.weight || 500,
				italic: fonts[1]?.italic || '',
				landingDesignTypeId: 2,
			},
			{
				hex: design.designBlocks[2]?.hex || '#FF0151',
				font: fonts[2]?.font || 'Poppins',
				size: fonts[2]?.size || 12,
				weight: +fonts[2]?.weight || 400,
				italic: fonts[2]?.italic || '',
				landingDesignTypeId: 3,
			},
		],
	};
};

export default transformFontsToDesignObj;
