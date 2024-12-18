import compareArraysOfObjects from '../compareArraysOfObjects';

function nozmalize(data) {
	return {
		mainGenre: data.mainGenre?.id || '',
		secondaryGenre: data.secondaryGenre?.id || '',
		subGenres:
			data.subGenres.length > 0
				? [...data.subGenres.map(el => ({ id: el.id, mainGenreId: el.mainGenreId }))].sort(
						(a, b) => a.id - b.id,
				  )
				: '',
	};
}

function compareGenres(oldGenres, newGenres) {
	if (!oldGenres || !newGenres) return true;
	const oldData = nozmalize(oldGenres);
	const newData = nozmalize(newGenres);
	if (oldData.mainGenre !== newData.mainGenre) return true;
	if (oldData.secondaryGenre !== newData.secondaryGenre) return true;
	console.log('вызов функции >>>>>>> compareGenres');
	return compareArraysOfObjects(oldData.subGenres, newData.subGenres);
}

export default compareGenres;
