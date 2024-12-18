function getFilteredItemsByRelease(items, releaseFilter) {
	if (!releaseFilter.track && !releaseFilter.release) {
		return items;
	}

	const { release, track } = releaseFilter;

	if (!track) {
		const filteredItems = items.filter(item => item.releaseName === release.name);
		return filteredItems;
	}

	const filteredItems = items.filter(item => item.trackId === track.id);
	return filteredItems;
}

export default getFilteredItemsByRelease;
