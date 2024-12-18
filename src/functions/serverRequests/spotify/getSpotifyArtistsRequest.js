import { instance } from 'store/operations';

const getSpotifyArtistsRequest = async name => {
	const config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/spotify?name=${name}`,
	};

	try {
		const { data } = await instance.request(config);
		return data.baps;
	} catch (e) {
		console.log('getSpotifyArtistsRequest error:', e);
	}
};

export default getSpotifyArtistsRequest;
