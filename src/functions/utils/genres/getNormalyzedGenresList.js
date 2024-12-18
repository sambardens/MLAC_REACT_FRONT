function getNormalyzedGenresList(genres = []) {
	const normalyzedGenres = genres?.map(genre => {
		if (genre.subGenreName || genre.name) {
			const normalyzedGenre = {
				...genre,
				value: genre.subGenreName || genre.name,
				label: genre.subGenreName || genre.name,
			};
			return normalyzedGenre;
		}

		// спотифай
		const normalyzedGenre = {
			value: genre,
			label: genre,
		};

		return normalyzedGenre;
	});

	return normalyzedGenres;
}

export default getNormalyzedGenresList;
