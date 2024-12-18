import { instance } from 'store/operations';

async function getTracksFromBasket(shopId) {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/customers/shops/basket/${shopId}`,
	};

	try {
		const res = await instance.request(config);

		return res.data;
	} catch (error) {
		console.log('getTracksFromBasket error:', error);

		return error?.response?.data;
	}
}

export default getTracksFromBasket;
