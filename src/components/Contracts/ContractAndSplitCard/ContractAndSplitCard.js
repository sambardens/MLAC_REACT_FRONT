import { useRouter } from 'next/router';

import { Box, Flex, Heading, IconButton, Text, useToast } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getContractWithSignatureImages from 'src/functions/serverRequests/contracts/getContractWithSignatureImages';
import sendRemindToParticipants from 'src/functions/serverRequests/contracts/sendRemindToParticipants';
import { dropMenuSelectors } from 'store/dropMenu';
import { setDropMenu } from 'store/dropMenu/dropMenu-slice';
import {
	convertSplitToContract,
	deleteDeal,
	deleteOnlyContract,
	getTracksToReleaseWithArtistLogo,
} from 'store/operations';
import { setNewSplit, setSelectedBap, setSelectedRelease, setSelectedSplit } from 'store/slice';

import ActionBtn from '@/components/DealCardComponents/ActionBtn';
import Field from '@/components/DealCardComponents/Field';
import StatusField from '@/components/DealCardComponents/StatusField';
import RingLoader from '@/components/Loaders/RingLoader';
import ConfirmToDeleteDealModal from '@/components/Modals/ConfirmToDeleteDealModal';
import TransformContractModal from '@/components/Modals/TransformContractModal';

import EditIcon from '@/assets/icons/base/edit.svg';
import MoreIcon from '@/assets/icons/base/more.svg';
import SendIcon from '@/assets/icons/base/send.svg';
import ContractIcon from '@/assets/icons/dropdown-menu/contract.svg';
import TrashIcon from '@/assets/icons/modal/trash.svg';

