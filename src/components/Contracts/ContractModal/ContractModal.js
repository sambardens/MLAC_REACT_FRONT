import { useRouter } from 'next/router';

import { Box, Flex, Heading, Image, Text, useToast } from '@chakra-ui/react';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getSignatureImage from 'src/functions/serverRequests/contracts/getSignatureImage';
import sendRemindToParticipants from 'src/functions/serverRequests/contracts/sendRemindToParticipants';
import getFormattedDate from 'src/functions/utils/getFormattedDate';
import { resetSelectedBap, setReleaseScreen, setSelectedSplit } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';
import TransformContractModal from '@/components/Modals/TransformContractModal';

import CurrentIcon from '@/assets/icons/base/arrow-right-circle.svg';
import EditIcon from '@/assets/icons/base/edit.svg';
import PreviousIcon from '@/assets/icons/base/previous.svg';
import SendIcon from '@/assets/icons/base/send.svg';
import UploadIcon from '@/assets/icons/base/upload-small.svg';

import ContractPdf from '../ContractPdf/ContractPdf';

import ActionButton from './ActionButton/ActionButton';
import SplitCardInModal from './SplitCardInModal/SplitCardInModal';
import TrackCardInModal from './TrackCardInModal/TrackCardInModal';

const Field = ({ title, text, mb }) => (
	<Flex align='center' mb={mb}>
		<Text fontWeight='400' fontSize='18px' color='black' w='100px'>
			{title}
		</Text>
		<Text fontWeight='400' fontSize='16px' color='secondary'>
			{text}
		</Text>
	</Flex>
);

