import getSignatureImage from './getSignatureImage';

const getContractWithSignatureImages = async (contract, axiosPrivate) => {
	const splitUsers = await Promise.all(
		contract.splitUsers.map(async el => {
			if (el.signature && !el.signatureSrc) {
				const signatureSrc = await getSignatureImage({ signatureUrl: el.signature }, axiosPrivate);
				return { ...el, signatureSrc };
			}
			return el;
		}),
	);
	return { ...contract, splitUsers };
};

export default getContractWithSignatureImages;
