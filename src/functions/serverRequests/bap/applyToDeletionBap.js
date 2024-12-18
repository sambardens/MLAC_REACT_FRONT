import { instance } from 'store/operations';

async function applyToDeletionBap(bapId, data) {
	let config = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/baps/${bapId}`,
		data,
	};

	try {
		const res = await instance.request(config);

		return res.data;
	} catch (e) {
		console.log('applyToDeletionBap error:', e);

		return e.response.data;
	}
}

export default applyToDeletionBap;
