import { instance } from 'store/operations';

function removeReleaseFromShop(shopId, releaseId) {
	let config = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/shops/release/${shopId}?releaseId=${releaseId}`,
	};

	try {
		const res = instance.request(config);

		console.log('removeReleaseFromShop success', res);
	} catch (error) {
		console.log('removeReleaseFromShop error', error);
	}
}

export default removeReleaseFromShop;
