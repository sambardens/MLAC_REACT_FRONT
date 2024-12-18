import evearaGenres from '@/assets/evearaGenres.json';

const nozmalize = genre => {
	const value = genre.genre_id;
	return {
		id: value,
		label: genre.name,
		value: value,
	};
};

const getNormalyzedEvearaGenres = evearaGenreIds => {
	const genres = [];
	if (evearaGenreIds?.length > 0) {
		evearaGenreIds.forEach(id => {
			const newGenre = evearaGenres.find(genre => genre.genre_id === id);
			if (newGenre) {
				const nozmalizedGenre = nozmalize(newGenre);
				genres.push(nozmalizedGenre);
			}
		});
	}
	return genres;
};

export default getNormalyzedEvearaGenres;
