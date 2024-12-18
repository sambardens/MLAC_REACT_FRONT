const getGenresFromAudd = ({ mainGenres, genreNames }) => {
	let mainGenre = null;
	let secondaryGenre = null;
	if (mainGenres) {
		genreNames.forEach(el => {
			if (secondaryGenre) return;
			if (mainGenre && !secondaryGenre) {
				secondaryGenre =
					mainGenres?.find(genre => genre.name.toLowerCase().trim() === el.toLowerCase().trim()) || null;
			} else if (!mainGenre) {
				mainGenre =
					mainGenres?.find(genre => genre.name.toLowerCase().trim() === el.toLowerCase().trim()) || null;
			}
		});
	}
	return { mainGenre, secondaryGenre, subGenres: [] };
};

export default getGenresFromAudd;
