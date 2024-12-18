import { instance } from 'store/operations';

async function paymentForTracks(data, shopId) {
	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/customers/payment/?purchaseLocationTypeId=1&purchaseLocationId=${shopId}`,
		data,
	};

	try {
		const res = await instance.request(config);
		console.log('paymentForTracks success', res);

		return res.data;
	} catch (error) {
		console.log('paymentForTracks error', error);

		return error.resonse.message;
	}
}

export default paymentForTracks;
