const getSplitById = async (splitId, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/splits/${splitId}`, { signal: controller.signal });
		const res = {
			success: data.success,
			split: {
				...data.split,
				splitUsers: data.split.splitUsers.map(el => ({ ...el, credits: [] })),
			},
		};
		return res;
	} catch (error) {
		console.log('getSplitById error: ', error);
	}
};

export default getSplitById;
