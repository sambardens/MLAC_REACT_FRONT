import { createSlice } from '@reduxjs/toolkit';
import checkTrack from 'src/functions/utils/checkTrack';
import checkIsDuplicateRelease from 'src/functions/utils/release/checkIsDuplicateRelease';

import { handleSocialAuth, logIn, logOut } from './auth/auth-operations';
import {
	addAlbumEveara,
	addArtistEveara,
	addLabelEveara,
	addParticipantEveara,
	addTracksEveara,
	addUserSubscriptionsEveara,
	createUserAccountEveara,
	distributeReleaseEveara,
	getOutletsDetailsEveara,
	getParticipantsById,
} from './eveara/eveara-operations';
import {
	addCredit,
	addSignatureOrDispute,
	addTrackToSplit,
	changeSubscriptionStatus,
	convertSplitToContract,
	createBap,
	createContract,
	createDealReference,
	createLandingPage,
	createReleaseByOriginalAudio,
	createSplit,
	createWithdrawal,
	deleteDeal,
	deleteFeatureArtistFromTrack,
	deleteLandingPageInBap,
	deleteLandingPageInRelease,
	deleteOnlyContract,
	deleteShopInBap,
	deleteTrack,
	deleteUserAvatar,
	editBapInfo,
	editBapSomeFields,
	editFeaturedArtist,
	editLandingPage,
	editOwnership,
	editTracksPriceOrPosition,
	getBapGenres,
	getBapMembers,
	getBapReleases,
	getDealsByBapId,
	getDealsByReleaseId,
	getLandingPagesByBapId,
	getLandingPagesByReleaseId,
	getMailListById,
	getMyDeals,
	getOneLandingPage,
	getReleaseLinks,
	getShopsByBapId,
	getTracksToReleaseWithArtistLogo,
	getUserInfo,
	getUserSubscription,
	getUsersForDistribute,
	handleCreateRelease,
	handleEditRelease,
	handleEditTrack,
	handleEditTrackInfo,
	handleSaveReleaseLogo,
	inviteFeaturedArtistToTrack,
	removeSubscribe,
	saveBapGenres,
	saveReleaseLinks,
	saveUserAddress,
	saveUserData,
	setUserNewEmail,
	updateBapFromSpotifyAndAudd,
} from './operations';

const initialStateRelease = {
	id: '',
	name: '',
	type: '',
	logo: '',
	logoMin: '',
	bapId: '',
	bapName: '',
	releaseDate: '',
	checkedTracks: null,
	writers: null,
	splitsAndContracts: null,
	landingPages: null,
	shops: null,
	label: null,
	selectedSplit: null,
	releaseSpotifyId: null,
	releaseSpotifyUri: null,
	releasePrice: 0,
	designId: null,
	totalTracks: null,
	upc: null,
	copyrights: null,
	mainGenre: '',
	secondaryGenre: '',
	subGenres: [],
	usersWithDeals: [],
	evearaReleaseId: null,
	evearaLabelId: null,
	appleMusicReleasePriceId: null,
	appleMusicTrackPriceId: null,
	amazonReleasePriceId: null,
	amazonTrackPriceId: null,
	evearaReleaseLogo: null,
	outlets_details: null,
	participants: null,
	artwork: { error: true, size: 0, weight: 0 },
};

const initialStateBap = {
	mailList: [],
	isNew: false,
	bapId: '',
	bapName: '',
	bapMembers: [],
	role: '',
	bapDescription: '',
	bapArtistBio: '',
	src: '',
	designId: null,
	spotifyId: null,
	spotifyUri: null,
	facebookPixel: '',
	deezerId: null,
	napsterId: null,
	appleMusicId: null,
	soundCloudId: '',
	genres: {
		mainGenre: null,
		secondaryGenre: null,
		subGenres: [],
	},
	releases: null,
	socialLinks: [],
	brandStyles: {},
};

const initialStateUser = {
	id: '',
	firstName: '',
	lastName: '',
	email: '',
	balance: 0,
	provider: '',
	avatar: null,
	address: '',
	phone: '',
	isEmailConfirmed: false,
	paymentEmail: '',
	uuidEveara: '',
	isSubscribedOnMailing: null,
	accountStatus: '',
	thumbnail: null,
	newEmail: null,
	number: null,
	streetAddressOne: '',
	streetAddressTwo: '',
	city: '',
	regionState: '',
	postCodeZipCode: '',
	country: '',
	evearaSubscriptionId: null,
	createdAt: '',
	updatedAt: '',
	isNew: false,
};
const initialState = {
	deleteToken: null,
	takeoverToken: null,
	user: { ...initialStateUser },
	baps: null,
	isBapsMenuWide: true,
	selectedBap: { ...initialStateBap },
	selectedBapUpdated: { ...initialStateBap },
	selectedRelease: { ...initialStateRelease },
	isCreatingBap: false,
	isLoading: false,
	isError: null,
	isNewBapModal: false,
	isAddFromSpotifyModal: false,
	isAddNewReleaseModal: false,
	newSplit: false,
	splitTypeModalStatus: false,
	releaseSelectedMenu: 1,
	releaseScreen: 'review',
	allSplitsAndContracts: null,
	landingPages: null,
	shops: null,
	selectedLandingPage: null,
};

