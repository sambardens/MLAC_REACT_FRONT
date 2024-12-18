import evearaGenres from '@/assets/evearaGenres.json';

import compareArrays from '../compareArrays';

const getReleaseGenresEveara = ({ mainGenre, secondaryGenre, subGenres }) => {
	const genres = [];
	const addNewGenre = genre => {
		const foundedGenre = evearaGenres.find(el => el.name.toLowerCase() === genre.toLowerCase());
		if (foundedGenre) {
			genres.push(Number(foundedGenre.genre_id));
		}
	};

	if (mainGenre) {
		addNewGenre(mainGenre.name);
	}
	if (secondaryGenre) {
		addNewGenre(secondaryGenre.name);
	}
	if (subGenres?.length > 0) {
		subGenres.forEach(subGenre => addNewGenre(subGenre.name));
	}
	return genres;
};

const getReleaseNewGenresEveara = ({ evearaGenreIdsArr, mainGenre, secondaryGenre, subGenres }) => {
	const evearaReleaseGenres = getReleaseGenresEveara({ mainGenre, secondaryGenre, subGenres });
	const isEqual = compareArrays(evearaGenreIdsArr, evearaReleaseGenres);

	if (!isEqual) {
		const res = '[' + evearaReleaseGenres.join(', ') + ']';
		return res;
	}
};

export default getReleaseNewGenresEveara;
