import getTracksInDeals from 'src/functions/serverRequests/shop/getTracksInDeals';
import prepareReleasesWithActualTracks from 'src/functions/serverRequests/shop/releases/prepareReleasesWithActualTracks';
import prepareShop from 'src/functions/serverRequests/shop/shopPreparers/prepareShop';
import prepareDesignFromRes from 'src/functions/utils/web-pages/shop/prepareDesignFromRes';

const getPreparedShop = async (resData, axiosPrivate, releaseId = null) => {
	const tracksInDeals = await getTracksInDeals(resData.shop.bapId);
	if (!tracksInDeals || tracksInDeals?.length === 0) {
		return { success: false, error: "Can't find tracks in split or active contract" };
	}
	const preparedShopPromise = prepareShop(resData.shop);
	const preparedShopReleasesPromise = prepareReleasesWithActualTracks(
		resData.releases,
		axiosPrivate,
		tracksInDeals,
	);

	const [preparedShop, preparedShopReleases] = await Promise.all([
		preparedShopPromise,
		preparedShopReleasesPromise,
	]);

	let selectedRelease = null;
	if (releaseId) {
		selectedRelease = preparedShopReleases.find(rel => Number(rel.id) === Number(releaseId));
	}

	const design = prepareDesignFromRes(resData.design);
	const shopData = {
		...preparedShop,
		shopReleasesFromServer: preparedShopReleases,
		selectedShopReleases: preparedShopReleases,
		selectedRelease,
		selectedPalette: design[0],
		selectedFonts: design[1],
	};
	return { success: true, shopData };
};

export default getPreparedShop;
