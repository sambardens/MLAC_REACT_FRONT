const acceptToBeFutureCreatorOfBap = async token => {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/baps/future?token=${token}`,
	};

	try {
		const res = await instance.request(config);

		console.log('acceptToBeFutureCreatorOfBap success:', res);

		return res.data;
	} catch (e) {
		console.log('acceptToBeFutureCreatorOfBap error:', e);

		return e.response.data;
	}
};

export default acceptToBeFutureCreatorOfBap;
