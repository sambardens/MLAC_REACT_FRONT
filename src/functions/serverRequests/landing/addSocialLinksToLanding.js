import { instance } from 'store/operations';

const addSocialLinksToLanding = async ({ landingPageId, data }) => {
	try {
		const res = await instance.post(`/api/landing/page/social/${landingPageId}`, { data });
		return { success: true, socialLinks: res.data.socialLinks };
	} catch (error) {
		console.log('addSocialLinksToLanding error: ', error);
	}
};

export default addSocialLinksToLanding;
