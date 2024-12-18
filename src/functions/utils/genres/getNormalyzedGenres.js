function getNormalyzedGenres(serverGenres) {
	const normalizeGenre = (genre, isSubGenre) => {
		let genreData;

		if (genre) {
			genreData = {
				id: genre.id,
				name: genre.name,
				label: genre.name,
				value: genre.name,
			};
			if (isSubGenre) {
				genreData.mainGenreId = genre.mainGenreId;
			}
		} else {
			genreData = '';
		}
		return genreData;
	};
	const subGenres =
		serverGenres?.sub_genres?.length > 0
			? serverGenres.sub_genres.map(genre => normalizeGenre(genre, true))
			: serverGenres?.subGenres?.length > 0
			? serverGenres?.subGenres.map(genre => normalizeGenre(genre, true))
			: [];

	const normalyzedGenresBap = {
		mainGenre: normalizeGenre(serverGenres.mainGenere),
		secondaryGenre: normalizeGenre(serverGenres.secondGeneres),
		subGenres,
	};

	return normalyzedGenresBap;
}

export default getNormalyzedGenres;
