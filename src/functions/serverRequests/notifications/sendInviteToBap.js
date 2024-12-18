import { instance } from 'store/operations';

async function sendInviteToBap(data, bapId) {
	const config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/baps/invite/${bapId}`,
		data,
	};

	try {
		const res = await instance.request(config);
		console.log('sendInviteToBap success', res);

		return res.data;
	} catch (e) {
		console.log('sendInviteToBap error', e);

		return e.response.data;
	}
}

export default sendInviteToBap;
