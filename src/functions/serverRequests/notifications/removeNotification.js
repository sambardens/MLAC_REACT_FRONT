import { instance } from 'store/operations';

async function removeNotification(notId) {
	try {
		const res = await instance.delete(`/api/notifications/${notId}`);

		console.log('removeNotification success:', res);

		return res.data;
	} catch (e) {
		console.log('removeNotification error:', e);
	}
}

export default removeNotification;
