import prepareContract from 'src/functions/utils/prepareContract';
import prepareSplit from 'src/functions/utils/prepareSplit';
import { instance } from 'store/operations';

const getBapDeals = async ({ bapId }) => {
	try {
		const { data } = await instance.get(`/api/contracts/splits/pending?bapId=${bapId}`);
		const updatedSplits = data.splits.map(el => {
			const { contractId, ...split } = el;
			return { ...split, splitId: split.id };
		});

		const contracts = data.contracts.map(el => {
			const { tracks, users, ...contract } = el;
			return prepareContract({
				contract: { ...contract, splitTracks: tracks, splitUsers: users },
				allDeals: [...data.contracts, ...updatedSplits],
			});
		});
		const splits = updatedSplits.map(el => {
			const { tracks, users, id, ...split } = el;
			return prepareSplit({
				split: { ...split, splitTracks: tracks, splitUsers: users, splitId: id },
				allDeals: [...contracts],
			});
		});

		return [...contracts, ...splits];
	} catch (error) {
		console.log('getBapDeals error: ', error);
	}
};
export default getBapDeals;
