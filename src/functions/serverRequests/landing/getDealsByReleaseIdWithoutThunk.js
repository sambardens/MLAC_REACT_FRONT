import axios from 'axios';
import prepareContract from 'src/functions/utils/prepareContract';
import prepareSplit from 'src/functions/utils/prepareSplit';

const getDealsByReleaseIdWithoutThunk = async ({ releaseId }) => {
	try {
		const { data } = await axios.get(
			`${process.env.NEXT_PUBLIC_URL}/api/contracts/splits/pending?releaseId=${releaseId}`,
		);
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
		console.log('getDealsByReleaseId error: ', error);
	}
};

export default getDealsByReleaseIdWithoutThunk;
