import { instance } from 'store/operations';

async function editSettingsReleaseShop(data, shopId, releaseId) {
	let config = {
		method: 'put',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/shops/release/settings?shopId=${shopId}&releaseId=${releaseId}`,
		data,
	};

	try {
		await instance.request(config);
	} catch (error) {
		console.log('editSettingsReleaseShop error: ', error);
	}
}

export default editSettingsReleaseShop;
