const checkFeatureArtists = ({ oldArtists, newArtists }) => {
	const artistsToDelete = [];
	const artistsToAdd = [];
	const currentArtists = [];

	// Создайте объект, где ключ - это spotifyId, а значение - соответствующий элемент oldArtists
	const initialArrMap = oldArtists.reduce((map, item) => {
		map[item.spotifyId] = item;
		return map;
	}, {});

	newArtists.forEach(newItem => {
		if (initialArrMap[newItem.id]) {
			currentArtists.push(initialArrMap[newItem.id]);
		} else {
			artistsToAdd.push(newItem);
		}
	});

	oldArtists.forEach(item => {
		if (!newArtists.find(newItem => newItem.id === item.spotifyId)) {
			artistsToDelete.push(item);
		}
	});

	return { artistsToDelete, artistsToAdd, currentArtists };
};

export default checkFeatureArtists;
