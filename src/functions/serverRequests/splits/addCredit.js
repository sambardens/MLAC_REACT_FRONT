const addCredit = async ({ creditData, user, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.post('/api/credits', creditData, {
			signal: controller.signal,
		});

		return {
			success: data.success,
			credit: { ...creditData, ...user },
		};
	} catch (error) {
		console.log('addCredit error: ', error);
	}
};

export default addCredit;
