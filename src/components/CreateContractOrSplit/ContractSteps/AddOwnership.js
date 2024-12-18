import { useRouter } from 'next/router';

import {
	Flex,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Text,
	useToast,
} from '@chakra-ui/react';

import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getContractWithSignatureImages from 'src/functions/serverRequests/contracts/getContractWithSignatureImages';
import sendInviteToBap from 'src/functions/serverRequests/notifications/sendInviteToBap';
import {
	addTrackToSplit,
	createContract,
	createDealReference,
	createSplit,
	editOwnership,
} from 'store/operations';
import { setSelectedSplit } from 'store/slice';

import NextButton from '@/components/Buttons/NextButton/NextButton';

const AddOwnership = ({
	activeContractWriters,
	ownership,
	setOwnership,
	ownershipOldData,
	setOwnershipOldData,
	localSplitTracks,
	oldLocalSplitTracks,
	setLocalOldSplitTracks,
	usersToSplit,
	withContract,
	newUserToInviteToBap,
	setNewUserToInviteToBap,
	setIsModal,
}) => {
	const { selectedBap, user, selectedRelease, allSplitsAndContracts } = useSelector(
		state => state.user,
	);
	const selectedTracks = localSplitTracks.filter(el => el.selected);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();
	const { pathname } = useRouter();
	const axiosPrivate = useAxiosPrivate();
	const isReleasePage = pathname.includes('/releases');
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const isMyContractsAndSplitsPage = pathname.includes('/my-splits-contracts');

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 8000,
			isClosable: true,
		});
	};
	const isEqualOwnership = () => {
		const newKeys = Object.keys(ownership);
		const oldKeys = Object.keys(ownershipOldData);

		if (newKeys.length !== oldKeys.length) {
			return false;
		}
		for (let key of newKeys) {
			if (+ownership[key] !== +ownershipOldData[key]) return false;
		}
		return true;
	};
	const handleOwnership = (name, value) => {
		setOwnership(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const isShowNext = useCallback(() => {
		const total = Object.values(ownership).reduce((acc, value) => acc + Number(value), 0);
		if (total !== 100) return false;
		if (!selectedRelease.selectedSplit?.contractId) {
			for (let key in ownership) {
				const share = ownership[key] ? Number(ownership[key]) : 0;
				const isZero = share === 0;
				if (isZero) return false;
			}
		} else {
			for (let key in ownership) {
				const share = ownership[key] ? Number(ownership[key]) : 0;
				const isUserFromActiveContract = activeContractWriters?.find(
					el => el.email === key && el.ownership !== '0',
				);
				if (!isUserFromActiveContract && share === 0) return false;
			}
		}

		return true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ownership]);

	const showNext = isShowNext();
	const getDealList = () => {
		let allDeals;
		if (isReleasePage) {
			allDeals = selectedRelease.splitsAndContracts;
		} else if (isContractsAndSplitsPage) {
			allDeals = selectedBap.splitsAndContracts;
		} else if (isMyContractsAndSplitsPage) {
			allDeals = allSplitsAndContracts;
		}
		return allDeals;
	};
	const AddWriterOwnership = async () => {
		const ownershipInfo = Object.entries(ownership).reduce(
			(acc, [key, value]) => ({
				...acc,
				[key]: Number(value),
			}),
			{},
		);

		setIsLoading(true);
		let deal = selectedRelease.selectedSplit;
		const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;

		if (!deal?.splitId) {
			const releaseId = selectedRelease.id;
			const trackIds = selectedTracks.map(el => el.id);

			const data = {
				releaseId,
				trackIds,
				ownership: ownershipInfo,
				releaseName: selectedRelease?.name,
				bapName: selectedBap?.bapName,
				bapId: selectedBap?.bapId,
				userId: user?.id,
				allDeals: getDealList(),
				creatorOrAdmin,
			};

			if (withContract) {
				const result = await dispatch(createContract({ ...data }));
				if (result?.payload?.success) {
					getToast('Success', 'A contract has been created.');
					setOwnershipOldData({ ...ownership });
				}
			} else {
				const result = await dispatch(createSplit(data));
				if (result?.payload?.success) {
					getToast('Success', 'A split has been created');
					setOwnershipOldData({ ...ownership });
				}
			}
		} else {
			const newTrackIds = localSplitTracks?.filter(el => el.selected).map(el => el.id);
			const oldTrackIds = oldLocalSplitTracks.filter(el => el.selected).map(el => el.id);

			const sortedOldTracks = oldTrackIds.sort().toString();
			const sortedNewTracks = newTrackIds.sort().toString();
			let allDeals = getDealList();
			const isOldOwnewship = isEqualOwnership();
			const isOldTracks = sortedOldTracks === sortedNewTracks;
			if (isOldTracks && isOldOwnewship) {
				console.log('----------old deal, not edit----------');
				if (deal?.contractId) {
					const dealsWithSignatureImages = await getContractWithSignatureImages(deal, axiosPrivate);
					dispatch(setSelectedSplit(dealsWithSignatureImages));
				}
			} else {
				if (deal.recreateMode) {
					const res = await dispatch(
						createDealReference({ contract: deal, userId: user?.id, allDeals, creatorOrAdmin }),
					);
					if (res?.payload?.success) {
						deal = res.payload.contract;
						allDeals = res.payload.updatedAllDeals;
					} else {
						getToast(
							'Error',
							'Something has gone wrong. New contract has not been created. Try again later',
						);
						setIsLoading(false);
						return;
					}
				}
				if (!isOldTracks) {
					const splitTracks = localSplitTracks
						?.filter(el => el.selected)
						.map(el => ({ ...el, trackId: el.id, splitId: deal.splitId }));
					const dataWithNewTracks = {
						deal: { ...deal, splitTracks, completed: false },
						trackIds: [...newTrackIds],
						userId: user?.id,
						allDeals,
					};
					const res = await dispatch(addTrackToSplit(dataWithNewTracks));
					if (res?.payload?.success) {
						setLocalOldSplitTracks(localSplitTracks);
						deal = res?.payload?.deal;

						if (!deal?.contractId) {
							const tracksForOldVersion = [];
							for (const oldTrackId of oldTrackIds) {
								if (!newTrackIds.includes(oldTrackId)) {
									tracksForOldVersion.push(oldTrackId);
								}
							}
							if (tracksForOldVersion.length > 0) {
								const releaseId = selectedRelease.id;
								const data = {
									releaseId,
									trackIds: tracksForOldVersion,
									ownership: ownershipOldData,
									releaseName: selectedRelease?.name,
									bapName: selectedBap?.bapName,
									bapId: selectedBap?.bapId,
									userId: user?.id,
									allDeals,
									creatorOrAdmin,
									isSelectedSplit: false,
								};
								await dispatch(createSplit(data));
							}
						}
					} else {
						getToast('Error', 'Something has gone wrong. Tracks have not been changed. Try again later');
						setIsLoading(false);
						return;
					}
				}

				if (!isOldOwnewship || !isOldTracks) {
					const res = await dispatch(
						editOwnership({
							deal,
							ownership: ownershipInfo,
							userId: user?.id,
							allDeals,
						}),
					);

					if (res?.payload?.success) {
						setOwnershipOldData({ ...ownership });
						getToast('Success', 'Changes have been saved');
					} else {
						getToast('Error', 'Ownership changes have not been saved. Try again later');
						setIsLoading(false);
						return;
					}
				}
			}
		}

		if (newUserToInviteToBap.length) {
			await Promise.all(
				newUserToInviteToBap.map(async user => {
					const res = await sendInviteToBap(user, selectedBap?.bapId);
					if (!res.success) {
						const description = `Something has gone wrong. User with email(${
							user.email
						}) has been added to ${
							withContract ? 'contract' : 'split'
						}, but has not been invited to B.A.P.`;
						getToast('Error', description);
					}
				}),
			);
			setNewUserToInviteToBap([]);
		}
		// setCurrentStep(4);
		setIsModal(true);
		setIsLoading(false);
	};

	// const splitUsers = selectedRelease.selectedSplit?.splitUsers;
	// useEffect(() => {
	// 	if (splitUsers) {
	// 		const updatedUsersOwnershipInfo = splitUsers.filter(userInDatabase => {
	// 			return usersToSplit.some(localSplitUser => {
	// 				return userInDatabase.email === localSplitUser.email;
	// 			});
	// 		});
	// 		if (updatedUsersOwnershipInfo?.length > 0) {
	// 			const obj = {};
	// 			updatedUsersOwnershipInfo.forEach(el => {
	// 				const { email, ownership } = el;
	// 				obj[email] = ownership;
	// 			});
	// 			setOwnership(prev => ({ ...prev, ...obj }));
	// 			setOwnershipOldData(obj);
	// 		}
	// 	}
	// 	if (usersToSplit.length === 1) {
	// 		const obj = {};
	// 		usersToSplit.forEach(el => {
	// 			const { email } = el;
	// 			obj[email] = 100;
	// 		});
	// 		setOwnership(obj);
	// 	}
	// }, [splitUsers]);

	useEffect(() => {
		if (usersToSplit?.length === 1) {
			setOwnership(prev => ({
				...prev,
				[usersToSplit[0].email]: 100,
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [usersToSplit]);

	return (
		<Flex flexDir='column' h='100%' justify='space-between'>
			<Flex as='ul' flexDir='column' gap='4px'>
				{usersToSplit.map(el => (
					<Flex
						as='li'
						key={`${el.email}${el.id}`}
						p='12px'
						bg='bg.light'
						w='100%'
						justifyContent='space-between'
						alignItems='center'
						borderRadius='14px'
					>
						<Text color='black' fontSize='16px' fontWeight='500'>
							{el.firstName ? `${el.firstName} ${el.lastName || ''}` : el.email}
						</Text>
						<Flex align='center'>
							<Text color='secondary' fontSize='16px' fontWeight='500' mr='8px'>
								Ownership, %
							</Text>
							<NumberInput
								defaultValue={0}
								precision={2}
								step={1}
								max={100}
								min={0}
								borderRadius='5px'
								placeholder='%'
								name={el.email}
								value={ownership[el.email]}
								onChange={value => handleOwnership(el.email, value)}
								w='150px'
								allowMouseWheel
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</Flex>
					</Flex>
				))}
			</Flex>
			{showNext && <NextButton onClickHandler={AddWriterOwnership} isSubmiting={isLoading} />}
		</Flex>
	);
};

export default AddOwnership;
