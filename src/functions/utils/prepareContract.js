import getFormattedDate from './getFormattedDate';
import getImageSrc from './getImageSrc';
import getUserName from './getUserName';

function prepareContract({ contract, userId = null, allDeals, creatorOrAdmin = false }) {
	const type = 'contract';
	const isCreator = contract?.creatorBapId === userId;
	const isRights = creatorOrAdmin || isCreator;

	const splitUsers = contract.splitUsers.map(user => {
		if (user.userAvatar) {
			return { ...user, avatarSrc: getImageSrc(user.userAvatar, false) };
		} else {
			return user;
		}
	});
	const splitTracks = contract?.splitTracks.map(el => ({
		...el,
		evearaPreviewDuration: el?.evearaPreviewDuration || '15',
		evearaPreviewStartAt: el?.evearaPreviewStartAt || '15',
		evearaTrackId: el?.evearaTrackId || null,
		credits: el?.credits || [],
		featureArtists: el?.featureArtists || [],
	}));
	const notSignedUsers = splitUsers.filter(user => user.signature === null);
	const isCurrentUserSigned = !notSignedUsers.some(user => user.userId === userId);
	const isContractSigned = splitUsers.every(user => !!user.signature);
	// : `Awaiting signing (${notSignedUsers.map((user) => {
	//   if (user.firstName && user.lastName) {
	//     return `${user.firstName} ${user.lastName}`;
	//   } if (user.firstName && !user.lastName) {
	//     return user.firstName;
	//   } return user.email;
	// })
	//   .join(', ')})`;

	const getContractStatus = () => {
		if (contract.isCancelled) {
			const user = splitUsers.find(el => el.userId === contract.isCancelled);
			const userName = `${user?.firstName || ''} ${user?.lastName || ''}`;
			return { statusText: `Declined by ${userName}`, status: 3 };
		} else if (isContractSigned && contract.completed) {
			return { statusText: 'Active', status: 1 };
		} else if (isContractSigned && !contract.completed) {
			return { statusText: 'Expired', status: 2 };
		} else if (notSignedUsers.length === 1 && !isCurrentUserSigned) {
			return { statusText: 'Awaiting your signature', status: 0 };
		} else {
			return { statusText: 'Awaiting signing', status: 0 };
		}
	};

	const { statusText, status } = getContractStatus();
	const getRecreateStatus = () => {
		if (!contract?.contractId || status !== 1 || !isRights) return false;
		const hasNewVersion = allDeals?.find(
			el => !el?.isCancelled && el?.referenceContractId === contract?.contractId,
		);
		return !hasNewVersion;
	};
	const split = allDeals.find(el => !el?.contractId && el.splitId === contract.splitId);

	const tracksName = contract?.splitTracks?.map(el => el.name)?.join(', ');
	const formattedDate = getFormattedDate(contract?.createdAt);
	const writers = splitUsers?.map(el => getUserName(el))?.join(', ');
	const recreateMode = getRecreateStatus();

	const onlyContract = split ? split?.onlyContract : true;

	const isEditableleContract =
		isRights &&
		contract?.contractId &&
		!contract.isCancelled &&
		notSignedUsers.length === splitUsers.length &&
		onlyContract;

	const isEditableDeal = isEditableleContract || (isRights && type === 'split');

	const isCanDelete = isRights && status === 0 && notSignedUsers.length === splitUsers.length;

	const isShowSendParticipants = () => {
		if (!isRights) return false;
		if (notSignedUsers?.length > 1) {
			return true;
		} else if (notSignedUsers?.length === 1) {
			const lastNotSignedUser = notSignedUsers[0];
			return userId !== lastNotSignedUser.userId;
		} else {
			return false;
		}
	};

	const showSendParticipants = isShowSendParticipants();
	const showMore =
		!contract.isCancelled &&
		isRights &&
		(isEditableDeal || recreateMode || isCanDelete || showSendParticipants);
	const preparedContract = {
		...contract,
		splitTracks,
		splitUsers,
		type,
		notSignedUsers,
		isCurrentUserSigned,
		isContractSigned,
		status,
		statusText,
		formattedDate,
		writers,
		tracksName,
		isEditableleContract,
		isEditableDeal,
		showMore,
		recreateMode,
		isCreator,
		creatorOrAdmin,
		isCanDelete,
		showSendParticipants,
		onlyContract,
	};

	return preparedContract;
}

export default prepareContract;
