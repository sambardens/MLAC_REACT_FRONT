// ----------------------- >> GENRES << --------------------------------
import getFormattedDate from 'src/functions/utils/getFormattedDate';
import { instance } from 'store/operations';

export const getGenresEveara = async axiosPrivate => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get('/api/eveara/tracks/genres', {
			signal: controller.signal,
		});
		return data;
	} catch (error) {
		console.log('getUserFromEveara error: ', error);
	}
};

// ----------------------- >> USER << --------------------------------

export const getUserFromEveara = async (userEmail, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/eveara/users?email=${userEmail}`, {
			signal: controller.signal,
		});
		return data;
	} catch (error) {
		console.log('getUserFromEveara error: ', error);
	}
};

export const updateUserEveara = async (userData, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.put('/api/eveara/users', userData, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('updateUserEveara error: ', error);
	}
};

// ----------------------- >> ALBUM << --------------------------------

// export const addAlbumEveara = async (albumData, axiosPrivate) => {
// 	const controller = new AbortController();
// 	try {
// 		const { data } = await axiosPrivate.post('/api/eveara/albums', albumData, {
// 			signal: controller.signal,
// 		});

// 		return data;
// 	} catch (error) {
// 		console.log('addAlbumEveara error: ', error);
// 	}
// };

export const validateAlbumEveara = async ({ uuidEveara, releaseId, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(
			`/api/eveara/albums/${releaseId}/validate?uuidEveara=${uuidEveara}`,
			{
				signal: controller.signal,
			},
		);
		return data;
		// if (data?.message === 'Current album status is Ready for review') {
		// 	return { success: true, message: data.message };
		// }
		// return { success: false, message: data.message };
	} catch (error) {
		console.log('addAlbumEveara error: ', error);
	}
};

export const updateAlbumEveara = async ({ evearaReleaseId, newAlbumData, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.put(`/api/eveara/albums/${evearaReleaseId}`, newAlbumData, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('addAlbumEveara error: ', error);
	}
};

// ----------------------- >> TRACK << --------------------------------

// export const addTracksEveara = async (releaseId, axiosPrivate) => {
// 	const controller = new AbortController();
// 	try {
// 		const { data } = await axiosPrivate.post('/api/eveara/tracks', releaseId, {
// 			signal: controller.signal,
// 		});

// 		return data;
// 	} catch (error) {
// 		console.log('addTrackEveara error: ', error);
// 	}
// };

export const updateTrackEveara = async ({ trackId, trackData }, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.put(`/api/eveara/tracks/${trackId}`, trackData, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('updateTrackEveara error: ', error);
	}
};

// ----------------------- >>  ARTIST << --------------------------------

export const getArtistEveara = async ({ uuidEveara, artistId }, axiosPrivate) => {
	const controller = new AbortController();
	try {
		let url = `/api/eveara/artists?uuidEveara=${uuidEveara}`;

		if (artistId) {
			url += `&artistId=${artistId}`;
		}

		const { data } = await axiosPrivate.get(url, {
			signal: controller.signal,
		});

		const errorArr = data?.errors?.map(el => el?.message);
		const message = errorArr?.length > 0 ? errorArr.join(', ') : '';
		return { ...data, message };
	} catch (error) {
		console.log('addTrackEveara error: ', error);
	}
};

export const updateArtistEveara = async (artist, axiosPrivate) => {
	const controller = new AbortController();
	const artistData = {
		uuid: artist.evearaBapId,
		country: 'bo',
		name: artist.bapName,
		outlets_profile: {
			spotify_profile: artist.spotifyUri || '',
			applemusic_profile: artist.appleMusicId || '',
			soundcloudgo_profile: artist?.soundCloudId || '',
		},
	};
	try {
		const { data } = await axiosPrivate.put('/api/eveara/artists', artistData, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('addTrackEveara error: ', error);
	}
};

export const addFeatureArtistEveara = async (artist, axiosPrivate) => {
	const controller = new AbortController();
	const artistData = {
		country: artist.country?.toLowerCase(),
		name: artist.name,
		outlets_profile: {
			spotify_profile: artist?.spotifyId ? `spotify:artist:${artist.spotifyId}` : '',
			applemusic_profile: artist?.appleMusicId || '',
			soundcloudgo_profile: artist?.soundCloudId || '',
		},
	};
	try {
		const { data } = await axiosPrivate.post('/api/eveara/artists', artistData, {
			signal: controller.signal,
		});

		const errorArr = data?.errors?.map(el => el?.message);
		const message = errorArr?.length > 0 ? errorArr.join(', ') : '';
		return {
			success: data.success,
			evearaArtistId: data?.artist_id ? Number(data?.artist_id) : '',
			name: artist.name,
			message,
		};
	} catch (error) {
		console.log('addTrackEveara error: ', error);
	}
};

// ----------------------- >>  LABEL << --------------------------------

export const getLabelEveara = async (uuidEveara, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/eveara/labels?uuidEveara=${uuidEveara}`, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('addTrackEveara error: ', error);
	}
};

export const addLabelEvearaRequest = async (name, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.post(
			'/api/eveara/labels',
			{ name },
			{
				signal: controller.signal,
			},
		);

		return data;
	} catch (error) {
		console.log('addTrackEveara error: ', error);
	}
};

// ----------------------- >>  PARTICIPANT  << --------------------------------

export const addParticipantEveara = async (participantData, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.post('/api/eveara/participants', participantData, {
			signal: controller.signal,
		});

		return data?.participant;
	} catch (error) {
		console.log('addParticipantEveara error: ', error);
	}
};

