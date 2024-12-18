import { instance } from 'store/operations';

const editSplit = async ({ ownership, splitId, deal }) => {
	try {
		const { data } = await instance.post(`/api/splits/ownership/${splitId}`, {
			ownership,
		});

		// const nozmalizedSplitUsers = data.splitUsers.map(el => ({...el,	credits: []}));
		// const tracks = splitTracks.map(el =>
		// 	el.selected
		// 		? { ...el, splitUsers: nozmalizedSplitUsers }
		// 		: { ...el, splitUsers: null },
		// );

		return { splitUsers: data.splitUsers };
	} catch (error) {
		console.log('editSplit error: ', error);
	}
};

export default editSplit;
