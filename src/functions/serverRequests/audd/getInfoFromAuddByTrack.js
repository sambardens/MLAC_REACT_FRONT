const getInfoFromAuddByTrack = async (formData, uniqueName, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.put(
			`/api/tracks/release/audd?uniqueName=${uniqueName}`,
			formData,
			{
				signal: controller.signal,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);
		const result = data?.release?.result;
		const name =
			result?.apple_music?.albumName || result?.deezer?.album || result?.spotify?.album?.name;

		if (name) {
			let logo = '';
			const artwork = result?.apple_music?.artwork?.url;
			if (artwork) {
				const w = artwork?.width > 3000 ? 3000 : artwork?.width;
				const h = artwork?.height > 3000 ? 3000 : artwork?.height;
				logo = artwork?.url.replace('{w}', w).replace('{h}', h);
			}

			if (!logo) {
				logo = result?.deezer?.contributors[0]?.picture_xl || result?.spotify?.album?.images[0]?.url;
			}

			const genreNames = result?.apple_music?.genreNames;

			if (genreNames) {
				const indexToRemove = genreNames.indexOf('Music');
				if (indexToRemove !== -1) {
					genreNames.splice(indexToRemove, 1);
				}
			}

			const deezerLink =
				result?.deezer?.contributors[0]?.link || result?.deezer?.contributors[0]?.share;
			const songLink = result?.song_link;
			const spotifyLink = result?.spotify?.album?.external_urls?.spotify;
			const appleMusicLink = result?.apple_music?.url;
			const releaseDate = result?.release_date;
			const type = result?.deezer?.album?.type || result?.spotify?.album?.album_type;
			const label = result?.label;
			return {
				success: true,
				releaseData: { name, logo, auddSocialLink: deezerLink, releaseDate, genreNames, type, label },
				releaseSpotifyId: result?.spotify?.album?.id,
				artists: result?.spotify?.artists,
			};
		}
		return { success: false };
	} catch (error) {
		console.log('getInfoFromAuddByTrack: ', error);
	}
};

export default getInfoFromAuddByTrack;
