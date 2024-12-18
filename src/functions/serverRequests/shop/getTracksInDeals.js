import getBapDeals from './getBapDeals';

const getTracksInDeals = async bapId => {
	const splitsAndContracts = await getBapDeals({ bapId });
	return splitsAndContracts
		.filter(el => el.status === 1)
		.map(el => el.splitTracks)
		.flat();
};

export default getTracksInDeals;
