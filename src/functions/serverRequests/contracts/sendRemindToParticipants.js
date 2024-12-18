import { instance } from 'store/operations';

const sendRemindToParticipants = async contractId => {
	try {
		const { data } = await instance.post(`/api/contracts/signature/remind/${contractId}`);

		return data;
	} catch (error) {
		console.log('sendRemindToParticipants error: ', error);
	}
};

export default sendRemindToParticipants;
