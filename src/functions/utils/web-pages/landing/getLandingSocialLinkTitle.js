function getLandingSocialLinkTitle(url) {
	if (url) {
		const normalyzedUrl = url.toLowerCase();

		if (normalyzedUrl.includes('instagram')) {
			return 'Listen on Instagram';
		}

		if (normalyzedUrl.includes('facebook')) {
			return 'Listen on Facebook';
		}

		if (normalyzedUrl.includes('twitter')) {
			return 'Listen on Twitter';
		}

		if (normalyzedUrl.includes('spotify')) {
			return 'Listen on Spotify';
		}

		if (normalyzedUrl.includes('youtube')) {
			return 'Listen on YouTube';
		}

		if (normalyzedUrl.includes('deezer')) {
			return 'Listen on Deezer';
		}

		return 'Listen';
	}
}

export default getLandingSocialLinkTitle;
