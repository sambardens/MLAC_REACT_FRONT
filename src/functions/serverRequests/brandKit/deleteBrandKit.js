import { instance } from 'store/operations';

async function deleteBrandKit(brandId) {
	try {
		const res = await instance.delete(`/api/brands/${brandId}`);

		console.log('editBrandInfoRequest success:', res);
		return res.data;
	} catch (e) {
		console.log('editBrandInfoRequest error:', e);
	}
}

export default deleteBrandKit;