export const getParticipantEveara = async (uuidEveara, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/eveara/participants?uuidEveara=${uuidEveara}`, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('addParticipantEveara error: ', error);
	}
};

export const addParticipantPayPalEveara = async ({ participant, uuid, axiosPrivate }) => {
	console.log('addParticipantPayPalEveara participant: ', participant);
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.post(
			`/api/eveara/participants/paypal/${participant.participantId}`,
			{ uuid, paypalEmailId: participant.paypalEmailId },
			{
				signal: controller.signal,
			},
		);

		return { ...data, participant };
	} catch (error) {
		console.log('addParticipantPayPalEveara error: ', error);
	}
};

export const getParticipantPayPalEveara = async ({ participantId, uuidEveara, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(
			`/api/eveara/participants/paypal/${participantId}?uuidEveara=${uuidEveara}`,
			{
				signal: controller.signal,
			},
		);

		return data;
	} catch (error) {
		console.log('getParticipantPayPalEveara error: ', error);
	}
};

// ----------------------- >> OUTLETS  << --------------------------------

export const getOutletsEveara = async (uuidEveara, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/eveara/outlets?uuidEveara=${uuidEveara}`, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('addParticipantEveara error: ', error);
	}
};

export const getOutletsDetailsByAlbumEveara = async ({ uuidEveara, releaseId, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(
			`/api/eveara/outlets/${releaseId}?uuidEveara=${uuidEveara}`,
			{
				signal: controller.signal,
			},
		);

		return data;
	} catch (error) {
		console.log('addParticipantEveara error: ', error);
	}
};

// ----------------------- >> Subscriptions  << --------------------------------

export const getPartnerSubscriptionsEveara = async axiosPrivate => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get('/api/eveara/subscriptions/partner', {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('addParticipantEveara error: ', error);
	}
};

export const getUserSubscriptionsEveara = async (uuidEveara, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(
			`api/eveara/subscriptions/user?uuidEveara=${uuidEveara}`,
			{
				signal: controller.signal,
			},
		);

		return data;
	} catch (error) {
		console.log('addParticipantEveara error: ', error);
	}
};

// export const addUserSubscriptionsEveara = async (body, axiosPrivate) => {
// 	const controller = new AbortController();
// 	try {
// 		const { data } = await axiosPrivate.post('/api/eveara/subscriptions/user', body, {
// 			signal: controller.signal,
// 		});

// 		return data;
// 	} catch (error) {
// 		console.log('addParticipantEveara error: ', error);
// 	}
// };

// ----------------------- >> Distribute  << --------------------------------

// export const distributeReleaseEveara = async ({
// 	releaseId,
// 	uuid,
// 	outlets_details,
// 	evearaPriceId,
// 	axiosPrivate,
// }) => {
// 	const controller = new AbortController();
// 	try {
// 		const { data } = await axiosPrivate.patch(
// 			`api/eveara/outlets/${releaseId}/distribute`,
// 			{ outlets_details, uuid, evearaPriceId },
// 			{
// 				signal: controller.signal,
// 			},
// 		);

// 		return { ...data, evearaPriceId };
// 	} catch (error) {
// 		console.log('distributeReleaseEveara error: ', error);
// 	}
// };

// ----------------------- >> Payout  << --------------------------------

export const getPayoutBalance = async ({ uuidEveara, participantId, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`api/eveara/payout/${uuidEveara}/balance`, {
			signal: controller.signal,
		});
		console.log('data: ', data);
		const result = {
			balance: 0,
			currency: 'USD',
			participantId,
			uuidEveara,
			errors: data?.errors || [],
		};
		if (data.success) {
			const currentUserBalanceInfo = data?.data?.find(el => el.participant_id === participantId);
			if (currentUserBalanceInfo) {
				result.balance = +currentUserBalanceInfo.amount_to_pay;
				result.currency = currentUserBalanceInfo.currency;
			}

			return { success: true, ...result };
		}
		return {
			success: false,
			...result,
		};
	} catch (error) {
		console.log('getPayoutBalance error: ', error);
	}
};

export const payoutForDistribution = async ({ uuidEveara, participantId, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.post(
			`api/eveara/payout/${uuidEveara}`,
			{
				participantId: [participantId],
			},
			{
				signal: controller.signal,
			},
		);

		return data;
	} catch (error) {
		console.log('wthdrawalForDistribution error: ', error);
	}
};

export const getPayoutHistory = async ({ uuidEveara, participantId, axiosPrivate }) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`api/eveara/payout/${uuidEveara}/history`, {
			signal: controller.signal,
		});
		if (data.success) {
			const transactions = data?.data?.filter(el => el.participant_id === participantId);

			const withdrawals = transactions.map(el => {
				const [day, month, year] = el.paid_date.split('-');
				const date = new Date(year, month - 1, day);

				return {
					...el,
					amount: parseFloat(el?.payout_amount).toFixed(2),
					date: getFormattedDate(date),
					status: el?.payout_status?.status_name,
					bgColor: el.payout_status?.status_code === 1111 ? '#00ff0038' : 'bg.pink',
					currency: el?.currency,
				};
			});
			return { success: true, withdrawals };
		}
		return {
			success: false,
		};
	} catch (error) {
		console.log('getPayoutHistory error: ', error);
	}
};

export const simulateDistibuteEveara = async body => {
	try {
		const { data } = await instance.put('api/eveara/simulate/distribute', {
			...body,
		});
		return data;
	} catch (error) {
		console.log('simulateDistibuteEveara error: ', error);
	}
};
