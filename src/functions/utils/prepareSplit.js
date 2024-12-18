import getFormattedDate from './getFormattedDate';
import getImageSrc from './getImageSrc';
import getUserName from './getUserName';

function prepareSplit({ split, userId = null, allDeals, creatorOrAdmin = false }) {
	const isCreator = split?.creatorBapId === userId;
	const isRights = creatorOrAdmin || isCreator;
	const hasContract = allDeals.find(el => el.contractId && el.splitId === split.splitId);
	const getContractStatus = () => {
		if (hasContract && hasContract.status !== 0) {
			return { statusText: 'Expired', status: 2 };
		}
		return { statusText: 'Active', status: 1 };
	};

	const { statusText, status } = getContractStatus();

	const splitUsers = split.splitUsers.map(user => {
		if (user.userAvatar) {
			return { ...user, avatarSrc: getImageSrc(user.userAvatar, false) };
		} else {
			return user;
		}
	});
	const splitTracks = split?.splitTracks.map(el => ({
		...el,
		evearaPreviewDuration: el?.evearaPreviewDuration || '15',
		evearaPreviewStartAt: el?.evearaPreviewStartAt || '15',
		evearaTrackId: el?.evearaTrackId || null,
		credits: el?.credits || [],
	}));
	const formattedDate = getFormattedDate(split?.createdAt);
	const tracksName = split?.splitTracks?.map(el => el.name)?.join(', ');
	const writers = splitUsers?.map(el => getUserName(el))?.join(', ');

	const type = 'split';
	const showMore = isRights && !hasContract;
	const isEditableDeal = isRights && !hasContract;
	const prepareSplit = {
		...split,
		splitTracks,
		splitUsers,
		type,
		status,
		statusText,
		formattedDate,
		writers,
		tracksName,
		isEditableleContract: false,
		isEditableDeal,
		isCanDelete: false,
		showMore,
		isCreator,
		creatorOrAdmin,
		recreateMode: false,
		showSendParticipants: false,
		isCancelled: null,
	};

	return prepareSplit;
}

export default prepareSplit;
