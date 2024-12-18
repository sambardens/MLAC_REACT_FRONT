function getPictureDependingOnSocialNetwork(url) {
	if (url) {
		const normalyzedUrl = url.toLowerCase();

		if (normalyzedUrl.includes('instagram')) {
			return '/assets/images/instagram_icon.png';
		}

		if (normalyzedUrl.includes('facebook')) {
			return '/assets/images/facebook.png';
		}

		if (normalyzedUrl.includes('twitter')) {
			return '/assets/images/twitter_icon.png';
		}

		if (normalyzedUrl.includes('spotify')) {
			return '/assets/images/spotify_icon.png';
		}

		if (normalyzedUrl.includes('youtube')) {
			return '/assets/images/youtube_red.png';
		}
	}

	return '/assets/images/url_icon.png';
}

export default getPictureDependingOnSocialNetwork;
