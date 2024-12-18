import getFormattedDate from 'src/functions/utils/getFormattedDate';

export const getWithdrawals = async axiosPrivate => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/withdrawals/`, {
			signal: controller.signal,
		});
		return {
			success: data.success,
			withdrawals:
				data?.withdraws?.length > 0
					? data.withdraws.map(el => {
							return {
								...el,
								amount: parseFloat(el.amount).toFixed(2),
								date: getFormattedDate(el.createdAt),
								status: el.isApproved ? 'Approved' : 'Accepted for processing',
								bgColor: el.isApproved ? '#00ff0038' : 'bg.pink',
							};
					  })
					: [],
		};
	} catch (error) {
		console.log('getWithdrawals: ', error);
	}
};
