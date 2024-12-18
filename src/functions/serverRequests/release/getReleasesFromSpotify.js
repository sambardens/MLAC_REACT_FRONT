import { instance } from 'store/operations';

const getReleasesFromSpotify = async query => {
	try {
		const { data } = await instance.get(`/api/spotify/releases?name=${query}`);
		return data;
	} catch (error) {
		console.log('getReleasesFromSpotify error: ', error);
	}
};

export default getReleasesFromSpotify;
