const defaultFonts = [
	{
		id: 1,
		title: 'Header',
		hex: '#FFFFFF',
		font: 'Poppins',
		size: 32,
		weight: '600',
		italic: '',
		landingDesignTypeId: 1,
	},
	{
		title: 'Subtitle',
		id: 2,
		hex: '#282727',
		font: 'Poppins',
		size: 18,
		weight: '500',
		italic: '',
		landingDesignTypeId: 2,
	},
	{
		title: 'Buttons',
		id: 3,
		hex: '#FF0151',
		font: 'Poppins',
		size: 14,
		weight: '400',
		italic: '',
		landingDesignTypeId: 3,
	},
];

function prepareFonts(preparedBrankKit) {
	return preparedBrankKit?.fonts?.length ? preparedBrankKit?.fonts : defaultFonts;
}

export default prepareFonts;
