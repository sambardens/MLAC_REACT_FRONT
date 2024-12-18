import getNormalyzedGenres from 'src/functions/utils/genres/getNormalyzedGenres';

const getBapGenres = async (bapId, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/genres/${bapId}`, {
			signal: controller.signal,
		});
		if (data.success) {
			return getNormalyzedGenres(data?.genresBap);
		}
		return [];
	} catch (error) {
		console.log('getBapGenres: ', error);
		return error;
	}
};

export default getBapGenres;
