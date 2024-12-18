import axios from 'axios';

const resetPassword = async (email) => {
	try {
		const { data } = await axios.post(
			`${process.env.NEXT_PUBLIC_URL}/api/mails/sendLinkPassword`,
			{ email },
		);

		return data;
	} catch (error) {
		console.error('resetPassword failed:', error);

    return error.response.data;
	}
};

export default resetPassword;
