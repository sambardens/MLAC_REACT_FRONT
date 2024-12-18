import getImageSrc from 'src/functions/utils/getImageSrc';
import {
	setIsLoading,
	setOrderArtists,
	setOrderReleases,
	setOrders,
} from 'store/downloads/downloads-slice';

function getUniqueTracks(tracks) {
	const uniqueTracks = [];
	tracks.forEach(track => {
		const isDuplicate = uniqueTracks.find(el => el?.id === track.id);
		if (!isDuplicate) {
			uniqueTracks.push(track);
		}
	});
	return uniqueTracks;
}

const convertReleases = (orders, dispatch) => {
	const allReleases = [];
	orders?.map(order => {
		order?.releases?.forEach(itemRelease => {
			allReleases?.push({ ...itemRelease, bapName: order?.name });
		});
	});

	const result = [];
	let releaseId = 1;

	allReleases?.forEach(itemRelease => {
		const { name, logo, thumbnail, tracks, bapName, id } = itemRelease;
		let releaseObj = result.find(obj => obj?.id === id);
		const artworkMin = getImageSrc(thumbnail);
		const artwork = getImageSrc(logo);
		if (!releaseObj) {
			releaseObj = {
				releaseId,
				name,
				releaseLogo: artworkMin,
				artwork,
				band: bapName,
				tracks: [],
			};
			result.push(releaseObj);
			releaseId++;
		}

		tracks?.map(itemTrack => {
			itemTrack &&
				releaseObj?.tracks?.push({
					trackName: itemTrack.name,
					trackId: itemTrack.id,
					artistName: bapName,
					trackLogo: artworkMin,
					artwork,
					src: `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${itemTrack?.uniqueName}`,
				});
		});
	});
	dispatch(setIsLoading(false));
	dispatch(setOrderReleases(result));
};

const getTracksByBapName = (orders, dispatch) => {
	const result = [];
	const bapNames = {};
	let artistId = 1;

	for (const order of orders) {
		const { name, avatar, releases } = order;
		const artwork = getImageSrc(avatar, false);
		if (!bapNames.hasOwnProperty(name)) {
			bapNames[name] = {
				artistName: name,
				artistAvatar: artwork,
				artwork,
				artistId,
				tracks: [],
			};
			result.push(bapNames[name]);
			artistId++;
		}

		releases?.map(itemRelease => {
			itemRelease?.tracks?.forEach(item => {
				const artworkMin = getImageSrc(itemRelease?.thumbnail, false);
				const artwork = getImageSrc(itemRelease?.logo, false);
				bapNames[name].tracks.push({
					trackName: item?.name,
					trackId: item?.id,
					artistName: name,
					trackLogo: artworkMin,
					artwork,
					src: `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${item?.uniqueName}`,
				});
			});
		});
	}
	dispatch(setIsLoading(false));
	dispatch(setOrderArtists(result));
};

const convertTracks = baps => {
	const allTracks = [];
	baps.map(bap => {
		bap?.releases?.map(release => {
			release?.tracks?.map(track => {
				const artworkMin = getImageSrc(release?.thumbnail, false);
				const artwork = getImageSrc(release?.logo, false);
				return allTracks.push({
					trackId: track?.id,
					trackName: track?.name,
					src: `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${track?.uniqueName}`,
					trackLogo: artworkMin,
					artwork,
					artistName: bap?.name,
				});
			});
		});
	});

	return allTracks;
};

const getOrdersRequest = async (axiosPrivate, dispatch) => {
	dispatch(setIsLoading(true));
	const controller = new AbortController();
	try {
		const res = await axiosPrivate.get('/api/customers/orders/', {
			signal: controller.signal,
		});

		if (res?.data?.orders) {
			const orders = getUniqueTracks(res?.data?.orders);
			console.log('orders: ', orders);
			const convertedTracks = convertTracks(orders);
			console.log('convertedTracks: ', convertedTracks);
			dispatch(setOrders(convertedTracks));
			convertReleases(orders, dispatch);
			getTracksByBapName(orders, dispatch);
		}
	} catch (error) {
		console.log('getOrdersRequest error:', error);
		dispatch(setIsLoading(false));
	}
};

export default getOrdersRequest;
