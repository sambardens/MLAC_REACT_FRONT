import axios from 'axios';
import getImageSrc from 'src/functions/utils/getImageSrc';

const getLandingPageByLinkNameWithoutThunk = async linkName => {
	try {
		const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/landing/page/?name=${linkName}`);
		if (data?.success) {
			const logo = getImageSrc(data?.landingPage?.logo, false);
			const favicon = getImageSrc(data?.landingPage?.favicon, false);
			const releaseLogo = getImageSrc(data?.landingPage?.releaseLogo, false);
			const trackIdForStreaming = data.landingPage?.trackIdForStreaming ? Number(data.landingPage?.trackIdForStreaming) : null;
			// const filteredTracks = data.landingPage.tracks?.filter(el => el.info?.status === 'success' && Number(el.price) > 0);

			const tracks = data.landingPage.tracks.map(el => ({
				...el,
				isSelected: false,
				price: Math.round(parseFloat(el.price) * 100) / 100,
				trackPreview: `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/cut_${el.uniqueName}`,
				trackFull: `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${el.uniqueName}`,
			}));
			return {
				success: true,
				landingInfo: { ...data.landingPage, logo, favicon, releaseLogo, tracks, trackIdForStreaming },
			};
		}
		return data;
	} catch (error) {
		console.log('getLandingPageByLinkName: ', error);
	}
};

export default getLandingPageByLinkNameWithoutThunk;
