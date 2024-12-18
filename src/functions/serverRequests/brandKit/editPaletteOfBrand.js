import { instance } from 'store/operations';

async function editPaletteOfBrand(brandId, formData) {
	try {
		const res = await instance.put(
			`${process.env.NEXT_PUBLIC_URL}/api/brands/palette/${brandId}`,
			formData,
		);

		console.log('editPaletteOfBrandRequest success:', res);
		return res.data;
	} catch (e) {
		console.log('editPaletteOfBrandRequest error:', e);
	}
}

export default editPaletteOfBrand;
