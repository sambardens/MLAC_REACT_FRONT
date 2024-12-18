function checkIsMainInfoUpdated(prevBap, updatedBap) {
	if (prevBap.bapName !== updatedBap.bapName?.trim()) return true;

	if (
		prevBap.bapDescription !== updatedBap.bapDescription?.trim() &&
		!(prevBap.bapDescription === null && !updatedBap.bapDescription?.trim())
	)
		return true;

	if (
		prevBap.bapArtistBio !== updatedBap.bapArtistBio?.trim() &&
		!(prevBap.bapArtistBio === null && !updatedBap.bapArtistBio?.trim())
	)
		return true;
	if (prevBap.src !== updatedBap.src) return true;

	if (prevBap.spotifyId !== updatedBap.spotifyId) return true;
	if (prevBap.country !== updatedBap.country) return true;

	return false;
}

export default checkIsMainInfoUpdated;
