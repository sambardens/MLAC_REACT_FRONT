import { Box, Checkbox, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSplit } from 'store/operations';
import { resetSelectedSplit, setReleaseSelectedMenu, setSplitTypeModalStatus } from 'store/slice';

import NextButton from '@/components/Buttons/NextButton/NextButton';
import PlusButton from '@/components/Buttons/PlusButton/PlusButton';
import ContractModal from '@/components/Contracts/ContractModal/ContractModal';
import ContainerLoader from '@/components/Loaders/ContainerLoader';

import ChooseSplitTypeModal from '../../ReleaseModals/ChooseSplitTypeModal';
import ReleaseSplitAndContractCard from '../../ReleaseSplitAndContractCard/ReleaseSplitAndContractCard';
import MenuTitle from '../MenuTitle/MenuTitle';

import SelectionBox from './SelectionBox';

const AddSplitsMenu = ({ withContract, setWithContract, isDealsMenuValid }) => {
	const { selectedRelease, selectedBap, splitTypeModalStatus, isLoading, user, isError } =
		useSelector(state => state.user);
	const { checkedTracks, splitsAndContracts, id, name } = selectedRelease;
	const toast = useToast();
	const [selectionScreen, setSelectionScreen] = useState(splitsAndContracts?.length === 0);
	const [isCopyrightHolder, setIsCopyrightHolder] = useState(splitsAndContracts?.length === 0);
	const dispatch = useDispatch();
	const [isContractModal, setIsContractModal] = useState(false);
	const [showExpiredDeals, setShowExpiredDeals] = useState(false);
	const [showDeclinedDeals, setShowDeclinedDeals] = useState(false);

	const getDeals = useCallback(() => {
		const declinedDeals = [];
		const expiredDeals = [];
		const notExpiredDeals = [];

		splitsAndContracts.forEach(deal => {
			if (deal.status === 3) {
				declinedDeals.push(deal);
			} else if (deal.status === 2 && deal.contractId) {
				expiredDeals.push(deal);
			} else if (deal.status === 0 || deal.status === 1) {
				notExpiredDeals.push(deal);
			}
		});

		return { declinedDeals, expiredDeals, notExpiredDeals };
	}, [splitsAndContracts]);

	const { declinedDeals, expiredDeals, notExpiredDeals } = getDeals();
	const currentDeals = showDeclinedDeals
		? declinedDeals
		: showExpiredDeals
		? expiredDeals
		: notExpiredDeals;

	const dealsLength = splitsAndContracts?.length;

	useEffect(() => {
		if (id) {
			dispatch(resetSelectedSplit());
		}
	}, [dispatch, id]);

	const addDealHandler = () => {
		// if (selectedRelease?.landingPages?.length > 0 || selectedBap?.shops?.length > 0) {
		// 	toast({
		// 		position: 'top',
		// 		title: 'Attention',
		// 		description:
		// 			'You  already have the web pages. If want to create splits or contract, you need to delete all web pages.',
		// 		status: 'info',
		// 		duration: 5000,
		// 		isClosable: true,
		// 	});
		// 	return;
		// }
		dispatch(setSplitTypeModalStatus(true));
	};

	const handleCheckExpiredDeals = () => {
		setShowExpiredDeals(!showExpiredDeals);
		setShowDeclinedDeals(false);
	};

	const handleCheckCancelledDeals = () => {
		setShowExpiredDeals(false);
		setShowDeclinedDeals(!showDeclinedDeals);
	};

	const handleNext = async () => {
		if (selectionScreen) {
			if (isCopyrightHolder) {
				const trackIds = checkedTracks?.filter(el => !el?.error).map(el => el.id);
				const data = {
					releaseId: id,
					trackIds,
					ownership: { [user.email]: 100 },
					releaseName: name,
					bapName: selectedBap?.bapName,
					bapId: selectedBap?.bapId,
					userId: user.id,
					creatorOrAdmin: selectedBap?.isCreator || selectedBap?.isFullAdmin,
				};

				const result = await dispatch(createSplit(data));
				if (result?.payload?.success) {
					dispatch(setReleaseSelectedMenu(4));
				} else {
					console.log('Error', 'Split has  not been created');
					toast({
						position: 'top',
						title: 'Error. Try again',
						description: isError,
						status: 'error',
						duration: 5000,
						isClosable: true,
					});
				}
				// setAllMenusAvailaible(true);
			} else {
				setSelectionScreen(false);
			}
		} else {
			dispatch(setReleaseSelectedMenu(4));
		}
	};

	const tracksInUse = notExpiredDeals.map(el => el.splitTracks).flat();
	const availableTracks = checkedTracks?.filter(
		track =>
			!track?.error &&
			!tracksInUse.some(usedTrack => (usedTrack.trackId || usedTrack.id) === track.id),
	);

	const getSellStatus = useCallback(() => {
		if (selectedRelease.evearaReleaseId) {
			return true;
		}
		const isLanding = selectedRelease?.landingPages?.find(el => el.webpagesTypeId === 2);
		if (isLanding) {
			return true;
		}

		if (selectedBap?.shops?.length > 0) {
			const isReleaseInShop = selectedBap?.shops[0].releaseIds.find(
				el => Number(el) === selectedRelease.id,
			);
			if (isReleaseInShop) {
				return true;
			}
		}

		return false;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRelease?.landingPages, selectedBap?.shops]);
	const isSellRelease = getSellStatus();

	return (
		<>
			{0 ? (
				<ContainerLoader pb='50px' />
			) : (
				<>
					{selectionScreen ? (
						<SelectionBox
							handleNext={handleNext}
							isCopyrightHolder={isCopyrightHolder}
							setIsCopyrightHolder={setIsCopyrightHolder}
						/>
					) : (
						<>
							<Flex flexDir='column' justify='space-between' h='100%'>
								<Box>
									<Flex justify='space-between' mb='16px'>
										<MenuTitle
											title='Add splits'
											text="You can create a contract to share profits. If you are the only copywriter holder and don't need to add songwriting splits, skip this step"
											mb='0'
											mr='24px'
										/>
										<PlusButton
											title='Create'
											w='150px'
											styles='light-red'
											iconColor='accent'
											onClickHandler={addDealHandler}
										/>
									</Flex>

									<Flex px='12px' mb='16px' gap='24px' justify='space-between' align='flex-end'>
										{availableTracks.length > 0 ? (
											<Box>
												<Heading as='h4' lineHeight={1} fontSize='16px' fontWeight='400' color='black'>
													Available tracks to create splits or contract:
												</Heading>
												{/* <Flex as='ul' gap='4px' flexDir='column' py='8px'>
													{availableTracks.map(el => (
														<Box key={el.id} as='li'>
															<Text fontSize='14px' fontWeight='400' color='secondary'>
																{el.name}
															</Text>
														</Box>
													))}
												</Flex> */}
												<Text fontSize='14px' fontWeight='400' color='secondary' mt='8px'>
													{availableTracks.map(el => el.name).join(', ')}
												</Text>
											</Box>
										) : (
											<Heading as='h4' fontSize='16px' fontWeight='400' color='black'>
												There are no available tracks to create splits or contract
											</Heading>
										)}
										{(expiredDeals?.length > 0 || declinedDeals?.length > 0) && (
											<Flex gap='24px' align='center'>
												{expiredDeals?.length > 0 && (
													<Checkbox
														id='dealType'
														name='dealType'
														isChecked={showExpiredDeals}
														onChange={handleCheckExpiredDeals}
														colorScheme='checkbox'
														borderColor='secondary'
														size='md'
														minW='135px'
													>
														<Text fontSize='16px' fontWeight='400' color='secondary' ml='4px'>
															Show expired
														</Text>
													</Checkbox>
												)}
												{declinedDeals?.length > 0 && (
													<Checkbox
														id='dealType'
														name='dealType'
														isChecked={showDeclinedDeals}
														onChange={handleCheckCancelledDeals}
														colorScheme='checkbox'
														borderColor='secondary'
														size='md'
														minW='145px'
													>
														<Text fontSize='16px' fontWeight='400' color='secondary' ml='4px'>
															Show declined
														</Text>
													</Checkbox>
												)}
											</Flex>
										)}
									</Flex>

									{dealsLength > 0 && (
										<Flex as='ul' flexDir='column' gap='12px'>
											{currentDeals.map((el, i) => {
												const isRemovable = el.type === 'split' && !isSellRelease;
												return (
													<ReleaseSplitAndContractCard
														key={`${el.createdAt}${i}`}
														deal={el}
														setWithContract={setWithContract}
														setIsContractModal={setIsContractModal}
														isRemovable={isRemovable}
													/>
												);
											})}
										</Flex>
									)}

									{/* <Text py='40px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
										There are no splits and contracts in this release
									</Text> */}
								</Box>
								<NextButton onClickHandler={handleNext} styles={isDealsMenuValid ? 'main' : 'disabled'} />

								{splitTypeModalStatus && (
									<ChooseSplitTypeModal setWithContract={setWithContract} withContract={withContract} />
								)}
							</Flex>
							{isContractModal && (
								<ContractModal setIsContractModal={setIsContractModal} setWithContract={setWithContract} />
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

export default AddSplitsMenu;
