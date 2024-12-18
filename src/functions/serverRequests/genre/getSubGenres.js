import { instance } from 'store/operations';

async function getSubGenres(firstId, secondId) {
	let params = new URLSearchParams();

	if (firstId) {
		params.append('firstGenreId', `${firstId}`);
	}

	if (secondId) {
		params.append('secondGenreId', `${secondId}`);
	}

	try {
		const { data } = await instance.get(`/api/genres/sub`, {
			params,
		});

		return data.subGenres;
	} catch (e) {
		console.log('getSubGenres error:', e);
	}
}

export default getSubGenres;
