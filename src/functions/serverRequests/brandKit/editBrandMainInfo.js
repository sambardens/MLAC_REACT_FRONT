import { instance } from 'store/operations';

async function editBrandMainInfo(brandId, formData) {
	try {
		const res = await instance.put(`/api/brands/${brandId}`, formData);

		console.log('editBrandInfoRequest success:', res);
		return res.data;
	} catch (e) {
		console.log('editBrandInfoRequest error:', e);
	}
}

export default editBrandMainInfo;
