import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import {
	addFeatureArtistEveara,
	addParticipantEveara,
	addParticipantPayPalEveara,
	getArtistEveara,
	getGenresEveara,
	getLabelEveara,
	getOutletsEveara,
	getParticipantEveara,
	getParticipantPayPalEveara,
	getPartnerSubscriptionsEveara,
	getUserFromEveara,
	getUserSubscriptionsEveara,
	simulateDistibuteEveara,
	updateAlbumEveara,
	updateArtistEveara,
	updateUserEveara,
	validateAlbumEveara,
} from 'src/functions/serverRequests/eveara/eveara';
import compareObjects from 'src/functions/utils/compareObjects';
import {
	addAlbumEveara,
	addArtistEveara,
	addLabelEveara,
	addTracksEveara,
	addUserSubscriptionsEveara,
	createUserAccountEveara,
	distributeReleaseEveara,
	getOutletsDetailsEveara,
	getParticipantsById,
} from 'store/eveara/eveara-operations';
import {
	getTracksToReleaseWithArtistLogo,
	handleEditRelease,
	saveUserData,
	updateBapFromSpotifyAndAudd,
} from 'store/operations';
import { setParticipants } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';

const EvearaBlock = ({ tracksInDeals, isDisabled, isLoading, setIsLoading, soundCloudLink }) => {
	const toast = useToast();
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();

	const [isAlreadyValidated, setIsAlreadyValidated] = useState(false);
	const [isSimulating, setIsSimulation] = useState(false);
	const { selectedRelease, selectedBap, user } = useSelector(state => state.user);
	const { spotifyUri, appleMusicId, bapName, bapId, evearaBapId, country } = selectedBap;
	const [albumStatus, setAlbumStatus] = useState({
		success: false,
		code: null,
		title: '',
		description: '',
	});
	const soundCloudId = soundCloudLink
		? soundCloudLink.social.replace('https://soundcloud.com/', '')
		: '';

	const btnDisabled = isDisabled || (albumStatus.code && albumStatus.code > 1025);

	const handleValidateAlbum = async ({ uuidEveara, releaseId }) => {
		const validRes = await validateAlbumEveara({
			uuidEveara,
			releaseId,
			axiosPrivate,
		});
		const status = {
			success: validRes.success,
			code: validRes?.data?.album_status?.status_code || 0,
			title: validRes?.data?.album_status?.status_name || '',
			description: validRes.message,
		};
		setAlbumStatus(status);
		return status;
	};
	const getToast = (type, text, needToGetParticipants = true) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 7000,
			isClosable: true,
		});
		if (type === 'Error' && needToGetParticipants) {
			dispatch(getParticipantsById({ id: user.id, type: 'creatorId', axiosPrivate }));
		}
		setIsLoading(false);
	};

	const handleSaveEvearaUser = async () => {
		const res = await getUserFromEveara(user.email, axiosPrivate);
		const userDataForEvearaRequest = {
			email: user.email,
			firstName: user.firstName,
			lastName: user?.lastName,
			address: {
				// street: user?.street || '',
				// house: user?.house || '',
				// city: user?.city || '',
				zip: (user.postCodeZipCode?.length >= 5 && +user.postCodeZipCode) || null,
				mobile: user?.phone || '',
			},
			country: user?.country?.toLowerCase(),
			// state: user?.regionState?.toLowerCase(),
		};
		if (res?.success && res?.data?.length > 0 && res?.data[0]?.uuid) {
			const userDataEveara = res.data[0];

			const userMajorLabl = {
				first_name: user.firstName,
				sur_name: user.lastName,
				email: user.email,
				mobile: user.phone || '',
				zip: (user.postCodeZipCode?.length >= 5 && +user.postCodeZipCode) || '',
				// state: user.regionState || '',
				country: user.country || '',
				// street: user.street,
				// house: user.house,
				// city: user.city,
			};
			const userEveara = {
				first_name: userDataEveara.first_name,
				sur_name: userDataEveara.sur_name,
				email: userDataEveara.email,
				mobile: userDataEveara.address.mobile,
				zip: userDataEveara.address.zip ? Number(userDataEveara.address.zip) : '',
				// state: userDataEveara.state?.iso,
				country: userDataEveara.country?.iso,
				// street: userDataEveara.address.street,
				// house: userDataEveara.address.house,
				// city: userDataEveara.address.city,
			};

			if (!user?.uuidEveara) {
				const res = await dispatch(saveUserData({ uuidEveara: userDataEveara?.uuid }));
				if (!res?.payload?.success) {
					getToast('Error', 'Something went wrong. Try again later', false);
					return { success: false };
				}
			}

			const isNew = compareObjects(userMajorLabl, userEveara);
			if (isNew) {
				await updateUserEveara(
					{ ...userDataForEvearaRequest, uuidEveara: userDataEveara?.uuid },
					axiosPrivate,
				);
			}

			return { success: true, uuidEveara: userDataEveara?.uuid };
		} else {
			const res = await dispatch(
				createUserAccountEveara({
					userId: user.userId,
					userData: userDataForEvearaRequest,
					axiosPrivate,
				}),
			);
			if (!res?.payload?.success || res?.payload?.errors) {
				getToast(
					'Error',
					(res?.payload?.errors?.length > 0 && res?.payload?.errors[0]?.message) ||
						'Something went wrong. Try again later',
					false,
				);
				return { success: false };
			}
			return { success: true, uuidEveara: res?.payload?.uuidEveara };
		}
	};

	const handleSaveArtist = async evearaArtists => {
		console.log('-------------- handleSaveArtist evearaArtists: ', evearaArtists);
		const isRegisteredArtist = evearaArtists.find(
			el => el.name.toLowerCase() === bapName.toLowerCase(),
		);

		console.log('-------------- handleSaveArtis isRegisteredArtist: ', isRegisteredArtist);
		if (isRegisteredArtist) {
			dispatch(
				updateBapFromSpotifyAndAudd({
					bapId,
					newBapData: { evearaBapId: isRegisteredArtist.evearaArtistId },
					contentType: 'application/json',
				}),
			);
			return { success: true, artistId: isRegisteredArtist.evearaArtistId };
		} else {
			const artist = {
				bapName,
				spotifyUri,
				appleMusicId,
				bapId,
				country,
				soundCloudId,
			};
			const addArtistEvearaRes = await dispatch(addArtistEveara({ artist, axiosPrivate }));
			console.log('--------handleSaveArtis addArtistEvearaRes: ', addArtistEvearaRes);
			if (addArtistEvearaRes?.payload?.success) {
				return { success: true, artistId: addArtistEvearaRes?.payload?.evearaBapId };
			}
			return { success: false, message: addArtistEvearaRes?.payload?.message };
		}
	};

	const handleSaveFeatureArtists = async evearaArtists => {
		const uniqueFeatureArtists = selectedRelease.checkedTracks
			.map(el => el.featureArtists)
			.flat()
			.reduce((acc, current) => {
				const existingArtist = acc.find(
					item => item.name.toLowerCase().trim() === current.name.toLowerCase().trim(),
				);
				if (!existingArtist) {
					acc.push(current);
				}
				return acc;
			}, []);
		const artistsToCreate = [];
		uniqueFeatureArtists.forEach(majorLablArtist => {
			const isRegisteredArtist = evearaArtists.find(
				evearaArtist => evearaArtist.name.toLowerCase() === majorLablArtist.name.toLowerCase(),
			);
			if (!isRegisteredArtist) {
				artistsToCreate.push(majorLablArtist);
			}
		});

		if (artistsToCreate.length > 0) {
			const newEvearaFeatureArtists = await Promise.all(
				artistsToCreate.map(async artistToCreate => {
					const addArtistEvearaRes = await addFeatureArtistEveara(artistToCreate, axiosPrivate);
					if (!addArtistEvearaRes.success) {
						getToast(
							'Error',
							`Artist ${addArtistEvearaRes.name}. ${
								addArtistEvearaRes.message || 'Something went wrong. Try again later'
							} `,
							false,
						);
					}
					return addArtistEvearaRes;
				}),
			);
			console.log('newEvearaFeatureArtists: ', newEvearaFeatureArtists);
			const unsuccess = newEvearaFeatureArtists.find(el => !el.success);
			if (unsuccess) {
				return { success: false };
			}
			const artists = [...evearaArtists, ...newEvearaFeatureArtists];
			return { success: true, artists };
		}

		return { success: true, artists: evearaArtists };
	};

	const handleUpdateArtist = async () => {
		const formData = { evearaBapId, bapName, spotifyUri, appleMusicId };
		const updateArtistRes = await updateArtistEveara(formData, axiosPrivate);
	};

	const handleAddParticipantPayPalEmail = async (participantsForUpdate, uuidEveara) => {
		const updatedParticipantsRes = await Promise.allSettled(
			participantsForUpdate.map(async participant => {
				const getParticipantRes = await getParticipantPayPalEveara({
					uuidEveara,
					participantId: participant.participantId,
					axiosPrivate,
				});
				console.log('getParticipantRes', getParticipantRes);
				if (
					getParticipantRes?.data?.success &&
					getParticipantRes.data.paypal_email_id === participant.paypalEmailId
				) {
					return { success: true, participant };
				}
				const data = {
					participant,
					uuid: uuidEveara,
					axiosPrivate,
				};
				const res = await addParticipantPayPalEveara(data);
				return res;
			}),
		);
		console.log('updatedParticipantsRes: ', updatedParticipantsRes);
		const updatedParticipants = updatedParticipantsRes
			.filter(result => result.status === 'fulfilled' && result.value?.participant)
			.map(result => result.value.participant);
		if (
			updatedParticipants.length > 0 &&
			participantsForUpdate.length === updatedParticipants.length
		) {
			return { success: true, participants: updatedParticipants };
		}
		return { success: false };
	};

	const handleAddParticipants = async (participantsForCreate, uuidEveara) => {
		const newParticipants = await Promise.all(
			participantsForCreate.map(async el => {
				const formData = { name: `${el.firstName} ${el?.lastName}`, userId: el.userId };
				const newParticipant = await addParticipantEveara(formData, axiosPrivate);
				if (newParticipant?.participantId) {
					return { ...newParticipant, paypalEmailId: el.paymentEmail };
				}
				return { participantId: null };
			}),
		);
		console.log('newParticipants: ', newParticipants);

		const everyParticipantReqSuccess = newParticipants.every(el => el?.participantId);
		console.log('everyParticipantReqSuccess: ', everyParticipantReqSuccess);
		if (!everyParticipantReqSuccess) return { success: false };

		const res = await handleAddParticipantPayPalEmail(newParticipants, uuidEveara);
		console.log('res handleAddParticipantPayPalEmail: ', res);
		return res;
	};

	const handleGetParticipant = async () => {
		const getParticipantRes = await getParticipantEveara(user.uuidEveara, axiosPrivate);
		console.log('getParticipantRes: ', getParticipantRes);
	};

	const handleGetParticipantPayPalEmail = async () => {
		const getParticipantRes = await getParticipantPayPalEveara({
			uuidEveara: user.uuidEveara,
			participantId: '73392',
			axiosPrivate,
		});
		console.log('getParticipantRes: ', getParticipantRes);
	};

	const handleGetParticipants = async uuidEveara => {
		const getParticipantRes = await getParticipantEveara(uuidEveara, axiosPrivate);
		if (!getParticipantRes.success) {
			return { success: false };
		}
		const evearaParticipants = getParticipantRes.data;
		console.log('evearaParticipants: ', evearaParticipants);
		const allUsersInActiveDeals = selectedRelease.splitsAndContracts
			.filter(el => el.status === 1)
			.map(el => el.splitUsers)
			.flat();
		const uniqueUsersInActiveDeals = [];

		allUsersInActiveDeals.forEach(el => {
			const isDuplicate = uniqueUsersInActiveDeals.find(unique => unique.userId === el.userId);
			if (!isDuplicate) {
				uniqueUsersInActiveDeals.push(el);
			}
		});

		let participantsForCreate = [];
		let participantsForUpdate = [];
		let parcipantsCompleted = [];
		console.log('uniqueUsersInActiveDeals: ', uniqueUsersInActiveDeals);
		console.log(' user.participants==========: ', user.participants);
		uniqueUsersInActiveDeals.forEach(el => {
			console.log('===el===: ', el);
			const currentParticipant = user.participants.find(
				participant => participant.userId === el.userId,
			);
			console.log('currentParticipant: ', currentParticipant);
			if (currentParticipant) {
				if (currentParticipant.paypalEmailId) {
					parcipantsCompleted.push(currentParticipant);
				} else {
					participantsForUpdate.push({ ...currentParticipant, paypalEmailId: el.paymentEmail });
				}
			} else {
				const userName = `${el.firstName} ${el.lastName || ''}`;
				console.log('evearaParticipants: ', evearaParticipants);

				const alreadyCreated = evearaParticipants.find(evearaParticipant => {
					console.log('evearaParticipant NAME ', evearaParticipant.name.toLowerCase().trim());
					console.log('userName.toLowerCase().trim(), ', userName.toLowerCase().trim());
					return evearaParticipant.name.toLowerCase().trim() === userName.toLowerCase().trim();
				});
				if (alreadyCreated) {
					const newParticipant = {
						userId: el.userId,
						paypalEmailId: el.paymentEmail,
						participantId: alreadyCreated.participant_id,
					};
					console.log('newParticipant: ', newParticipant);
					participantsForUpdate.push(newParticipant);
				} else {
					participantsForCreate.push(el);
				}
			}
		});

		console.log('participantsForCreate: ', participantsForCreate);
		console.log('participantsForUpdate: ', participantsForUpdate);
		console.log('parcipantsCompleted: ', parcipantsCompleted);
		if (participantsForCreate.length > 0) {
			const newParticipantsRes = await handleAddParticipants(participantsForCreate, uuidEveara);
			console.log('newParticipantsRes: ', newParticipantsRes);
			if (!newParticipantsRes.success) return { success: false };
			parcipantsCompleted.push(...newParticipantsRes.participants);
		}
		if (participantsForUpdate.length > 0) {
			console.log('participantsForUpdate handleAddParticipantPayPalEmail: ', participantsForUpdate);
			const updatedParticipantsRes = await handleAddParticipantPayPalEmail(
				participantsForUpdate,
				uuidEveara,
			);
			console.log('updatedParticipantsRes: ', updatedParticipantsRes);
			if (!updatedParticipantsRes.success) return { success: false };
			parcipantsCompleted.push(...updatedParticipantsRes.participants);
		}
		dispatch(setParticipants(parcipantsCompleted));
		console.log('======== ПОСЛЕ ========parcipantsCompleted: ', parcipantsCompleted);
		if (uniqueUsersInActiveDeals.length === parcipantsCompleted.length) {
			return { success: true, participants: parcipantsCompleted };
		}
		return { success: false };
	};

	const handleSaveLabel = async uuidEveara => {
		if (selectedRelease.label && !selectedRelease.evearaLabelId) {
			const getLabelRes = await getLabelEveara(uuidEveara, axiosPrivate);
			if (getLabelRes?.success) {
				const isRegisteredLabel = getLabelRes.data.find(
					el => el.label_name.toLowerCase() === selectedRelease.label.toLowerCase(),
				);
				if (isRegisteredLabel) {
					dispatch(
						handleEditRelease({
							releaseId: selectedRelease.id,
							releaseData: { evearaLabelId: isRegisteredLabel.label_id },
						}),
					);
					return { success: true, label_id: isRegisteredLabel.label_id };
				} else {
					const addLabelRes = await dispatch(
						addLabelEveara({ releaseId: selectedRelease.id, name: selectedRelease.label, axiosPrivate }),
					);

					if (addLabelRes?.payload?.success) {
						return { success: true, label_id: addLabelRes?.payload?.evearaLabelId };
					}
					return { success: false, message: addLabelRes?.payload?.message };
				}
			}
			return { success: false, message: getLabelRes?.message };
		}
	};

	const handleGetAlbum = async () => {
		// const getLabelRes = await getAlbumEveara(user.uuidEveara, axiosPrivate);
	};

	const handleGetOutlets = async () => {
		const getOutletsRes = await getOutletsEveara(user.uuidEveara, axiosPrivate);
		console.log('getOutletsRes: ', getOutletsRes);
	};

	const handlePartnerSubscriptions = async () => {
		const getPartnerSubscriptionsRes = await getPartnerSubscriptionsEveara(axiosPrivate);
		console.log('getPartnerSubscriptionsRes: ', getPartnerSubscriptionsRes);
	};

	const handleGetUserSubscriptions = async () => {
		const getUserSubscriptionsRes = await getUserSubscriptionsEveara(user.uuidEveara, axiosPrivate);
		console.log('getUserSubscriptionsRes: ', getUserSubscriptionsRes);
	};

	const handleSaveUserSubscriptions = async () => {
		const getPartnerSubscriptionsRes = await getPartnerSubscriptionsEveara(axiosPrivate);
		console.log('getPartnerSubscriptionsRes: ', getPartnerSubscriptionsRes);
		if (getPartnerSubscriptionsRes?.success && getPartnerSubscriptionsRes?.total_records >= 1) {
			const body = {
				subscriptions: [
					{
						subscription_id: getPartnerSubscriptionsRes?.data[0]?.subscription_id,
					},
				],
			};
			const addUserSubscriptionsRes = await dispatch(
				addUserSubscriptionsEveara({ body, axiosPrivate }),
			);
			console.log('addUserSubscriptionsRes: ', addUserSubscriptionsRes);
			if (!addUserSubscriptionsRes?.payload?.success) {
				return { success: false, message: addUserSubscriptionsRes?.payload?.message };
			}
			return addUserSubscriptionsRes.payload;
		}
		return { success: false };
	};

	const handleDistribute = async () => {
		if (!selectedBap?.isCreator) {
			getToast('Error', 'Only owner can distribute release', false);
			return;
		}
		setIsLoading(true);
		const userRes = await handleSaveEvearaUser();
		if (!userRes.success) return;
		const uuidEveara = userRes.uuidEveara;
		let artistId = selectedBap.evearaBapId;
		let label_id = selectedRelease.evearaLabelId;
		let subscription_id = user.evearaSubscriptionId;
		let evearaReleaseId = selectedRelease.evearaReleaseId;

		const [year, month, day] = selectedRelease.releaseDate.split('-');
		const original_release_date = `${day}-${month}-${year}`;

		const product_type =
			selectedRelease.type === 'compilation'
				? 'compilation_album'
				: selectedRelease.type === 'EP'
				? 'ep'
				: selectedRelease.type === 'Single'
				? 'single'
				: 'album';

		if (!label_id) {
			const labelRes = await handleSaveLabel(uuidEveara);
			if (!labelRes.success) {
				getToast(
					'Error',
					labelRes?.message || "Something went wrong. Can't save label. Try again later",
					false,
				);
				return;
			}
			label_id = labelRes.label_id;
		}

		const getArtistRes = await getArtistEveara({ uuidEveara }, axiosPrivate);
		if (!getArtistRes?.success) {
			getToast(
				'Error',
				getArtistRes?.message || "Something went wrong. Can't get info about artists. Try again later",
				false,
			);
			console.log('getArtistRes: ', getArtistRes);
			return { success: false, message: getArtistRes?.message };
		}
		const evearaArtists = getArtistRes.data.map(el => ({
			name: el.name,
			evearaArtistId: +el.artist_id,
		}));
		if (!artistId) {
			const artistRes = await handleSaveArtist(evearaArtists);
			console.log('artistRes: ', artistRes);
			if (!artistRes.success) {
				getToast(
					'Error',
					artistRes?.message || "Something went wrong. Can't save artists. Try again later",
					false,
				);
				return;
			}
			artistId = artistRes.artistId;
		}

		if (!subscription_id) {
			const userSubscriptionsRes = await handleSaveUserSubscriptions();
			if (!userSubscriptionsRes.success) {
				console.log('userSubscriptionsRes: ', userSubscriptionsRes);
				getToast(
					'Error',
					userSubscriptionsRes.message ||
						"Something went wrong. Can't get info about subscriptions. Try again later",
				);
				return;
			}
			subscription_id = userSubscriptionsRes.evearaSubscriptionId;
		}

		const participantsRes = await handleGetParticipants(uuidEveara);
		console.log('participantsRes: ', participantsRes);
		if (!participantsRes.success) {
			getToast('Error', 'Participants have been not saved. Try again later');
			return;
		}

		const arePreparedTracks = tracksInDeals.every(el => el.evearaTrackId);

		console.log('arePreparedTracks: ', arePreparedTracks);
		let preparedTracks = [...tracksInDeals];
		if (!arePreparedTracks) {
			const addTrackRes = await dispatch(
				addTracksEveara({ releaseId: selectedRelease.id, axiosPrivate }),
			);
			// dispatch(getTracksToReleaseWithArtistLogo(id));
			console.log('=====handleAddTracks res====: ', addTrackRes);
			if (!addTrackRes?.payload?.success) {
				getToast(
					'Error',
					addTrackRes?.payload?.message || "Something went wrong. Can't save tracks. Try again later",
				);
				return;
			}
			preparedTracks = preparedTracks.map(track => {
				const addedTrack = addTrackRes.payload.tracks.find(
					evearaTrack => evearaTrack.id === track.trackId,
				);
				return addedTrack ? { ...track, evearaTrackId: addedTrack.evearaTrackId } : track;
			});
		}

		const getFeatureArtistsRes = await handleSaveFeatureArtists(evearaArtists);
		if (!getFeatureArtistsRes.success) return;
		const evearaFeatureArtists = getFeatureArtistsRes.artists;
		console.log('evearaFeatureArtists: ', evearaFeatureArtists);
		console.log('========preparedTracks:======= ', preparedTracks);
		const tracks = preparedTracks.map(track => {
			const participant = track.splitUsers.map(user => {
				const info = participantsRes.participants.find(el => el.userId === user.userId);
				const creditInfo = track.credits.find(el => el.userId === user.userId);
				return {
					id: info?.participantId,
					role_id: creditInfo.creditIds,
					payout_share_percentage: +user.ownership,
				};
			});

			const featured_artists = [];
			if (track.featureArtists?.length > 0) {
				track.featureArtists.forEach(artist => {
					const artistAtEveara = evearaFeatureArtists.find(
						evearaArtist => evearaArtist.name.toLowerCase() === artist.name.toLowerCase(),
					);
					if (artistAtEveara) {
						featured_artists.push(artistAtEveara.evearaArtistId);
					}
				});
			}

			return {
				track_id: track.evearaTrackId,
				artists: [Number(artistId)],
				featured_artists,
				preview: {
					start_at: track.evearaPreviewStartAt,
					duration: track.evearaPreviewDuration,
				},
				participant,
			};
		});

		const url = selectedRelease.logo;
		const parts = url.split('.');
		const extension = parts[parts.length - 1];

		const albumData = {
			releaseId: selectedRelease.id,
			name: selectedRelease.name,
			artists: [Number(artistId)],
			subscription_id,
			label_id,
			product_type,
			original_release_date,
			cover_image: {
				url,
				extension,
			},
			tracks,
			spatial_code_auto_generate: true,
		};
		if (selectedRelease.upc) {
			albumData.ean_upc = selectedRelease.upc;
			albumData.product_code_type = 'ean';
			// albumData.spatial_ean_upc = selectedRelease.upc;
			// albumData.spatial_product_code_type = 'upc';
			albumData.code_auto_generate = true;
		} else {
			albumData.code_auto_generate = true;
		}

		console.log('albumData: ', albumData);
		if (evearaReleaseId) {
			const { releaseId, ...newAlbumData } = albumData;
			const updateAlbumRes = await updateAlbumEveara({ evearaReleaseId, newAlbumData, axiosPrivate });
			console.log('updateAlbumRes: ', updateAlbumRes);
			if (!updateAlbumRes?.success) {
				const errorArr = updateAlbumRes?.errors?.map(el => el?.message);
				const errorText = errorArr?.length > 0 && errorArr.join(', ');
				getToast(
					'Error',
					`${errorText || updateAlbumRes.message || 'Something went wrong.'} Can't update album.`,
				);
				return;
			}
			// } else {
			// 	getToast('Success', 'Album info has been updated');
			// }
		} else {
			const addAlbumRes = await dispatch(addAlbumEveara({ albumData, axiosPrivate }));
			console.log('addAlbumRes: ', addAlbumRes);
			if (!addAlbumRes.payload?.success) {
				const errorArr = addAlbumRes?.payload?.errors?.map(el => el?.message);
				const errorText = errorArr?.length > 0 && errorArr.join(', ');
				getToast('Error', errorText || "Something went wrong. Can't save album. Try again later");
				return;
			}
			evearaReleaseId = addAlbumRes.payload?.evearaReleaseId;
		}

		if (albumStatus?.code === 1023) return;
		const [y, m, d] = selectedRelease.distributeDate?.split('-');

		const release_start_date = `${d}-${m}-${y}`;
		const outletsDetailsRes = await dispatch(
			getOutletsDetailsEveara({
				uuidEveara,
				releaseId: evearaReleaseId,
				axiosPrivate,
				release_start_date,
			}),
		);

		if (!outletsDetailsRes?.payload?.success) {
			getToast(
				'Error',
				outletsDetailsRes?.payload?.message ||
					"Something went wrong. Can't get info about outlets. Try again later",
			);
			return;
		}
		const evearaPriceId = {
			appleMusicReleasePriceId: '',
			appleMusicTrackPriceId: '',
			amazonReleasePriceId: '',
			amazonTrackPriceId: '',
		};

		const outlets_details = outletsDetailsRes?.payload?.outlets_details.map(el => {
			if (el.store_name === 'Apple Music') {
				evearaPriceId.appleMusicReleasePriceId = el.price_code.album_price_id;
				evearaPriceId.appleMusicTrackPriceId = el.price_code.track_price_id;
			} else if (el.store_name === 'Amazon Prime Music') {
				evearaPriceId.amazonReleasePriceId = el.price_code.album_price_id;
				evearaPriceId.amazonTrackPriceId = el.price_code.track_price_id;
			}

			return {
				store_id: el.store_id,
				release_start_date: el.release_start_date,
				release_end_date: el.release_end_date,
				price_code: el.price_code,
			};
		});
		console.log('outlets_details: ', outlets_details);
		const distributeRes = await dispatch(
			distributeReleaseEveara({
				releaseId: evearaReleaseId,
				uuid: uuidEveara,
				outlets_details,
				evearaPriceId,
				axiosPrivate,
			}),
		);
		if (distributeRes?.payload?.success) {
			await handleValidateAlbum({ uuidEveara, releaseId: evearaReleaseId });
			setIsAlreadyValidated(true);
			getToast('Success', distributeRes?.payload?.message);
			return;
		} else {
			const distributeRes = await dispatch(
				distributeReleaseEveara({
					releaseId: evearaReleaseId,
					uuid: uuidEveara,
					outlets_details,
					evearaPriceId,
					axiosPrivate,
				}),
			);
			await handleValidateAlbum({ uuidEveara, releaseId: evearaReleaseId });
			setIsAlreadyValidated(true);
			if (distributeRes?.payload?.success) {
				getToast('Success', distributeRes?.payload?.message);
			} else {
				getToast(
					'Error',
					(distributeRes?.payload?.errors?.length > 0 && distributeRes?.payload?.errors[0]?.message) ||
						"Something went wrong. Can't distribute album. Try again later",
				);
			}
		}
	};

	const handleSimulate = async () => {
		setIsSimulation(true);
		const res = await simulateDistibuteEveara({
			uuidEveara: user.uuidEveara,
			releaseId: selectedRelease?.evearaReleaseId,
		});
		if (res.success) {
			getToast('Success', res?.message);
		} else {
			getToast('Error', res?.message);
		}
		setIsSimulation(false);
	};

	useEffect(() => {
		if (selectedBap.isCreator) {
			dispatch(getParticipantsById({ id: user.id, type: 'creatorId', axiosPrivate }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedRelease?.evearaReleaseId && !isAlreadyValidated) {
			handleValidateAlbum({
				uuidEveara: user.uuidEveara,
				releaseId: selectedRelease?.evearaReleaseId,
			});
			setIsAlreadyValidated(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRelease?.evearaReleaseId, user.uuidEveara]);

	const pending = albumStatus?.code === 1033 || albumStatus?.code === 1039;
	return (
		<>
			{!isLoading && (
				<Flex mt='24px' flexDir='column'>
					{albumStatus.success && (
						<Box mb='16px' pl='24px'>
							<Flex gap='8px'>
								<Text fontWeight='500' color='black'>
									Release status(code):
								</Text>
								<Text fontWeight='400' color='black'>
									{albumStatus.title} ({albumStatus.code})
								</Text>
							</Flex>

							<Text fontWeight='400' color='black' textDecoration='underline'>
								{albumStatus.description}
							</Text>
						</Box>
					)}

					{albumStatus?.code === 1023 && (
						<CustomButton type='submit' w='250px' ml='auto' onClickHandler={handleDistribute}>
							Update information
						</CustomButton>
					)}
					{albumStatus?.code !== 1023 && !pending && (
						<CustomButton
							styles={btnDisabled ? 'disabled' : 'main'}
							type='submit'
							w='250px'
							ml='auto'
							onClickHandler={handleDistribute}
						>
							Distribute £10.00 per year
						</CustomButton>
					)}

					{pending && (
						<Flex
							mt='24px'
							p='12px'
							flexDir='column'
							gap='16px'
							borderRadius='10px'
							border='1px solid'
							bgColor='bg.secondary'
							borderColor='stroke'
						>
							<Text fontWeight='500' color='black' fontSize='20px'>
								SECTION FOR TEST
							</Text>
							<Text fontWeight='500' color='black' fontSize='18px'>
								release_id:&nbsp;
								<Text as='span' color='accent'>
									{selectedRelease?.evearaReleaseId}
								</Text>
							</Text>
							<Text>
								If you want to check your distribution balance and payment history, you need to make
								&apos;Simulate Distribute&apos; request. After this, you need to send &apos;release_id&apos;
								to Eveara&apos;s support so that they can add information about purchasing the album/track.
							</Text>
							<CustomButton w='250px' ml='auto' onClickHandler={handleSimulate} isSubmiting={isSimulating}>
								Simulate Distribute
							</CustomButton>
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default EvearaBlock;
