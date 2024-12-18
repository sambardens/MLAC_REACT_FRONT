import { instance } from 'store/operations';

const addOneDesignToLanding = async ({ designData, landingPageId }) => {
	try {
		const { data } = await instance.post(
			`/api/landing/design?landingPageId=${landingPageId}`,
			designData,
		);
		return data.design;
	} catch (error) {
		console.log('addDesignToLanding error: ', error);
	}
};

const addDesignToLanding = async ({ designBlocks, landingPageId }) => {
	const res = await Promise.all(
		designBlocks.map(designData => addOneDesignToLanding({ designData, landingPageId })),
	);
	return res;
};

export default addDesignToLanding;
