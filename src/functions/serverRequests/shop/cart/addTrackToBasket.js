import { instance } from 'store/operations';

async function addTrackToBasket({ shopId, trackIds }) {
	try {
		const res = await instance.post(`/api/customers/shops/basket/${shopId}`, { trackIds });

		return res.data;
	} catch (error) {
		console.log('addTrackToBasket error:', error);

		return error.response.data;
	}
}

export default addTrackToBasket;
