import { instance } from 'store/operations';

async function confirmDeletionBap(token) {
	try {
		const res = await instance.delete(`/api/baps/confirm?token=${token}`);

		console.log('confirmDeletionBap success:', res);

		return res.data;
	} catch (e) {
		console.log('confirmDeletionBap error:', e);

		return e.response.data;
	}
}

export default confirmDeletionBap;
