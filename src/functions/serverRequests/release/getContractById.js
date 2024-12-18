import getSignatureImage from '../contracts/getSignatureImage';

const getContractById = async (contractId, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/contracts/${contractId}`, {
			signal: controller.signal,
		});

		const updatedSplitUsers = await Promise.all(
			data.contract.splitUsers.map(async el => {
				if (el.signature) {
					const signatureSrc = await getSignatureImage({ signatureUrl: el.signature }, axiosPrivate);
					return { ...el, signatureSrc, credits: [] };
				} else {
					return { ...el, credits: [] };
				}
			}),
		);

		const res = {
			success: data.success,
			contract: {
				...data.contract,
				splitUsers: updatedSplitUsers,
				contractId: data.contract.id,
				id: data.contract.splitId,
			},
		};
		return res;
	} catch (error) {
		console.log('getContractById error: ', error);
	}
};

export default getContractById;
