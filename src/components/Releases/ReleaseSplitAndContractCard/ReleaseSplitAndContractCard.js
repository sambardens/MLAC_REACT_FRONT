import { Box, Flex, Heading, IconButton, Text, useToast } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sendRemindToParticipants from 'src/functions/serverRequests/contracts/sendRemindToParticipants';
import { dropMenuSelectors } from 'store/dropMenu';
import { setDropMenu } from 'store/dropMenu/dropMenu-slice';
import { convertSplitToContract, deleteDeal, deleteOnlyContract } from 'store/operations';
import { setNewSplit, setReleaseScreen, setSelectedSplit } from 'store/slice';

import RingLoader from '@/components/Loaders/RingLoader';
import ConfirmToDeleteDealModal from '@/components/Modals/ConfirmToDeleteDealModal';
import TransformContractModal from '@/components/Modals/TransformContractModal';

import EditIcon from '@/assets/icons/base/edit.svg';
import MoreIcon from '@/assets/icons/base/more.svg';
import SendIcon from '@/assets/icons/base/send.svg';
import ContractIcon from '@/assets/icons/dropdown-menu/contract.svg';
import TrashIcon from '@/assets/icons/modal/trash.svg';

import ActionBtn from '../../DealCardComponents/ActionBtn';
import Field from '../../DealCardComponents/Field';
import StatusField from '../../DealCardComponents/StatusField';

const ReleaseSplitAndContractCard = ({ deal, setWithContract, setIsContractModal, isRemovable }) => {
	const [isModalToConfirmDeleteDeal, setIsModalToConfirmDeleteDeal] = useState(false);
	const [isTransformContractModal, setIsTransformContractModal] = useState(false);
	const { selectedRelease, user, selectedBap } = useSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const dropMenu = useSelector(dropMenuSelectors.getDropMenu);
	const toast = useToast();
	const dispatch = useDispatch();
	const popupRef = useRef(null);

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
	const handleShowDropMenu = (e, item) => {
		e.stopPropagation();
		dispatch(setDropMenu({ itemId: item?.contractId ? item?.contractId : item?.splitId }));
	};

	const handleEdit = async () => {
		dispatch(setSelectedSplit(deal));
		setWithContract(false);
		dispatch(setReleaseScreen('create-contract'));
	};

	const handleOpenContract = async () => {
		dispatch(setSelectedSplit(deal));
		dispatch(setNewSplit(false));
		setIsContractModal(true);
		dispatch(setDropMenu(false));
	};

	const onClickEdit = e => {
		e.stopPropagation();
		dispatch(setNewSplit(false));
		if (deal?.contractId && deal.splitUsers.length !== deal.notSignedUsers.length) {
			setIsTransformContractModal(true);
		} else {
			handleEdit();
		}
		dispatch(setDropMenu(false));
	};

	const handleSendRemind = async e => {
		e.stopPropagation();
		setIsLoading(true);
		const res = await sendRemindToParticipants(deal.contractId);
		if (res?.success) {
			getToast('Success', 'Contract participants were successfully sent a reminder to sign the contract!');
		} else {
			getToast('Error', 'Something went wrong. The message about the reminder to sign the contract was not sent!!');
		}
		dispatch(setDropMenu(false));
		setIsLoading(false);
	};

	const handleConvertToContract = async e => {
		e.stopPropagation();
		const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
		setIsLoading(true);
		const result = await dispatch(
			convertSplitToContract({
				deal,
				isReleasePage: true,
				userId: user.id,
				allDeals: selectedRelease.splitsAndContracts,
				creatorOrAdmin,
			}),
		);
		if (result?.payload?.success) {
			getToast('Success', 'Contract has been created');
			setIsContractModal(true);
			dispatch(setNewSplit(false));
		} else {
			getToast('Error', 'Contract has not been created. Try again later');
		}
		setIsLoading(false);
		dispatch(setDropMenu(false));
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
			res = await dispatch(deleteDeal({ splitId: deal.splitId, referenceContractId: deal?.referenceContractId || null }));
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

	return (
		<>
			<Flex as='li' bg='bg.light' borderRadius='10px' cursor='pointer' pos='relative' onClick={handleOpenContract} overflow='hidden' pointerEvents={isLoading ? 'none' : 'initial'}>
				<Flex pos='absolute' align='center' justify='center' bg={getColor()} textorientation='upright' w='32px' h='100%'>
					<Text align='center' fontWeight='500' fontSize='16px' color='white' transform='rotate(-90deg)'>
						{deal?.contractId ? 'Contract' : 'Split'}
					</Text>
				</Flex>
				<Box p='16px 4px 16px 48px ' w='100%'>
					<Flex justify='space-between' pos='relative' w='100%' mb='24px' h='24px'>
						<Heading fontWeight='600' fontSize='18px' color='black'>
							{selectedRelease.name}
						</Heading>
						{deal?.showMore && !isLoading && (
							<>
								<IconButton
									icon={<MoreIcon />}
									boxSize='24px'
									onClick={e => (dropMenu && dropMenu?.itemId === (deal?.contractId ? deal?.contractId : deal?.splitId) ? handleCloseDropMenu(e) : handleShowDropMenu(e, deal))}
									color={dropMenu && dropMenu?.itemId === (deal?.contractId ? deal?.contractId : deal?.splitId) ? 'accent' : 'secondary'}
									_hover={{ color: 'accent' }}
									transition='0.3s linear'
									w='24px'
								/>

								{dropMenu && dropMenu?.itemId === (deal?.contractId ? deal?.contractId : deal?.splitId) && (
									<Box px='12px' pos='absolute' right='8px' top='24px' borderRadius='6px' boxShadow='0px 4px 7px 5px rgba(136, 136, 136, 0.1)' bgColor='bg.main' ref={popupRef}>
										{deal?.isEditableDeal && <ActionBtn icon={EditIcon} text='Edit' onClick={onClickEdit} />}
										{deal?.recreateMode && <ActionBtn icon={EditIcon} text='Recreate' onClick={onClickEdit} />}
										{deal?.showSendParticipants && <ActionBtn icon={SendIcon} text='Send to participants' onClick={handleSendRemind} />}
										{deal?.type === 'split' && <ActionBtn icon={ContractIcon} text='Convert to contract' onClick={handleConvertToContract} />}
										{(deal?.isCanDelete || isRemovable) && <ActionBtn icon={TrashIcon} text='Delete' onClick={onClickDelete} />}
									</Box>
								)}
							</>
						)}
						{isLoading && (
							<Box px='8px'>
								<RingLoader w='24px' h='24px' />
							</Box>
						)}
					</Flex>
					<Flex flexDir='column' gap='8px'>
						{deal?.contractId ? <StatusField contract={deal} /> : <Field title='Status' text={deal.status === 1 ? 'Splits' : 'Expired'} textColor={deal.status === 1 ? '#4F759A' : 'secondary'} />}
						<Field title='Date' text={deal.formattedDate} />
						<Field title='Artist' text={selectedBap.bapName} />
						<Field title='Tracks' text={deal.tracksName} isTruncated={true} />
						<Field title='Writers' text={deal.writers} isTruncated={true} />
					</Flex>
				</Box>
			</Flex>
			{isTransformContractModal && <TransformContractModal onClickHandler={handleEdit} setIsModal={setIsTransformContractModal} editMode={!deal.isContractSigned} />}
			{isModalToConfirmDeleteDeal && <ConfirmToDeleteDealModal onClickHandler={handleDeleteDeal} setIsModal={setIsModalToConfirmDeleteDeal} type={type} />}
		</>
	);
};

export default ReleaseSplitAndContractCard;
