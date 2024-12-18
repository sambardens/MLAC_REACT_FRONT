import { instance } from 'store/operations';

async function addDesignToShop(data, shopId) {
	try {
		const res = await instance.post(`/api/shops/design?shopId=${shopId}`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return res.data.design;
	} catch (e) {
		console.log('addDesignToShop error', e);
	}
}

export default addDesignToShop;
