import { instance } from 'store/operations';

const getAllLandingPagesLinkName = async () => {
	try {
		const { data } = await instance.get('/api/landing/linkName');
		return data;
	} catch (error) {
		console.log('addDesignToLanding error: ', error);
	}
};

export default getAllLandingPagesLinkName;
