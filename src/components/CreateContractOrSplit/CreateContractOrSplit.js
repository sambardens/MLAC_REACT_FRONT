import { useRouter } from 'next/router';

import { Flex, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getMembersOfBap from 'src/functions/serverRequests/bap/getMembersOfBap';
import getPendingNotifications from 'src/functions/serverRequests/notifications/getPendingNotifications';
import { getDealsByReleaseId } from 'store/operations';
import {
	resetSelectedBap,
	setNewSplit,
	setReleaseScreen,
	setReleaseSelectedMenu,
	setSplitTypeModalStatus,
} from 'store/slice';

import BackButton from '@/components/Buttons/BackButton/BackButton';
import CustomButton from '@/components/Buttons/CustomButton';
import ContractModal from '@/components/Contracts/ContractModal/ContractModal';
import ContainerLoader from '@/components/Loaders/ContainerLoader';

import ProgressLine from '../ProgressLine/ProgressLine';
import StepLayout from '../Releases/StepLayout/StepLayout';

import AddOwnership from './ContractSteps/AddOwnership';
import AddTracksToSplit from './ContractSteps/AddTracksToSplit';
import AddWriters from './ContractSteps/AddWriters';

const CreateContractOrSplit = ({ withContract, setWithContract, setIsStartPage }) => {
	const { pathname } = useRouter();
	const isReleasePage = pathname.includes('/releases');
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const isMyContractsAndSplitsPage = pathname.includes('/my-splits-contracts');
	const axiosPrivate = useAxiosPrivate();
	const { selectedBap, selectedRelease, newSplit, user, allSplitsAndContracts } = useSelector(
		state => state.user,
	);
	const toast = useToast();
	const [availableTracksLoaded, setAvailableTracksLoaded] = useState(false);
	const { selectedSplit, checkedTracks, splitsAndContracts } = selectedRelease;
	const [currentStep, setCurrentStep] = useState(1);
	const [ownership, setOwnership] = useState({});
	const [ownershipOldData, setOwnershipOldData] = useState({});
	const [isInitialOwnershipLoaded, setIsInitialOwnershipLoaded] = useState(false);
	const [isSelectedSplitChecked, setIsSelectedSplitChecked] = useState(Boolean(newSplit));

	const [isModal, setIsModal] = useState(false);
	const [localSplitTracks, setLocalSplitTracks] = useState([]);
	const [oldLocalSplitTracks, setLocalOldSplitTracks] = useState([]);

	//  >>>>>>>>>>>>>> WRITERS <<<<<<<<<<<<<<
	const [activeContractWriters, setActiveContractWriters] = useState([]);
	const [usersToSplit, setUsersToSplit] = useState([]);
	const [initialMembers, setInitialMembers] = useState([]);
	const [members, setMembers] = useState([]);
	const [artists, setArtists] = useState([]);
	const [initialInvitedUsersToBap, setInitialInvitedUsersToBap] = useState([]);
	const [invitedUsersToBap, setInvitedUsersToBap] = useState([]);
	const [newUserToInviteToBap, setNewUserToInviteToBap] = useState([]);

	const dispatch = useDispatch();
	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};
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

	const onBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		} else if (setIsStartPage) {
			setIsStartPage(true);
		} else {
			dispatch(setReleaseSelectedMenu(3));
			dispatch(setReleaseScreen('main'));
		}
	};
	const handleCancel = () => {
		if (setIsStartPage) {
			setIsStartPage(true);
		} else {
			dispatch(setReleaseSelectedMenu(3));
			dispatch(setReleaseScreen('main'));
		}
		if (isMyContractsAndSplitsPage) {
			dispatch(resetSelectedBap());
		}
	};

	useEffect(() => {
		const getOutgoingInvitations = async () => {
			const invitedUsersFromServer = await getPendingNotifications(selectedBap.bapId, axiosPrivate);
			const membersEmails = initialMembers.map(user => user.email);
			const invitedUsersWithEmail = invitedUsersFromServer?.filter(
				user => user.email && !membersEmails.includes(user.email),
			);

			if (invitedUsersWithEmail?.length > 0) {
				setInitialInvitedUsersToBap(invitedUsersWithEmail);
				const updatedInviteUsers = invitedUsersWithEmail.filter(inviteUser => {
					return !usersToSplit.some(splitUser => {
						return inviteUser.id === splitUser.id || inviteUser.email === splitUser.email;
					});
				});
				setInvitedUsersToBap(updatedInviteUsers);
			}
		};
		if (selectedBap?.bapId && initialMembers?.length > 0) {
			getOutgoingInvitations();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.bapId, initialMembers]);

	useEffect(() => {
		const getMembers = async () => {
			const resBapMembers = await getMembersOfBap(selectedBap?.bapId, axiosPrivate);
			if (resBapMembers.success) {
				setMembers(resBapMembers.members);
				setInitialMembers(resBapMembers.members);
			} else {
				getToast('error', 'Error', "Something went wrong. Can't get B.A.P. members");
			}
		};
		selectedBap?.bapId && getMembers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [axiosPrivate, selectedBap?.bapId]);

	useEffect(() => {
		if (splitsAndContracts?.length >= 0 && !availableTracksLoaded && checkedTracks.length > 0) {
			const getAvalaibleTracks = async () => {
				if (selectedSplit?.splitId && !newSplit) {
					const tracksInUse = splitsAndContracts
						.filter(el => {
							if (el.isCancelled) {
								return false;
							} else if (el.type === 'split') {
								return el.status !== 2 && el.splitId !== selectedSplit.splitId;
							} else {
								return (
									el.status !== 2 &&
									el.splitId !== selectedSplit.splitId &&
									selectedSplit?.referenceContractId !== el?.contractId
								);
							}
						})
						.map(el => el.splitTracks)
						.flat();
					const availableTracks = checkedTracks?.filter(
						track => !track?.error && !tracksInUse.some(usedTrack => usedTrack?.trackId === track.id),
					);
					const tracksWithSelected = availableTracks?.map(track => {
						const match = selectedSplit?.splitTracks?.find(el => el.trackId === track.id);

						const selected = Boolean(match);
						return { ...track, selected };
					});
					setLocalSplitTracks(tracksWithSelected);
					setLocalOldSplitTracks(tracksWithSelected);
					if (selectedSplit?.contractId) {
						if (selectedSplit.completed) {
							setActiveContractWriters(selectedSplit.splitUsers);
						} else if (!selectedSplit.completed && selectedSplit?.referenceContractId) {
							const allDeals = getDealList();
							const originalContract = allDeals.find(el => {
								return el.completed && el.contractId === selectedSplit.referenceContractId;
							});
							if (originalContract) {
								setActiveContractWriters(originalContract?.splitUsers);
							}
						}
					}
				}
				if (newSplit) {
					const tracksInUse = splitsAndContracts
						.filter(el => !el.isCancelled && el.status !== 2)
						.map(el => el.splitTracks)
						.flat();
					const availableTracks = checkedTracks?.filter(
						track => !track?.error && !tracksInUse.some(usedTrack => usedTrack.trackId === track.id),
					);
					if (availableTracks.length > 0) {
						setLocalSplitTracks(availableTracks);
					} else {
						getToast('error', 'Error', 'There are no available tracks in this release');
						dispatch(setSplitTypeModalStatus(false));
						dispatch(setReleaseScreen('main'));
						dispatch(setNewSplit(false));
					}
				}
				setAvailableTracksLoaded(true);
			};
			getAvalaibleTracks();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSplit?.splitId, splitsAndContracts?.length, checkedTracks?.length]);

	useEffect(() => {
		if (!isReleasePage && selectedRelease?.id) {
			const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
			dispatch(
				getDealsByReleaseId({ releaseId: selectedRelease?.id, userId: user.id, creatorOrAdmin }),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReleasePage, selectedRelease?.id]);

	useEffect(() => {
		const splitUsers = selectedRelease.selectedSplit?.splitUsers;
		if (splitUsers && isSelectedSplitChecked && !isInitialOwnershipLoaded) {
			const updatedUsersOwnershipInfo = splitUsers.filter(userInDatabase => {
				return usersToSplit.some(localSplitUser => {
					return userInDatabase.email === localSplitUser.email;
				});
			});
			if (updatedUsersOwnershipInfo?.length > 0) {
				const obj = {};
				updatedUsersOwnershipInfo.forEach(el => {
					const { email, ownership } = el;
					obj[email] = +ownership;
				});
				setOwnership(prev => ({ ...prev, ...obj }));
				setOwnershipOldData(obj);
				setIsInitialOwnershipLoaded(true);
			}
		}
		if (usersToSplit.length === 1) {
			const obj = {};
			usersToSplit.forEach(el => {
				const { email } = el;
				obj[email] = 100;
			});
			setOwnership(obj);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRelease.selectedSplit?.splitUsers, isSelectedSplitChecked, isInitialOwnershipLoaded]);

	const versionWithNewWriters =
		selectedSplit?.referenceContractId && activeContractWriters.length !== usersToSplit?.length;
	return (
		<>
			{localSplitTracks?.length < 1 ? (
				<ContainerLoader />
			) : (
				<Flex p='24px' bg='bg.main' borderRadius='10px' h='100%' flexDir='column' w='100%'>
					<Flex justify='space-between' mb='16px'>
						<BackButton title='Back' onClickHandler={onBack} w='150px' />

						<CustomButton styles='light' onClickHandler={handleCancel}>
							Cancel
						</CustomButton>
					</Flex>

					<Flex mb='32px' gap='4px'>
						<ProgressLine n={0} currentStep={currentStep} />
						<ProgressLine n={1} currentStep={currentStep} />
						<ProgressLine n={2} currentStep={currentStep} />
						{/* <ProgressLine n={3} currentStep={currentStep} /> */}
					</Flex>

					<Flex flex='1'>
						{currentStep === 1 && (
							<StepLayout
								title='1. Select tracks'
								text='Select the track(s) you would like to create a songwriting agreements for'
							>
								<AddTracksToSplit
									setCurrentStep={setCurrentStep}
									setArtists={setArtists}
									localSplitTracks={localSplitTracks}
									setLocalSplitTracks={setLocalSplitTracks}
									oldLocalSplitTracks={oldLocalSplitTracks}
									setLocalOldSplitTracks={setLocalOldSplitTracks}
									usersToSplit={usersToSplit}
									setAvailableTracksLoaded={setAvailableTracksLoaded}
								/>
							</StepLayout>
						)}
						{currentStep === 2 && (
							<StepLayout
								title='2. Add writers from your B.A.P.'
								text='Choose to add the existing members of your B.A.P.'
							>
								<AddWriters
									activeContractWriters={activeContractWriters}
									ownership={ownership}
									setOwnership={setOwnership}
									localSplitTracks={localSplitTracks}
									setCurrentStep={setCurrentStep}
									usersToSplit={usersToSplit}
									setUsersToSplit={setUsersToSplit}
									initialInvitedUsersToBap={initialInvitedUsersToBap}
									invitedUsersToBap={invitedUsersToBap}
									setInvitedUsersToBap={setInvitedUsersToBap}
									setNewUserToInviteToBap={setNewUserToInviteToBap}
									initialMembers={initialMembers}
									members={members}
									setMembers={setMembers}
									artists={artists}
									setArtists={setArtists}
									isSelectedSplitChecked={isSelectedSplitChecked}
									setIsSelectedSplitChecked={setIsSelectedSplitChecked}
								/>
							</StepLayout>
						)}
						{currentStep === 3 && (
							<StepLayout
								title='3. Specify Ownership'
								text={`Specify the ownership for each user, keep in mind that the total ownership must be 100%. 
								 ${
										versionWithNewWriters
											? 'Writers who have been added to the new version of the contract must have ownership more than 0.'
											: ''
									} ${
									selectedSplit?.referenceContractId
										? 'Also you can give ownership equal to 0% to the writers from an active contract.'
										: ''
								}`}
							>
								<AddOwnership
									activeContractWriters={activeContractWriters}
									localSplitTracks={localSplitTracks}
									setLocalSplitTracks={setLocalSplitTracks}
									ownership={ownership}
									setOwnership={setOwnership}
									usersToSplit={usersToSplit}
									setCurrentStep={setCurrentStep}
									ownershipOldData={ownershipOldData}
									setOwnershipOldData={setOwnershipOldData}
									withContract={withContract}
									newUserToInviteToBap={newUserToInviteToBap}
									setNewUserToInviteToBap={setNewUserToInviteToBap}
									setIsModal={setIsModal}
									oldLocalSplitTracks={oldLocalSplitTracks}
									setLocalOldSplitTracks={setLocalOldSplitTracks}
								/>
							</StepLayout>
						)}
						{/* {currentStep === 4 && (
							<StepLayout title='4. Specify Credit' text='Specify credit for each user'>
								<AddCredit
									localSplitTracks={localSplitTracks}
									setLocalSplitTracks={setLocalSplitTracks}
									ownership={ownership}
									setOwnership={setOwnership}
									usersToSplit={usersToSplit}
									setCurrentStep={setCurrentStep}
									setIsModal={setIsModal}
								/>
							</StepLayout>
						)} */}
					</Flex>
					{isModal && (
						<ContractModal
							setIsModal={setIsModal}
							localSplitTracks={localSplitTracks}
							withContract={withContract}
							setWithContract={setWithContract}
							setIsStartPage={setIsStartPage}
						/>
					)}
				</Flex>
			)}
		</>
	);
};

export default CreateContractOrSplit;
