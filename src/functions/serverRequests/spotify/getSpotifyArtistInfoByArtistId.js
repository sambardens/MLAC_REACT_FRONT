import { instance } from 'store/operations';

const getSpotifyArtistInfoByArtistId = async artistId => {
	try {
		const { data } = await instance.get(`/api/baps/spotify/${artistId}`);

		return data;
	} catch (error) {
		console.log('getSpotifyArtistInfoByArtistId error: ', error);
	}
};

export default getSpotifyArtistInfoByArtistId;
