function getAccurateTitle(i) {
	if (i === 1) {
		return 'Header';
	}

	if (i === 2) {
		return 'Subtitle';
	}

	if (i === 3) {
		return 'Buttons';
	}
}

function prepareDesignFromRes(design) {
	const sortedDesign = design.sort((a, b) => a.shopDesignTypeId - b.shopDesignTypeId);

	const praparedPalette = {
		name: 'Shop palette',
		id: 1,
		colors: [sortedDesign[0]?.hex, sortedDesign[1]?.hex, sortedDesign[2]?.hex],
	};

	const preparedFonts = sortedDesign.map((fontObj, i) => {
		const preparedFont = {
			id: i + 1,
			title: getAccurateTitle(i + 1),
			font: fontObj.font,
			size: fontObj.size,
			weight: String(fontObj.weight),
			italic: fontObj.italic ? 'italic' : '',
			landingDesignTypeId: i + 1,
		};

		return preparedFont;
	});

	return [praparedPalette, preparedFonts];
}

export default prepareDesignFromRes;
