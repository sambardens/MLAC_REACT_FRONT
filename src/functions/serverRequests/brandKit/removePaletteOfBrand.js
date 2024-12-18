import { instance } from 'store/operations';

async function removePaletteOfBrand(brandId, title) {
	try {
		const res = await instance.delete(
			`${process.env.NEXT_PUBLIC_URL}/api/brands/palette/${brandId}`,
			{
				data: {
					brandPaletteName: title,
				},
			},
		);

		console.log('removePaletteOfBrandRequest success:', res);
		return res.data;
	} catch (e) {
		console.log('removePaletteOfBrandRequest error:', e);
	}
}

export default removePaletteOfBrand;
