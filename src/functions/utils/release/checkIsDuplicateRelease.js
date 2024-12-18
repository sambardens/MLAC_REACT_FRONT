const checkIsDuplicateRelease = releases => {
	const sortedReleases = [...releases].sort((a, b) => a.createdAt - b.createdAt);
	const resultArray = [];

	sortedReleases.forEach(item => {
		if (item.releaseSpotifyId === null) {
			resultArray.push({ ...item, isDuplicate: false });
		} else if (resultArray.find(el => el.releaseSpotifyId === item.releaseSpotifyId)) {
			resultArray.push({ ...item, isDuplicate: true });
		} else {
			resultArray.push({ ...item, isDuplicate: false });
		}
	});
	const res = [...resultArray].sort((a, b) => {
		const dateA = new Date(a.releaseDate);
		const dateB = new Date(b.releaseDate);
		return dateB - dateA;
	});

	return res;
};
export default checkIsDuplicateRelease;
