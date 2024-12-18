import { instance } from 'store/operations';

async function removeAccount() {
	const config = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/users/`,
	};

	try {
		const res = await instance.request(config);
		console.log('removeAccount success:', res);

		return res;
	} catch (e) {
		console.log('removeAccount error:', e);

		return e.response;
	}
}

export default removeAccount;
