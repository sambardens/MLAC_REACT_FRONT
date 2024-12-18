import { instance } from 'store/operations';

async function checkNotifications(data, token) {
	try {
		const res = await instance.put(`/api/notifications/?token=${token}`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		console.log('checkNotifications success:', res);

		return res.data;
	} catch (e) {
		console.log('checkNotifications error:', e);

		return e.response.data;
	}
}

export default checkNotifications;
