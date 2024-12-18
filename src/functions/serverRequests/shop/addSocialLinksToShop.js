import { instance } from 'store/operations';

const addSocialLinksToShop = async ({ shopId, data }) => {
	try {
		const res = await instance.post(`/api/shops/social/${shopId}`, { data });
		return { success: true, socialLinks: res.data.socialLinks };
	} catch (error) {
		console.log('addSocialLinksToShop error: ', error);
	}
};

export default addSocialLinksToShop;