const slice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setArtwork(state, { payload }) {
			state.selectedRelease = { ...state.selectedRelease, artwork: payload };
		},
		setDeleteToken(state, action) {
			state.deleteToken = action.payload;
		},
		setTakeoverToken(state, action) {
			state.takeoverToken = action.payload;
		},
		setUser(state, action) {
			state.user = action.payload;
		},
		setBaps(state, action) {
			state.baps = action.payload;
		},
		setIsBapsWide(state, action) {
			state.isBapsMenuWide = action.payload;
		},
		updateBapInBapsList(state, action) {
			const updatedBap = action.payload;
			const notUpdatingBaps = state.baps.filter(bap => bap.bapId !== updatedBap.bapId);
			const allBaps = [...notUpdatingBaps, updatedBap];
			const sortedBaps = allBaps.sort((bapA, bapB) => bapB.bapId - bapA.bapId);
			state.baps = sortedBaps;
		},
		addBapToBapsList(state, action) {
			state.baps = action.payload;
		},
		addBap(state, action) {
			state.baps = [...state.baps, action.payload];
		},
		setPreparedBaps(state, action) {
			state.preparedBaps = action.payload;
		},
		setSelectedBap(state, action) {
			state.selectedBap = action.payload;
		},
		setBap(state, { payload }) {
			state.selectedBap = { ...payload };
			state.selectedBapUpdated = { ...payload };
		},

		setSelectedBapUpdated(state, action) {
			state.selectedBapUpdated = action.payload;
		},
		resetSelectedBap(state) {
			state.selectedBap = { ...initialStateBap };
		},
		resetMailingList(state) {
			state.selectedBap = { ...initialStateBap, mailList: [] };
		},
		resetSelectedBapUpdated(state) {
			state.selectedBapUpdated = { ...initialStateBap };
		},

		setIsCreatingBap(state, action) {
			state.isCreatingBap = action.payload;
		},
		resetUserState() {
			return { ...initialState };
		},
		setIsNewBapModal(state, action) {
			state.isNewBapModal = action.payload;
		},
		setReleaseToSelectedBap(state, { payload }) {
			state.selectedBap = {
				...state.selectedBap,
				releases: payload,
			};
		},
		setSelectedRelease(state, { payload }) {
			state.selectedBap = {
				...state.selectedBap,
				releases: state.selectedBap.releases.map(el => (el.id === payload.id ? payload : el)),
			};
			state.selectedRelease = payload;
		},
		resetSelectedRelease(state) {
			state.selectedRelease = { ...initialStateRelease };
		},
		resetSelectedSplit(state) {
			state.selectedRelease = { ...state.selectedRelease, selectedSplit: null };
		},

		setSelectedSplit(state, { payload }) {
			state.selectedRelease = {
				...state.selectedRelease,
				selectedSplit: { ...payload },
			};
		},
		setCheckedTracksOfRelease(state, { payload }) {
			state.selectedBap = {
				...state.selectedBap,
				releases: state.selectedBap.releases.map(el =>
					el.id === state.selectedRelease.id
						? { ...state.selectedRelease, checkedTracks: [...payload] }
						: el,
				),
			};
			state.selectedRelease = { ...state.selectedRelease, checkedTracks: [...payload] };
		},
		setSplitTypeModalStatus(state, { payload }) {
			state.splitTypeModalStatus = payload;
		},
		setReleaseSelectedMenu(state, { payload }) {
			state.releaseSelectedMenu = payload;
		},
		setReleaseScreen(state, { payload }) {
			state.releaseScreen = payload;
		},
		setDefaultReleaseModalMenuScreen(state) {
			state.splitTypeModalStatus = false;
			state.releaseSelectedMenu = 1;
			state.releaseScreen = 'review';
		},
		setLandingPage(state, { payload }) {
			state.selectedLandingPage = payload;
		},
		addTracksToRelease(state, { payload }) {
			state.selectedRelease = {
				...state.selectedRelease,
				checkedTracks: payload,
			};
		},
		setNewSplit(state, { payload }) {
			state.newSplit = payload;
		},
		syncSpotify(state, { payload }) {
			state.user = { ...state.user, spotifyId: payload };
		},
		setIsAddFromSpotifyModal(state, { payload }) {
			state.isAddFromSpotifyModal = payload;
		},
		setIsAddNewReleaseModal(state, { payload }) {
			state.isAddNewReleaseModal = payload;
		},
		setParticipants(state, { payload }) {
			state.user = { ...state.user, participants: payload };
		},
	},

	extraReducers: builder => {
		builder
			.addCase(logOut.fulfilled, () => ({ ...initialState }))
			.addCase(logOut.rejected, () => ({ ...initialState }))
			.addCase(logIn.fulfilled, (state, { payload }) => {
				state.user = { ...payload.user, subscriptions: null };
			})
			.addCase(handleSocialAuth.fulfilled, (state, { payload }) => {
				state.user = { ...payload.user, subscriptions: null };
			})
			.addCase(saveUserAddress.fulfilled, (state, { payload }) => {
				state.user = {
					...state.user,
					...payload.settings,
				};
			})
			.addCase(saveUserData.fulfilled, (state, { payload }) => {
				state.user = { ...state.user, ...payload.userData };
			})
			.addCase(deleteUserAvatar.fulfilled, state => {
				state.user = { ...state.user, avatar: null, avatarSrc: null, thumbnail: null };
			})
			.addCase(getTracksToReleaseWithArtistLogo.fulfilled, (state, { payload }) => {
				const checkedTracks = checkTrack({
					releaseSpotifyId: state.selectedRelease?.releaseSpotifyId || '',
					releaseTracks: payload.tracks,
				});

				state.selectedRelease = {
					...state.selectedRelease,
					checkedTracks,
				};
			})

			// .addCase(getTracksToSpotifyRelease.fulfilled, (state, { payload }) => {
			// 	state.selectedRelease = {
			// 		...state.selectedRelease,
			// 		checkedTracks: [...payload.tracks],
			// 		writers: [],
			// 		splitsAndContracts: [],
			// 	};
			// })

			.addCase(handleCreateRelease.fulfilled, (state, { payload }) => {
				if (payload?.success) {
					const releases =
						state.selectedBap?.releases?.length > 0
							? checkIsDuplicateRelease([...state.selectedBap.releases, { ...payload.release }])
							: [{ ...payload.release, isDuplicate: false }];
					state.selectedBap = {
						...state.selectedBap,
						releases,
					};
					state.selectedRelease = {
						...payload.release,
						checkedTracks: [],
						splitsAndContracts: [],
						landingPages: null,
						selectedSplit: null,
						isDuplicate: releases.find(el => el.id === payload.release.id)?.isDuplicate,
					};
				}
			})

			.addCase(handleEditRelease.fulfilled, (state, { payload }) => {
				const releases = checkIsDuplicateRelease(
					state.selectedBap.releases.map(el =>
						el.id === state.selectedRelease.id
							? {
									...state.selectedRelease,
									...payload.release,
							  }
							: el,
					),
				);
				state.selectedBap = {
					...state.selectedBap,
					releases,
				};
				state.selectedRelease = {
					...state.selectedRelease,
					...payload.release,
					isDuplicate: releases.find(el => el.id === payload.release.id)?.isDuplicate,
				};
			})
			.addCase(handleSaveReleaseLogo.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					releases: state.selectedBap.releases.map(el =>
						el.id === state.selectedRelease.id
							? {
									...state.selectedRelease,
									...payload,
							  }
							: el,
					),
				};
				state.selectedRelease = {
					...state.selectedRelease,
					...payload,
				};
			})

			.addCase(handleEditTrack.fulfilled, (state, { payload }) => {
				// state.selectedBap = {
				// 	...state.selectedBap,
				// 	releases: state.selectedBap.releases.map(el =>
				// 		el.id === state.selectedRelease.id
				// 			? {
				// 					...state.selectedRelease,
				// 					checkedTracks: state.selectedRelease.checkedTracks?.map(track =>
				// 						track.id === payload.id ? { ...payload } : track,
				// 					),
				// 			  }
				// 			: el,
				// 	),
				// };
				state.selectedRelease = {
					...state.selectedRelease,
					checkedTracks: state.selectedRelease.checkedTracks?.map(track =>
						track.id === payload.id ? { ...payload } : track,
					),
				};
			})
			.addCase(handleEditTrackInfo.fulfilled, (state, { payload }) => {
				// state.selectedBap = {
				// 	...state.selectedBap,
				// 	releases: state.selectedBap.releases
				// 		.map(el =>
				// 			el.id === state.selectedRelease.id
				// 				? {
				// 						...state.selectedRelease,
				// 						checkedTracks: state.selectedRelease.checkedTracks?.map(track =>
				// 							track.id === payload.id ? { ...payload } : track,
				// 						),
				// 				  }
				// 				: el,
				// 		)
				// 		.sort((a, b) => a.position - b.position),
				// };
				state.selectedRelease = {
					...state.selectedRelease,
					checkedTracks: state.selectedRelease.checkedTracks
						?.map(track => (track.id === payload.id ? { ...payload } : track))
						.sort((a, b) => a.position - b.position),
				};
			})

			.addCase(editTracksPriceOrPosition.fulfilled, (state, { payload }) => {
				if (payload.success) {
					// state.selectedBap = {
					// 	...state.selectedBap,
					// 	releases: state.selectedBap.releases.map(el =>
					// 		el.id === state.selectedRelease.id
					// 			? {
					// 					...state.selectedRelease,
					// 					checkedTracks: payload.tracks,
					// 			  }
					// 			: el,
					// 	),
					// };
					state.selectedRelease = {
						...state.selectedRelease,
						checkedTracks: payload.tracks,
					};
				}
			})

			.addCase(deleteTrack.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					checkedTracks: payload.releaseTracks,
				};
			})

			.addCase(getDealsByReleaseId.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					splitsAndContracts: payload.splitsAndContracts,
					writers: payload.writers,
				};
			})

			.addCase(getMailListById.fulfilled, (state, { payload }) => {
				state.selectedBap = { ...state.selectedBap, mailList: payload.data };
			})

			.addCase(removeSubscribe.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					mailList: state.selectedBap.mailList?.filter(mail => mail.userId !== payload.userId),
				};
			})

			.addCase(getDealsByBapId.fulfilled, (state, { payload }) => {
				state.selectedBap = { ...state.selectedBap, splitsAndContracts: payload.splitsAndContracts };
			})

			.addCase(getMyDeals.fulfilled, (state, { payload }) => {
				state.allSplitsAndContracts = payload.allSplitsAndContracts;
			})

			.addCase(getUserInfo.fulfilled, (state, { payload }) => {
				state.user = { ...payload.user, subscriptions: null };
			})

			.addCase(inviteFeaturedArtistToTrack.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					checkedTracks: state.selectedRelease.checkedTracks.map(el =>
						el.id === payload.trackId
							? {
									...el,
									featureArtists: [...el.featureArtists, payload.featureArtist],
							  }
							: el,
					),
					splitsAndContracts: state.selectedRelease.splitsAndContracts.map(deal => {
						return {
							...deal,
							splitTracks: deal.splitTracks.map(track =>
								track.trackId === payload.trackId
									? {
											...track,
											featureArtists:
												track.featureArtists?.length > 0
													? [...track.featureArtists, payload.featureArtist]
													: [payload.featureArtist],
									  }
									: track,
							),
						};
					}),
				};
			})

			.addCase(editFeaturedArtist.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					checkedTracks: state.selectedRelease.checkedTracks.map(el =>
						el.id === payload?.featureArtist?.trackId
							? {
									...el,
									featureArtists: el.featureArtists.map(artist =>
										artist.id === payload.featureArtist.id ? payload.featureArtist : artist,
									),
							  }
							: el,
					),
					splitsAndContracts: state.selectedRelease.splitsAndContracts.map(deal => {
						return {
							...deal,
							splitTracks: deal.splitTracks.map(track =>
								track.trackId === payload?.featureArtist?.trackId
									? {
											...track,
											featureArtists: track.featureArtists.map(artist =>
												artist.id === payload.featureArtist.id ? payload.featureArtist : artist,
											),
									  }
									: track,
							),
						};
					}),
				};
			})

			.addCase(deleteFeatureArtistFromTrack.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					checkedTracks: state.selectedRelease.checkedTracks?.map(el =>
						el.id === payload.trackId
							? {
									...el,
									featureArtists: el.featureArtists.filter(artist => artist.id !== payload.artistId),
							  }
							: el,
					),
					splitsAndContracts: state.selectedRelease.splitsAndContracts.map(deal => {
						return {
							...deal,
							splitTracks: deal.splitTracks.map(track =>
								track.trackId === payload.trackId
									? {
											...track,
											featureArtists: track.featureArtists.filter(artist => artist.id !== payload.artistId),
									  }
									: track,
							),
						};
					}),
				};
			})

			.addCase(createContract.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedRelease = {
						...state.selectedRelease,
						selectedSplit: { ...payload.contract },
						splitsAndContracts:
							state.selectedRelease.splitsAndContracts.length > 0
								? [payload.contract, ...state.selectedRelease.splitsAndContracts]
								: [payload.contract],
					};
				}
			})
			.addCase(createDealReference.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					selectedSplit: { ...payload.contract },
					splitsAndContracts: state.selectedRelease.splitsAndContracts?.length > 0 && [
						...payload.updatedAllDeals,
					],
				};
				if (state.selectedBap.splitsAndContracts?.length > 0) {
					state.selectedBap = {
						...state.selectedBap,
						splitsAndContracts: [...payload.updatedAllDeals],
					};
				}
				if (state.allSplitsAndContracts?.length > 0) {
					state.allSplitsAndContracts = [...payload.updatedAllDeals];
				}
			})

			.addCase(convertSplitToContract.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					selectedSplit: {
						...payload.contract,
					},
					splitsAndContracts: payload.isReleasePage
						? [
								payload.contract,
								...state.selectedRelease.splitsAndContracts.map(el =>
									!el.contractId && el.splitId === payload.split.splitId ? payload.split : el,
								),
						  ]
						: null,
				};
				if (payload.isContractsAndSplitsPage) {
					state.selectedBap = {
						...state.selectedBap,
						splitsAndContracts: [
							payload.contract,
							...state.selectedBap.splitsAndContracts.map(el =>
								!el.contractId && el.splitId === payload.split.splitId ? payload.split : el,
							),
						],
					};
				}
				if (payload.isMyContractsAndSplitsPage) {
					state.allSplitsAndContracts = [
						payload.contract,
						...state.allSplitsAndContracts.map(el =>
							!el.contractId && el.splitId === payload.split.splitId ? payload.split : el,
						),
					];
				}
			})

			.addCase(createSplit.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedRelease = {
						...state.selectedRelease,
						selectedSplit: payload.isSelectedSplit
							? { ...payload.split }
							: state.selectedRelease.selectedSplit,
						splitsAndContracts: [payload.split, ...state.selectedRelease.splitsAndContracts],
					};
					if (state.selectedBap?.splitsAndContracts) {
						state.selectedBap = {
							...state.selectedBap,
							splitsAndContracts: [payload.split, ...state.selectedBap.splitsAndContracts],
						};
					}
				}
			})
			.addCase(editOwnership.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					selectedSplit: { ...payload.result },
					splitsAndContracts: state.selectedRelease.splitsAndContracts.map(el =>
						el.splitId === payload.result.splitId ? payload.result : el,
					),
				};
				if (state.selectedBap.splitsAndContracts?.length > 0) {
					state.selectedBap = {
						...state.selectedBap,
						splitsAndContracts: state.selectedBap.splitsAndContracts.map(el =>
							el.splitId === payload.result.splitId ? payload.result : el,
						),
					};
				}
				if (state.allSplitsAndContracts?.length > 0) {
					state.allSplitsAndContracts = state.allSplitsAndContracts.map(el =>
						el.splitId === payload.result.splitId ? payload.result : el,
					);
				}
			})

			.addCase(deleteDeal.fulfilled, (state, { payload }) => {
				if (payload.success) {
					if (state.selectedRelease?.splitsAndContracts?.length > 0) {
						state.selectedRelease = {
							...state.selectedRelease,
							splitsAndContracts: state.selectedRelease.splitsAndContracts
								.filter(el => el.splitId !== payload.splitId)
								.map(el => {
									if (payload?.referenceContractId && payload?.referenceContractId === el?.contractId) {
										return { ...el, recreateMode: true, showMore: true };
									}
									return el;
								}),
							selectedSplit: null,
						};
					}
					if (state.selectedBap?.splitsAndContracts?.length > 0) {
						state.selectedRelease = {
							...state.selectedRelease,
							selectedSplit: null,
						};
						state.selectedBap = {
							...state.selectedBap,
							splitsAndContracts: state.selectedBap.splitsAndContracts
								.filter(el => el.splitId !== payload.splitId)
								.map(el => {
									if (payload?.referenceContractId && payload?.referenceContractId === el?.contractId) {
										return { ...el, recreateMode: true, showMore: true };
									}
									return el;
								}),
						};
					}
					if (state?.allSplitsAndContracts?.length > 0) {
						state.allSplitsAndContracts = state.allSplitsAndContracts
							.filter(el => el.splitId !== payload.splitId)
							.map(el => {
								if (payload?.referenceContractId && payload?.referenceContractId === el?.contractId) {
									return { ...el, recreateMode: true, showMore: true };
								}
								return el;
							});
					}
				}
			})

			.addCase(deleteOnlyContract.fulfilled, (state, { payload }) => {
				if (payload.success) {
					if (state.selectedRelease?.splitsAndContracts?.length > 0) {
						state.selectedRelease = {
							...state.selectedRelease,
							splitsAndContracts: state.selectedRelease.splitsAndContracts
								.filter(el => el.contractId !== payload.contractId)
								.map(el =>
									el.splitId === payload.splitId ? { ...el, isEditableDeal: true, showMore: true } : el,
								),
							selectedSplit: null,
						};
					}
					if (state.selectedBap?.splitsAndContracts?.length > 0) {
						state.selectedRelease = {
							...state.selectedRelease,
							selectedSplit: null,
						};
						state.selectedBap = {
							...state.selectedBap,
							splitsAndContracts: state.selectedBap.splitsAndContracts
								.filter(el => el.contractId !== payload.contractId)
								.map(el =>
									el.splitId === payload.splitId ? { ...el, isEditableDeal: true, showMore: true } : el,
								),
						};
					}
					if (state?.allSplitsAndContracts?.length > 0) {
						state.allSplitsAndContracts = state.allSplitsAndContracts
							.filter(el => el.contractId !== payload.contractId)
							.map(el =>
								el.splitId === payload.splitId ? { ...el, isEditableDeal: true, showMore: true } : el,
							);
					}
				}
			})

			.addCase(createLandingPage.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					landingPages:
						state.selectedRelease?.landingPages?.length > 0
							? [payload.landingPage, ...state.selectedRelease.landingPages]
							: [payload.landingPage],
				};
			})

			.addCase(editLandingPage.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					landingPages: state.selectedRelease?.landingPages?.map(el =>
						el.id === payload.landingPage.id ? payload.landingPage : el,
					),
				};
				state.selectedBap = {
					...state.selectedBap,
					landingPages: state.selectedBap?.landingPages?.map(el =>
						el.id === payload.landingPage.id ? payload.landingPage : el,
					),
				};
			})

			.addCase(addTrackToSplit.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedRelease = {
						...state.selectedRelease,
						splitsAndContracts: state.selectedRelease.splitsAndContracts.map(el =>
							el.splitId === payload.deal.splitId ? { ...payload.deal } : el,
						),
						selectedSplit: { ...payload.deal },
					};

					if (state.selectedBap?.splitsAndContracts?.length > 0) {
						state.selectedBap = {
							...state.selectedBap,
							splitsAndContracts: state.selectedBap.splitsAndContracts.map(el =>
								el.splitId === payload.deal.splitId ? { ...payload.deal } : el,
							),
						};
					}

					if (state.allSplitsAndContracts?.length > 0) {
						state.allSplitsAndContracts = state.allSplitsAndContracts.map(el =>
							el.splitId === payload.deal.splitId ? { ...payload.deal } : el,
						);
					}
				}
			})

			.addCase(getLandingPagesByReleaseId.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					landingPages: payload.landingPage,
				};
			})

			.addCase(getLandingPagesByBapId.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					landingPages: payload.landingPage,
				};
			})
			// .addCase(getShopsByReleaseId.fulfilled, (state, { payload }) => {
			// 	state.selectedRelease = {
			// 		...state.selectedRelease,
			// 		shops: payload.shops,
			// 	};
			// })
			.addCase(getShopsByBapId.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					shops: payload.shops,
				};
			})
			.addCase(getOneLandingPage.fulfilled, (state, { payload }) => {
				state.selectedLandingPage = payload.landingPage;
			})
			.addCase(deleteLandingPageInRelease.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					landingPages: state.selectedRelease.landingPages.filter(el => el?.id !== payload.id),
				};
			})
			.addCase(deleteLandingPageInBap.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					landingPages: state.selectedBap.landingPages.filter(el => el?.id !== payload.id),
				};
			})
			.addCase(deleteShopInBap.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					shops: state.selectedBap.shops.filter(el => el?.id !== payload.id),
				};
			})
			.addCase(addSignatureOrDispute.fulfilled, (state, { payload }) => {
				if (!payload.success) return;
				const dealsInState = state.selectedRelease?.splitsAndContracts || [];
				const deals = payload.secondContract ? [...dealsInState, payload.secondContract] : dealsInState;
				state.selectedRelease = {
					...state.selectedRelease,
					splitsAndContracts: deals?.map(el => {
						if (payload.newCancelled) {
							if (el.contractId === payload.contract.contractId) {
								return { ...payload.contract, ...payload.newCancelled };
							} else if (!el.contractId && el.splitId === payload.contract.splitId) {
								return { ...payload.updatedSplit };
							} else {
								return el;
							}
						} else {
							if (el.contractId === payload.contract.contractId) {
								return payload.contract;
							} else if (
								payload.isOriginalContractExpired &&
								el.contractId === payload.contract.referenceContractId
							) {
								return { ...el, ...payload.oldContractStatus };
							} else if (
								payload.isNewActiveContract &&
								!el.contractId &&
								el.splitId === payload.contract.splitId
							) {
								return {
									...el,
									...payload.oldContractStatus,
									isEditableDeal: false,
									showMore: false,
									isCanDelete: false,
								};
							} else {
								return el;
							}
						}
					}),
					selectedSplit: payload.contract,
				};

				if (state.selectedBap.splitsAndContracts?.length > 0) {
					const bapDeals = payload.secondContract
						? [...state.selectedBap?.splitsAndContracts, payload.secondContract]
						: state.selectedBap?.splitsAndContracts;
					state.selectedBap = {
						...state.selectedBap,
						splitsAndContracts: bapDeals.map(el => {
							if (payload.newCancelled) {
								if (el.contractId === payload.contract.contractId) {
									return { ...payload.contract, ...payload.newCancelled };
								} else if (!el.contractId && el.splitId === payload.contract.splitId) {
									return { ...payload.updatedSplit };
								} else {
									return el;
								}
							} else {
								if (el.contractId === payload.contract.contractId) {
									return payload.contract;
								} else if (
									payload.isOriginalContractExpired &&
									el.contractId === payload.contract.referenceContractId
								) {
									return { ...el, ...payload.oldContractStatus };
								} else if (
									payload.isNewActiveContract &&
									!el.contractId &&
									el.splitId === payload.contract.splitId
								) {
									return {
										...el,
										...payload.oldContractStatus,
										isEditableDeal: false,
										showMore: false,
										isCanDelete: false,
									};
								} else {
									return el;
								}
							}
						}),
					};
				}
				if (state.allSplitsAndContracts?.length > 0) {
					const userDeals = payload.secondContract
						? [...state.allSplitsAndContracts, payload.secondContract]
						: state.allSplitsAndContracts;
					state.allSplitsAndContracts = userDeals.map(el => {
						if (payload.newCancelled) {
							if (el.contractId === payload.contract.contractId) {
								return { ...payload.contract, ...payload.newCancelled };
							} else if (!el.contractId && el.splitId === payload.contract.splitId) {
								return { ...payload.updatedSplit };
							} else {
								return el;
							}
						} else {
							if (el.contractId === payload.contract.contractId) {
								return payload.contract;
							} else if (
								payload.isOriginalContractExpired &&
								el.contractId === payload.contract.referenceContractId
							) {
								return { ...el, ...payload.oldContractStatus };
							} else if (
								payload.isNewActiveContract &&
								!el.contractId &&
								el.splitId === payload.contract.splitId
							) {
								return {
									...el,
									...payload.oldContractStatus,
									isEditableDeal: false,
									showMore: false,
									isCanDelete: false,
								};
							} else {
								return el;
							}
						}
					});
				}
			})

			.addCase(createUserAccountEveara.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.user = { ...state.user, uuidEveara: payload.uuidEveara };
				}
			})

			.addCase(updateBapFromSpotifyAndAudd.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedBap = {
						...state.selectedBap,
						...payload.newBapData,
					};
					state.baps = state.baps.map(bap =>
						bap.bapId === payload.bapId ? { ...bap, ...payload.newBapData } : bap,
					);
				}
			})

			.addCase(createBap.fulfilled, (state, { payload }) => {
				state.baps = [payload, ...state.baps];
				state.selectedBap = { ...payload };
				state.selectedBapUpdated = { ...payload };
			})

			.addCase(getBapGenres.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					genres: { ...payload },
				};
				state.selectedBapUpdated = {
					...state.selectedBapUpdated,
					genres: { ...payload },
				};
			})
			.addCase(getBapMembers.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					...payload.data,
				};
				state.selectedBapUpdated = {
					...state.selectedBapUpdated,
					...payload.data,
				};
			})
			.addCase(getBapReleases.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					releases: payload.releases,
				};
				state.selectedBapUpdated = {
					...state.selectedBapUpdated,
					releases: payload.releases,
				};
			})

			.addCase(saveBapGenres.fulfilled, (state, { payload }) => {
				state.selectedBap = {
					...state.selectedBap,
					...payload,
				};
				state.selectedBapUpdated = {
					...state.selectedBapUpdated,
					...payload,
				};
			})

			.addCase(editBapInfo.fulfilled, (state, { payload }) => {
				state.baps = state.baps.map(el => (el.bapId === payload.bapId ? { ...el, ...payload } : el));
				state.selectedBap = {
					...state.selectedBap,
					...payload,
				};
				state.selectedBapUpdated = {
					...state.selectedBapUpdated,
					...payload,
				};
			})
			.addCase(editBapSomeFields.fulfilled, (state, { payload }) => {
				state.baps = state.baps.map(el => (el.bapId === payload.bapId ? { ...el, ...payload } : el));
				state.selectedBap = {
					...state.selectedBap,
					...payload,
				};
				state.selectedBapUpdated = {
					...state.selectedBapUpdated,
					...payload,
				};
			})

			.addCase(createWithdrawal.fulfilled, (state, { payload }) => {
				state.user = {
					...state.user,
					balance: state.user.balance - payload.withdraw.amount,
				};
			})

			.addCase(getUserSubscription.fulfilled, (state, { payload }) => {
				state.user = {
					...state.user,
					subscriptions: payload.bapIds,
				};
			})
			.addCase(changeSubscriptionStatus.fulfilled, (state, { payload }) => {
				if (payload.type === 'add') {
					state.user = {
						...state.user,
						subscriptions: state.user.subscriptions
							? [payload.bapId, ...state.user.subscriptions]
							: [payload.bapId],
					};
				}
				if (payload.type === 'remove') {
					state.user = {
						...state.user,
						subscriptions: state.user.subscriptions.filter(el => el !== payload.bapId),
					};
				}
			})
			.addCase(setUserNewEmail.fulfilled, (state, { payload }) => {
				state.user = { ...state.user, newEmail: payload.user.user.newEmail };
			})

			.addCase(createReleaseByOriginalAudio.fulfilled, (state, { payload }) => {
				if (payload.success) {
					const payloadRelease = {
						checkedTracks: [{ ...payload.track }],
						splitsAndContracts: [],
						landingPages: null,
						selectedSplit: null,
					};
					const releases =
						state.selectedBap?.releases?.length > 0
							? checkIsDuplicateRelease([...state.selectedBap.releases, { ...payload.release }])
							: [{ ...payload.release, isDuplicate: false }];
					state.selectedBap = {
						...state.selectedBap,
						releases,
					};
					state.selectedRelease = {
						...payload.release,
						checkedTracks: [{ ...payload.track }],
						splitsAndContracts: [],
						landingPages: null,
						selectedSplit: null,
						isDuplicate: releases.find(el => el.id === payload.release.id)?.isDuplicate,
					};
				}
			})
			.addCase(saveReleaseLinks.fulfilled, (state, { payload }) => {
				state.selectedRelease = { ...state.selectedRelease, releaseLinks: [...payload.releaseLinks] };
			})
			.addCase(getReleaseLinks.fulfilled, (state, { payload }) => {
				state.selectedRelease = { ...state.selectedRelease, releaseLinks: [...payload.releaseLinks] };
			})
			.addCase(getUsersForDistribute.fulfilled, (state, { payload }) => {
				state.selectedRelease = { ...state.selectedRelease, usersWithDeals: [...payload.users] };
			})
			.addCase(addArtistEveara.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.baps = state.baps.map(bap =>
						bap.bapId === payload.bapId ? { ...bap, evearaBapId: payload.evearaBapId } : bap,
					);
					state.selectedBap = { ...state.selectedBap, evearaBapId: payload.evearaBapId };
				}
			})

			.addCase(addLabelEveara.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedBap = {
						...state.selectedBap,
						releases: state.selectedBap.releases.map(el =>
							el.id === payload.releaseId ? { ...el, evearaLabelId: payload.evearaLabelId } : el,
						),
					};
					state.selectedRelease = { ...state.selectedRelease, evearaLabelId: payload.evearaLabelId };
				}
			})

			.addCase(addTracksEveara.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedRelease = {
						...state.selectedRelease,
						splitsAndContracts: state.selectedRelease.splitsAndContracts.map(el => {
							const splitTracks = el.splitTracks.map(track => {
								const addedTrack = payload.tracks.find(evearaTrack => evearaTrack.id === track.trackId);
								return addedTrack ? { ...track, evearaTrackId: addedTrack.evearaTrackId } : track;
							});
							return { ...el, splitTracks };
						}),
						checkedTracks: state.selectedRelease.checkedTracks.map(track => {
							const addedTrack = payload.tracks.find(evearaTrack => evearaTrack?.id === track.id);
							return addedTrack ? { ...track, evearaTrackId: addedTrack.evearaTrackId } : track;
						}),
					};
				}
			})

			.addCase(addAlbumEveara.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedBap = {
						...state.selectedBap,
						releases: state.selectedBap.releases.map(el =>
							el.id === payload.releaseId ? { ...el, evearaReleaseId: payload.evearaReleaseId } : el,
						),
					};
					state.selectedRelease = { ...state.selectedRelease, evearaReleaseId: payload.evearaReleaseId };
				}
			})

			.addCase(addUserSubscriptionsEveara.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.user = { ...state.user, evearaSubscriptionId: payload.evearaSubscriptionId };
				}
			})
			.addCase(getOutletsDetailsEveara.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.selectedRelease = {
						...state.selectedRelease,
						outlets_details: payload.outlets_details,
					};
				}
			})
			.addCase(getParticipantsById.fulfilled, (state, { payload }) => {
				if (payload.type === 'creatorId') {
					state.user = {
						...state.user,
						participants: payload.participants,
					};
				} else {
					state.user = {
						...state.user,
						participantsInfo: payload.participants,
					};
				}
			})

			.addCase(addParticipantEveara.fulfilled, (state, { payload }) => {
				state.user = {
					...state.user,
					participants: [...state.user.participants, payload.participant],
				};
			})
			.addCase(distributeReleaseEveara.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					...payload.evearaPriceId,
				};
				state.selectedBap = {
					...state.selectedBap,
					releases: state.selectedBap.releases.map(el =>
						el.id === state.selectedRelease.id ? { ...el, ...payload.evearaPriceId } : el,
					),
				};
			})

			.addCase(addCredit.fulfilled, (state, { payload }) => {
				state.selectedRelease = {
					...state.selectedRelease,
					splitsAndContracts: state.selectedRelease.splitsAndContracts.map(deal => ({
						...deal,
						splitTracks: deal.splitTracks.map(track => {
							if (track.trackId === payload.credit.trackId) {
								let updatedCredits = [];

								if (payload.credit.creditIds?.length === 0) {
									if (payload.credit.userId) {
										updatedCredits = track.credits.filter(el => el.userId !== payload.credit.userId);
									} else {
										updatedCredits = track.credits.filter(el => el.name !== payload.credit.name);
									}
								} else {
									if (payload.credit.userId) {
										const isAlreadyAdded = track.credits.find(el => el.userId === payload.credit.userId);
										if (isAlreadyAdded) {
											updatedCredits = track.credits.map(el =>
												el.userId === payload.credit.userId
													? { ...el, creditIds: payload.credit.creditIds }
													: el,
											);
										} else {
											updatedCredits = [...track.credits, payload.credit];
										}
									} else {
										const isAlreadyAdded = track.credits.find(el => el.name === payload.credit.name);
										if (isAlreadyAdded) {
											updatedCredits = track.credits.map(el =>
												el.name === payload.credit.name ? { ...el, creditIds: payload.credit.creditIds } : el,
											);
										} else {
											updatedCredits = [...track.credits, payload.credit];
										}
									}
								}
								return { ...track, credits: updatedCredits };
							} else {
								return track;
							}
						}),
					})),
				};
			})

			.addMatcher(handleSuccess, state => {
				state.isError = null;
				state.isLoading = false;
			})
			.addMatcher(handleError, (state, { payload }) => {
				state.isLoading = false;
				if (payload) {
					state.isError = payload.message || payload.error;
				} else {
					state.isError = 'No connection to database';
				}
			})
			.addMatcher(handleLoading, state => {
				state.isError = null;
				state.isLoading = true;
			});
	},
});

