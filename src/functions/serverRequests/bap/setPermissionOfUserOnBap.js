import { instance } from 'store/operations';

async function setPermissionOfUserOnBap(bapId, data) {
	const config = {
		method: 'put',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/baps/admin/${bapId}`,
		data,
	};

	try {
		const res = await instance.request(config);

		console.log('setPermissionOfUserOnBap success:', res);

		return res.data;
	} catch (e) {
		console.log('setPermissionOfUserOnBap success:', e);

		return e.response.data;
	}
}

export default setPermissionOfUserOnBap;