const ContractModal = ({ setIsModal, setIsContractModal, setWithContract, setIsStartPage }) => {
	const { selectedBap, selectedRelease, allSplitsAndContracts, releaseScreen, user } = useSelector(
		state => state.user,
	);
	const axiosPrivate = useAxiosPrivate();
	const { selectedSplit, checkedTracks } = selectedRelease;
	const [tracks, setTracks] = useState([]);
	const [writers, setWriters] = useState([]);
	const [currentVersionContractId, setCurrentVersionContracId] = useState(null);
	const [isTransformContractModal, setIsTransformContractModal] = useState(false);
	const toast = useToast();
	const { pathname } = useRouter();
	const dispatch = useDispatch();
	const isReleasePage = pathname.includes('/releases');
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const isMyContractsAndSplitsPage = pathname.includes('/my-splits-contracts');

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 5000,
			isClosable: true,
		});
	};

	const handleSubmit = async () => {
		if (setIsContractModal) {
			setIsContractModal(false);
		}
		if (setIsStartPage) {
			setIsStartPage(true);
		} else {
			dispatch(setReleaseScreen('main'));
		}
		if (isMyContractsAndSplitsPage) {
			dispatch(resetSelectedBap());
		}
	};

	const date = getFormattedDate(selectedSplit?.createdAt);

	// useEffect(() => {
	// 	if (selectedSplit?.splitId && checkedTracks) {
	// 		setWriters(selectedSplit?.splitUsers);
	// 		const tracksToRender = [];
	// 		checkedTracks?.forEach(checkedTrack => {
	// 			const trackToRender = selectedSplit?.splitTracks?.find(
	// 				splitTrack => splitTrack.trackId === checkedTrack.id,
	// 			);
	// 			if (trackToRender) {
	// 				tracksToRender.push(checkedTrack);
	// 			}
	// 		});
	// 		setTracks(selectedSplit?.splitTracks);
	// 	}
	// }, [selectedSplit?.splitId, checkedTracks]);

	// const filteredTracks = splitTracks?.filter(el => el.selected);
	// const [writers, setWriters] = useState([selectedSplit?.splitUsers]);
	// const checkedTracksWithSelected = checkedTracks?.map(checkedTrack => {
	// 	const matchingTrackSplit = selectedSplit?.splitTracks?.find(
	// 		trackSplit => trackSplit.trackId === checkedTrack.id,
	// 	);
	// 	return matchingTrackSplit
	// 		? { ...checkedTrack, selected: true, splitUsers: selectedSplit?.splitUsers }
	// 		: {
	// 				...checkedTrack,
	// 				selected: false,
	// 				splitUsers: selectedSplit?.splitUsers,
	// 		  };
	// });
	// console.log('checkedTracksWithSelected: ', checkedTracksWithSelected);
	// useEffect(() => {
	// 	if (selectedSplit?.splitId && selectedSplit?.splitUsers && checkedTracksWithSelected) {
	// 		const getCredit = async () => {
	// 			const data = {
	// 				splitId: selectedSplit.splitId,
	// 				splitUsers: selectedSplit.splitUsers,
	// 				splitTracks: checkedTracksWithSelected,
	// 			};
	// 			const res = await getCreditsInfo(data, axiosPrivate);
	// 			if (res) {
	// 				setWriters(res.splitUsers);
	// 				setTracks(res.splitTracks.filter(el => el.selected));
	// 			}
	// 		};
	// 		getCredit();

	// 		const timeoutId = setTimeout(setIsLoading, 200, false);
	// 		return () => {
	// 			clearTimeout(timeoutId);
	// 		};
	// 	}
	// }, [selectedSplit?.splitId]);

	const handleBackToEditor = () => {
		if (!selectedSplit?.contractId) {
			setWithContract(false);
		}
		if (setIsContractModal) {
			setIsContractModal(false);
			if (setIsStartPage) {
				setIsStartPage(false);
			} else {
				dispatch(setReleaseScreen('create-contract'));
			}
		} else {
			setIsModal(false);
		}
	};

	const handleClose = () => {
		if (isMyContractsAndSplitsPage) {
			dispatch(resetSelectedBap());
		}
		if (setIsContractModal) {
			setIsContractModal(false);
		} else {
			setIsModal(false);
		}

		setIsStartPage && setIsStartPage(true);
	};

	const handleSendRemind = async () => {
		const res = await sendRemindToParticipants(selectedSplit?.contractId);
		if (res?.success) {
			getToast('Success', 'All participants in this contract were sent a reminder to sign.');
		} else {
			getToast('Error', 'Something went wrong. The reminder to sign this contract was not sent.');
		}
	};

	const handleEditOrRecreate = () => {
		if (
			selectedSplit.contractId &&
			selectedSplit.splitUsers.length !== selectedSplit.notSignedUsers.length &&
			releaseScreen !== 'create-contract'
		) {
			setIsTransformContractModal(true);
		} else {
			handleBackToEditor();
		}
	};

	const getDealList = () => {
		let allDeals;
		if (isReleasePage) {
			allDeals = selectedRelease.splitsAndContracts.filter(el => !el.isCancelled);
		} else if (isContractsAndSplitsPage) {
			allDeals = selectedBap.splitsAndContracts.filter(el => !el.isCancelled);
		} else if (isMyContractsAndSplitsPage) {
			allDeals = allSplitsAndContracts.filter(el => !el.isCancelled);
		}
		return allDeals;
	};

	const handleOpenCurrentVersion = () => {
		const allDeals = getDealList();
		const deal = allDeals?.find(el => el.contractId === currentVersionContractId);
		if (deal) {
			dispatch(setSelectedSplit(deal));
		} else {
			getToast('Error', "Can't find the previous version of this contract.");
		}
		console.log('handleOpenCurrentVersion deal: ', deal);
	};

	const handleOpenPreviousContract = () => {
		const allDeals = getDealList();
		const deal = allDeals?.find(el => el.contractId === selectedSplit.referenceContractId);
		if (deal) {
			dispatch(setSelectedSplit(deal));
		} else {
			getToast('Error', 'The previous version of this contract is not available to you.');
		}
	};

	useEffect(() => {
		const getContractData = async () => {
			let splitUsers = selectedSplit?.splitUsers;
			if (selectedSplit?.contractId) {
				splitUsers = await Promise.all(
					selectedSplit?.splitUsers.map(async el => {
						if (el.signature && !el?.signatureSrc) {
							const signatureSrc = await getSignatureImage({ signatureUrl: el.signature }, axiosPrivate);
							return { ...el, signatureSrc };
						}
						return el;
					}),
				);
			}
			setWriters(splitUsers);
			const normalyzedTracks = [];
			checkedTracks?.forEach(checkedTrack => {
				const trackOnRender = selectedSplit?.splitTracks?.find(
					splitTrack => splitTrack.trackId === checkedTrack.id,
				);
				if (trackOnRender) {
					normalyzedTracks.push(checkedTrack);
				}
			});
			setTracks(normalyzedTracks);
			if (
				selectedSplit?.contractId
				// && selectedSplit?.referenceContractId
			) {
				const allDeals = getDealList();
				let lastVersionId;
				allDeals?.forEach(el => {
					if (el?.referenceContractId === selectedSplit?.contractId) {
						lastVersionId = el.contractId;
						return;
					}
				});

				setCurrentVersionContracId(lastVersionId || selectedSplit.contractId);
			}
		};
		if (selectedSplit?.splitId) {
			getContractData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSplit]);

	const isContractCreator =
		setIsContractModal && (selectedSplit?.isCreator || selectedBap?.creatorOrAdmin);
	const isNotCurrentContract =
		selectedSplit?.contractId &&
		!selectedSplit.isCancelled &&
		currentVersionContractId &&
		currentVersionContractId !== selectedSplit.contractId;
	const showRecreateBtn =
		isContractCreator &&
		selectedSplit?.status === 1 &&
		selectedSplit?.contractId &&
		currentVersionContractId &&
		currentVersionContractId === selectedSplit.contractId;

	return (
		<>
			<CustomModal
				maxW='1170px'
				closeModal={handleClose}
				maxH='80vh'
				minH='480px'
				w='80vw'
				checkHeight={true}
			>
				<Box pos='absolute' right='40px' top='40px'>
					<Flex gap='16px' mb='32px' justify='flex-end'>
						{selectedSplit?.isContractSigned && (
							<ActionButton icon={UploadIcon}>
								<Text fontWeight='500' fontSize='16px'>
									<PDFDownloadLink
										document={
											<ContractPdf
												bapName={selectedBap?.bapName}
												releaseName={selectedSplit?.releaseName}
												date={date}
												writers={writers}
												tracks={tracks}
												type={selectedSplit?.contractId ? 'Contract' : 'Split agreement'}
											/>
										}
										fileName='contract.pdf'
									>
										{/* {({ blob, url, loading, error }) =>
											error ? 'Error to convert pdf' : loading ? 'Converting to pdf...' : 'Download pdf'
										} */}
										{({ blob, url, loading, error }) => 'Download pdf'}
									</PDFDownloadLink>
								</Text>
							</ActionButton>
						)}

						{!selectedSplit.isCancelled && selectedSplit?.showSendParticipants && (
							<ActionButton icon={SendIcon} onClick={handleSendRemind} text='Send to participants' />
						)}
						{isContractCreator && selectedSplit?.isEditableDeal && (
							<ActionButton icon={EditIcon} onClick={handleEditOrRecreate} text='Edit' />
						)}

						{showRecreateBtn && (
							<ActionButton icon={EditIcon} onClick={handleEditOrRecreate} text='Recreate' />
						)}

						{!selectedSplit.isCancelled && selectedSplit?.referenceContractId && (
							<ActionButton
								icon={PreviousIcon}
								onClick={handleOpenPreviousContract}
								text='Previous version'
							/>
						)}
						{isNotCurrentContract && (
							<ActionButton icon={CurrentIcon} onClick={handleOpenCurrentVersion} text='Next version' />
						)}
					</Flex>
					<Image
						src='/assets/images/logo-primary.png'
						w='125px'
						h='70px'
						alt='Major Labl logo'
						ml='auto'
					/>
				</Box>

				<Box>
					<Box borderBottom='4px solid' borderColor='accent'>
						<Flex mb='24px' justify='space-between'>
							<Heading as='h3' fontSize='32px' fontWeight='600' color='black'>
								{selectedSplit?.contractId ? 'Contract' : 'Split agreement'}
							</Heading>
						</Flex>
						<Field title='Release' text={selectedSplit.releaseName} mb='16px' />
						<Field title='Date' text={date} mb='16px' />
						<Field title='Artist' text={selectedBap.bapName} mb='24px' />
					</Box>
					<Flex
						maxH={setIsContractModal ? 'calc(80vh - 307px)' : 'calc(80vh - 371px)'}
						overflowY='scroll'
						mt='24px'
					>
						<Box w='calc(55% - 12px)' borderRadius='10px' mr='24px'>
							<Heading as='h4' fontSize='18px' fontWeight='500' color='black' mb='8px'>
								Splits
							</Heading>
							{writers?.length > 0 && (
								<Flex as='ul' flexDir='column' gap='8px'>
									{writers.map(user => (
										<SplitCardInModal
											key={`${user.email}splitcard`}
											user={user}
											// setWriters={setWriters}
											contractId={selectedSplit.contractId}
										/>
									))}
								</Flex>
							)}
						</Box>
						<Box w='calc(45% - 12px)'>
							<Heading as='h4' fontSize='18px' fontWeight='500' color='black' mb='8px'>
								Tracks
							</Heading>
							{tracks?.length > 0 && (
								<Flex as='ul' flexDir='column' gap='8px'>
									{tracks.map(track => (
										<TrackCardInModal key={track?.id} track={track} />
									))}
								</Flex>
							)}
						</Box>
					</Flex>
					{!setIsContractModal && (
						<Flex justify='flex-end' mt='8px'>
							<CustomButton styles='main' onClickHandler={handleSubmit}>
								Submit
							</CustomButton>
							<CustomButton styles='light' onClickHandler={handleEditOrRecreate} ml='16px'>
								Back to edit
							</CustomButton>
						</Flex>
					)}
				</Box>
			</CustomModal>

			{isTransformContractModal && (
				<TransformContractModal
					onClickHandler={handleBackToEditor}
					setIsModal={setIsTransformContractModal}
					editMode={!selectedSplit?.isContractSigned}
				/>
			)}
		</>
	);
};

export default ContractModal;
