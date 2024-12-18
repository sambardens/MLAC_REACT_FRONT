import { instance } from 'store/operations';

async function removeTrackFromBasket(shopId, data) {
	let config = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/customers/shops/basket/${shopId}`,
		data,
	};

	try {
		const res = await instance.request(config);
		console.log('removeTrackFromBasket success:', res);

		return res.data;
	} catch (error) {
		console.log('removeTrackFromBasket error:', error);

		return error.response.data;
	}
}

export default removeTrackFromBasket;
