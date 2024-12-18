import getImageSrc from 'src/functions/utils/getImageSrc';
import { instance } from 'store/operations';

async function editUserProfileRequest(formData) {
	try {
		const { data } = await instance.put(
			`${process.env.NEXT_PUBLIC_URL}/api/users/settings`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);
		if (data?.settings?.avatar) {
			const avatarSrc = getImageSrc(data.settings?.thumbnail || data.settings.avatar, false);
			const settings = { ...data.settings, avatarSrc };
			return { success: true, settings };
		}

		return data;
	} catch (error) {
		console.log('editUserProfileRequest error:', error);
		return error?.response?.data;
	}
}

export default editUserProfileRequest;
