import { instance } from 'store/operations';

const getTracksByTrackNameAndByArtistName = async ({ trackName, artistName }) => {
	try {
		const { data } = await instance.get(
			`/api/spotify/tracks?trackName=${trackName}&artistName=${artistName}`,
		);

		return data;
	} catch (error) {
		console.log('getTracksByTrackNameAndByArtistName error: ', error);
	}
};

export default getTracksByTrackNameAndByArtistName;
