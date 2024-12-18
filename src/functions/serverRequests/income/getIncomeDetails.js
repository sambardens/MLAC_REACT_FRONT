import getFormattedDate from 'src/functions/utils/getFormattedDate';
import { instance } from 'store/operations';

const getIncomeDetails = async incomeId => {
	try {
		const { data } = await instance.get(`/api/incomes/${incomeId}`);
		if (data.success) {
			const gross = data.income.gross ? Math.round(parseFloat(data.income.gross) * 100) / 100 : 0;
			const date = getFormattedDate(data.income.date);
			const net = data.income.net ? Math.round(parseFloat(data.income.net) * 100) / 100 : 0;
			const fees = data.income.gross && data.income.fees ? +data.income.fees / +data.income.gross : 0;
			const tracks = data.income?.tracks?.length
				? data.income.tracks.map(el => ({
						...el,
						price: Math.round(parseFloat(el.price) * 100) / 100,
				  }))
				: [];
			return {
				...data,
				income: {
					...data.income,
					gross,
					fees,
					net,
					date,
					tracks,
				},
			};
		}
		return data;
	} catch (error) {
		console.log('getIncomeDetails error: ', error);
	}
};

export default getIncomeDetails;
