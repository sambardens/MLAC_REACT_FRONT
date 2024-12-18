import { instance } from 'store/operations';

const getAllShopsLinkName = async () => {
	try {
		const { data } = await instance.get('/api/shops/linkName');
		return data;
	} catch (error) {
		console.log('addDesignToLanding error: ', error);
	}
};

export default getAllShopsLinkName;
