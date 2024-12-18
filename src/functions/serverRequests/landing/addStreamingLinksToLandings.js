import { instance } from 'store/operations';

const addStreamingLinksToLandings = async ({ landingPageId, data }) => {
	try {
		const res = await instance.post(`/api/landing/page/streaming/${landingPageId}`, { data });
		return { success: true, socialLinks: res.data.socialLinks };
	} catch (error) {
		console.log('addStreamingLinksToLandings error: ', error);
	}
};

export default addStreamingLinksToLandings;