const ContractAndSplitCard = ({
	deal,
	setWithContract,
	setIsStartPage,
	setIsContractModal,
	releasesInUse = [],
}) => {
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const { selectedBap, user, allSplitsAndContracts } = useSelector(state => state.user);
	const [isTransformContractModal, setIsTransformContractModal] = useState(false);
	const [isModalToConfirmDeleteDeal, setIsModalToConfirmDeleteDeal] = useState(false);
	const dropMenu = useSelector(dropMenuSelectors.getDropMenu);
	const toast = useToast();
	const popupRef = useRef(null);
	const { pathname } = useRouter();
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const isMyContractsAndSplitsPage = pathname.includes('/my-splits-contracts');

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 6000,
			isClosable: true,
		});
	};

	const getDealList = () => {
		let allDeals;
		if (isContractsAndSplitsPage) {
			allDeals = selectedBap.splitsAndContracts;
		} else if (isMyContractsAndSplitsPage) {
			allDeals = allSplitsAndContracts;
		}
		return allDeals;
	};
	useEffect(() => {
		const handleClickOutside = event => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				dispatch(setDropMenu(false));
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [dispatch]);

	const handleCloseDropMenu = e => {
		e.stopPropagation();
		dispatch(setDropMenu(false));
	};
	const handleShowDropMenu = (e, deal) => {
		e.stopPropagation();
		dispatch(setDropMenu({ dealId: deal?.contractId ? deal?.contractId : deal?.splitId }));
	};

	const getInfo = async () => {
		if (isMyContractsAndSplitsPage) {
			const release = {
				id: deal.releaseId,
				name: deal.releasename,
				splitsAndContracts: null,
			};
			dispatch(
				setSelectedBap({
					bapId: deal.bapId,
					bapName: deal.bapName,
					isCreator: deal.isCreator,
					releases: [release],
					splitsAndContracts: [],
				}),
			);
			dispatch(setSelectedRelease(release));
		} else {
			const currentRelease = selectedBap?.releases?.find(el => el.id === deal.releaseId);
			dispatch(
				setSelectedRelease({
					...currentRelease,
					checkedTracks: null,
					landingPages: null,
					splitsAndContracts: null,
				}),
			);
		}

		if (deal.contractId) {
			const dealsWithSignatureImages = await getContractWithSignatureImages(deal, axiosPrivate);
			dispatch(setSelectedSplit(dealsWithSignatureImages));
		} else {
			dispatch(setSelectedSplit(deal));
		}
		const alltracks = await dispatch(getTracksToReleaseWithArtistLogo(deal.releaseId));
		return alltracks?.payload?.success;
	};

	const handleEditDeal = async () => {
		setIsLoading(true);
		await getInfo();
		if (!deal?.contractId) {
			setWithContract(false);
		}
		dispatch(setNewSplit(false));
		setIsStartPage(false);
		setIsLoading(false);
	};

	const onClickEdit = e => {
		e.stopPropagation();
		dispatch(setDropMenu(false));
		if (deal?.contractId && deal.splitUsers.length !== deal.notSignedUsers.length) {
			setIsTransformContractModal(true);
		} else {
			handleEditDeal();
		}
	};

	const handleOpenContract = async () => {
		setIsLoading(true);
		await getInfo();
		setIsContractModal(true);
		dispatch(setDropMenu(false));
		dispatch(setNewSplit(false));
		setIsLoading(false);
	};

	const handleSendRemind = async e => {
		e.stopPropagation();
		dispatch(setDropMenu(false));
		setIsLoading(true);
		const res = await sendRemindToParticipants(deal.contractId);
		if (res?.success) {
			getToast('Success', 'All participants in this contract were sent a reminder to sign.');
		} else {
			getToast('Error', 'Something went wrong. The reminder to sign this contract was not sent.');
		}
		setIsLoading(false);
	};

	const handleConvertToContract = async e => {
		e.stopPropagation();
		dispatch(setDropMenu(false));
		setIsLoading(true);
		const releaseInfo = await getInfo();
		if (releaseInfo) {
			const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
			const result = await dispatch(
				convertSplitToContract({
					isContractsAndSplitsPage: isMyContractsAndSplitsPage ? false : true,
					isMyContractsAndSplitsPage,
					deal,
					userId: user?.id,
					allDeals: getDealList(),
					creatorOrAdmin,
				}),
			);
			if (result?.payload?.success) {
				getToast('Success', 'A contract has been created.');
				setIsContractModal(true);
				dispatch(setNewSplit(false));
			} else {
				getToast('Error', 'Contract has not been created. Try again later');
			}
		}

		setIsLoading(false);
	};

	const onClickDelete = e => {
		e.stopPropagation();
		setIsModalToConfirmDeleteDeal(true);
		dispatch(setDropMenu(false));
	};

	const type = deal?.contractId ? 'contract' : 'split';

	const handleDeleteDeal = async () => {
		let res;
		setIsLoading(true);
		if (type === 'contract' && !deal.onlyContract) {
			res = await dispatch(
				deleteOnlyContract({
					splitId: deal.splitId,
					contractId: deal?.contractId,
				}),
			);
		} else {
			res = await dispatch(
				deleteDeal({ splitId: deal.splitId, referenceContractId: deal?.referenceContractId || null }),
			);
		}

		if (res?.payload?.success) {
			getToast('Success', `The ${type} has been successfully deleted!`);
		} else {
			getToast('Error', 'Something has gone wrong. Try again later');
		}
		setIsLoading(false);
		setIsModalToConfirmDeleteDeal(false);
	};
	const getColor = () => {
		if (deal?.type === 'split') {
			return deal.status === 1 ? '#4F759A' : 'secondary';
		}
		return deal.status === 0 ? 'accent' : deal?.status === 1 ? '#239f23' : 'secondary';
	};

	const isRemovable = deal?.type === 'split' && !releasesInUse.includes(deal.releaseId);
	return (
		<>
			<Flex
				as='li'
				pos='relative'
				bg='bg.light'
				borderRadius='10px'
				cursor='pointer'
				onClick={handleOpenContract}
				pointerEvents={isLoading ? 'none' : 'initial'}
			>
				{deal?.showMore && !isLoading && (
					<>
						<Box position={'absolute'} top='16px' right='4px'>
							<IconButton
								icon={<MoreIcon />}
								boxSize='24px'
								onClick={e =>
									dropMenu && dropMenu?.dealId === (deal?.contractId ? deal?.contractId : deal?.splitId)
										? handleCloseDropMenu(e)
										: handleShowDropMenu(e, deal)
								}
								color={
									dropMenu && dropMenu?.dealId === (deal?.contractId ? deal?.contractId : deal?.splitId)
										? 'accent'
										: 'secondary'
								}
								_hover={{ color: 'accent' }}
								transition='0.3s linear'
							/>
						</Box>

						{dropMenu && dropMenu?.dealId === (deal?.contractId ? deal?.contractId : deal?.splitId) && (
							<Box
								position={'absolute'}
								top='40px'
								right='12px'
								px='12px'
								boxShadow='0px 4px 7px 5px rgba(136, 136, 136, 0.1)'
								borderRadius='6px'
								bgColor='bg.main'
								ref={popupRef}
							>
								{deal?.isEditableDeal && <ActionBtn icon={EditIcon} text='Edit' onClick={onClickEdit} />}
								{deal?.recreateMode && <ActionBtn icon={EditIcon} text='Recreate' onClick={onClickEdit} />}
								{deal?.showSendParticipants && (
									<ActionBtn icon={SendIcon} text='Send to participants' onClick={handleSendRemind} />
								)}
								{deal?.type === 'split' && (
									<ActionBtn
										icon={ContractIcon}
										text='Convert to contract'
										onClick={handleConvertToContract}
									/>
								)}
								{(deal?.isCanDelete || isRemovable) && (
									<ActionBtn icon={TrashIcon} text='Delete' onClick={onClickDelete} />
								)}
							</Box>
						)}
					</>
				)}
				{isLoading && (
					<Box position={'absolute'} top='16px' right='12px'>
						<RingLoader w='24px' h='24px' />
					</Box>
				)}
				<Box position={'relative'} w='32px' bg={getColor()} borderRadius={'10px 0 0 10px'}>
					<Text
						position='absolute'
						top='50%'
						transform={'rotate(270deg) translateX(-50%) translateY(4px)'}
						transformOrigin='left top 0'
						fontWeight={'500'}
						fontSize={'16px'}
						color={'white'}
					>
						{deal?.type === 'contract' ? 'Contract' : 'Split'}
					</Text>
				</Box>

				<Flex flexDir={'column'} p='16px' w='calc(100% - 32px)'>
					<Heading as='h3' fontWeight='600' fontSize='18px' color='black' lineHeight='1.5' mb='24px'>
						{deal?.releaseName}
					</Heading>
					<Flex flexDir='column' gap='8px'>
						{deal?.contractId ? (
							<StatusField contract={deal} />
						) : (
							<Field
								title='Status'
								text={deal.status === 1 ? 'Splits' : 'Expired'}
								textColor={deal.status === 1 ? '#4F759A' : 'secondary'}
							/>
						)}
						<Field title='Date' text={deal?.formattedDate} />
						<Field title='Artist' text={deal?.bapName} />
						<Field title='Tracks' text={deal?.tracksName} isTruncated={true} />
						<Field title='Writers' text={deal?.writers} isTruncated={true} />
					</Flex>
				</Flex>
			</Flex>

			{isTransformContractModal && (
				<TransformContractModal
					editMode={!deal.isContractSigned}
					onClickHandler={handleEditDeal}
					setIsModal={setIsTransformContractModal}
				/>
			)}

			{isModalToConfirmDeleteDeal && (
				<ConfirmToDeleteDealModal
					onClickHandler={handleDeleteDeal}
					setIsModal={setIsModalToConfirmDeleteDeal}
					type={type}
				/>
			)}
		</>
	);
};

export default ContractAndSplitCard;