function handleError(action) {
	return action.type?.startsWith('user') && action.type?.endsWith('rejected');
}

function handleLoading(action) {
	return action.type?.startsWith('user') && action.type?.endsWith('pending');
}

function handleSuccess(action) {
	return action.type?.startsWith('user') && action.type?.endsWith('fulfilled');
}
export const {
	setDeleteToken,
	setTakeoverToken,
	setUser,
	setBaps,
	setIsBapsWide,
	addBapToBapsList,
	addBap,
	setPreparedBaps,
	setSelectedBap,
	setSelectedBapUpdated,
	setIsCreatingBap,
	resetUserState,
	setIsNewBapModal,
	setReleaseToSelectedBap,
	setSelectedRelease,
	resetSelectedSplit,
	resetSelectedRelease,
	updateBapInBapsList,
	addFeaturedArtistToTrack,
	deleteFeaturedArtistFromTrack,
	setSelectedSplit,
	setCheckedTracksOfRelease,
	setSplitTypeModalStatus,
	setReleaseSelectedMenu,
	setReleaseScreen,
	setDefaultReleaseModalMenuScreen,
	setLandingPage,
	addTracksToRelease,
	setNewSplit,
	syncSpotify,
	setIsAddFromSpotifyModal,
	setIsAddNewReleaseModal,
	resetSelectedBap,
	resetSelectedBapUpdated,
	resetMailingList,
	setBap,
	setParticipants,
	setArtwork,
} = slice.actions;

export default slice.reducer;
