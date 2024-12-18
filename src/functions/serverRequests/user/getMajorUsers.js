import getImageSrc from '../../utils/getImageSrc';

const getMajorUsers = async ({ input, type, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/users/?search=${input}&type=${type}`, {
			signal: controller.signal,
		});

		const users = data.users.map(el => {
			if (el.avatar) {
				const avatarSrc = getImageSrc(el?.thumbnail || el?.avatar, false);
				return { ...el, avatarSrc };
			}
			return el;
		});

		return users;
	} catch (error) {
		console.log('getMajorUsers error: ', error);
	}
};

export default getMajorUsers;
