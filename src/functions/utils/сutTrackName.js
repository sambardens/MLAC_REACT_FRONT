const trackVersions = ['acoustic', 'live', 'edit', 'version', 'remix', 'demo', 'club'];

function cutTrackName(trackName) {
	const parts = trackName.split('-').map(part => part.trim());

	if (parts.length >= 2) {
		const lastPart = parts[parts.length - 1].toLowerCase();
		const words = lastPart.split(' ');

		for (const word of words) {
			if (trackVersions.includes(word.toLowerCase())) {
				parts.splice(parts.length - 1, 1);
			}
		}
	}

	const res = parts.join(' ');
	const words = res.split('(').map(part => part.trim());

	if (words.length >= 2) {
		return words[0];
	}
	return res;
}
export default cutTrackName;
