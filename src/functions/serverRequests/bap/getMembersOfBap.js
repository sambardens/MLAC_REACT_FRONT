import getImageSrc from '../../utils/getImageSrc';

const getMembersOfBap = async (bapId, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/baps/members/${bapId}`, {
			signal: controller.signal,
		});
		if (data.success) {
			const members = data.members.map(el => {
				let avatarSrc = '';
				if (el.avatar) {
					avatarSrc = getImageSrc(el?.thumbnail || el.avatar, false);
				}
				return { ...el, avatarSrc, id: el.userId };
			});
			return { success: true, members };
		}
		return { success: false };
	} catch (e) {
		console.log('getMembersOfBap error:', e);
	}
};

export default getMembersOfBap;
