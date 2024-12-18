const getInfoFromAuddByPreviewUrl = async (previewUrl, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.post(
			'/api/tracks/release/platforms',
			{ previewUrl },
			{
				signal: controller.signal,
			},
		);
		return data;
	} catch (error) {
		console.log('getInfoFromAuddByPreviewUrl: ', error);
	}
};

export default getInfoFromAuddByPreviewUrl;
