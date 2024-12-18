import { instance } from 'store/operations';

export const deleteDublicateTracks = async ({ releaseId, trackIds }) => {
	try {
		await Promise.all(
			trackIds.map(async trackId => {
				await instance.delete(`/api/tracks/release/${releaseId}?trackId=${trackId}`);
			}),
		);
	} catch (error) {
		console.log('deleteDublicateTracks error: ', error);
	}
};
