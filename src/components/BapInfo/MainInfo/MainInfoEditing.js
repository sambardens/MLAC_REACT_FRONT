import {
	Box,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	IconButton,
	Image,
	Text,
	Tooltip,
	useToast,
} from '@chakra-ui/react';

import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import applyToDeletionBap from 'src/functions/serverRequests/bap/applyToDeletionBap';
import getSpotifyArtistInfoByArtistId from 'src/functions/serverRequests/spotify/getSpotifyArtistInfoByArtistId';
import checkIsMainInfoUpdated from 'src/functions/utils/bap/checkIsMainInfoUpdated';
import { changeBapSocialLinks } from 'store/links/links-operations';
import { editBapInfo, getBapMembers, saveBapGenres } from 'store/operations';
import { setSelectedBapUpdated } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import Canva from '@/components/Canva/Canva';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import CustomTextarea from '@/components/CustomInputs/CustomTextarea';
import Genres from '@/components/Genres/Genres';
import DeleteModal from '@/components/Modals/DeleteModal';
import { CreateNewBAPModal } from '@/components/Modals/NewBap/CreateNewBAPModal';
import { BandSearchInSpotify } from '@/components/Spotify/BandSearchInSpotify';
import { ConfirmConnectToSpotify } from '@/components/Spotify/ConfirmConnectToSpotify';
import UploadImage from '@/components/UploadMedia/UploadImage';

import countries from '@/assets/countries.json';
import TrashIcon from '@/assets/icons/modal/trash.svg';
import spotifyIcon from '@/assets/icons/social/spotify-small.svg';

const MainInfoEditing = ({ setShowEditInfoComponent }) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const containerRef = useRef(null);
	const initialGenres = {
		mainGenre: null,
		secondaryGenre: null,
		subGenres: [],
	};
	const { selectedBap, selectedBapUpdated, user } = useSelector(state => state.user);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [bapImageFile, setBapImageFile] = useState(null);
	const [bapImageSrc, setBapImageSrc] = useState(selectedBap.src || null);
	const [genresData, setGenresData] = useState(
		selectedBap.genres ? { ...selectedBap.genres } : initialGenres,
	);

	const [currentModal, setCurrentModal] = useState(0);
	const [newDesignId, setNewDesignId] = useState(selectedBap.designId || null);

	const [isLoading, setIsLoading] = useState(false);
	const [candidateEmail, setCandidateEmail] = useState('');
	const [isMultiUsers, setIsMultiUsers] = useState(false);
	const [isEmailError, setIsEmailError] = useState(false);
	const [membersOptions, setMembersOptions] = useState(false);
	const [isNewMainInfo, setIsNewMainInfo] = useState(false);
	const [isNewGenres, setIsNewGenres] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);
	const [isLoadingMembers, setIsLoadingMembers] = useState();

	const debouncedCheckIsMainInfoUpdated = useRef(
		debounce((oldData, newData) => {
			const res = checkIsMainInfoUpdated(oldData, newData);
			setIsNewMainInfo(res);
		}, 300),
	).current;
	useEffect(() => {
		return () => {
			debouncedCheckIsMainInfoUpdated.cancel();
		};
	}, [debouncedCheckIsMainInfoUpdated]);

	const isNameError = !(selectedBapUpdated?.bapName?.trim()?.length > 0);

	const isNewBapData = !isNameError && (isNewMainInfo || isNewGenres);

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

	const handleSaveButton = async () => {
		if (isNameError) {
			return;
		}

		setIsSubmiting(true);

		if (isNewMainInfo) {
			const bapData = {
				name: selectedBapUpdated.bapName?.trim(),
				description: selectedBapUpdated.bapDescription?.trim(),
				artistBio: selectedBapUpdated.bapArtistBio?.trim(),
				bapImageFile,
				bapImageSrc,
				bapId: selectedBapUpdated.bapId,
				designId: newDesignId || '',
				facebookPixel: selectedBapUpdated?.facebookPixel || '',
				spotifyId:
					selectedBapUpdated.spotifyId !== selectedBap.spotifyId ? selectedBapUpdated.spotifyId : null,
				spotifyUri: selectedBapUpdated?.spotifyUri,
				deezerId: selectedBapUpdated?.deezerId,
				napsterId: selectedBapUpdated?.napsterId,
				appleMusicId: selectedBapUpdated?.appleMusicId,
				country: selectedBapUpdated?.country,
				soundCloudId: selectedBapUpdated?.soundCloudId || '',
			};
			const editRes = await dispatch(editBapInfo(bapData));
			if (editRes?.payload?.error) {
				getToast('Error', `The B.A.P. has not been updated. ${editRes?.payload?.error}`);
				setIsSubmiting(false);
				return;
			}
		}
		if (selectedBapUpdated?.socialLinks) {
			dispatch(
				changeBapSocialLinks({ socialData: selectedBapUpdated?.socialLinks, bapId: selectedBap.bapId }),
			);
		}

		if (isNewGenres) {
			const genresRes = await dispatch(
				saveBapGenres({ bapId: selectedBapUpdated.bapId, genres: genresData }),
			);
			if (genresRes?.payload?.error) {
				getToast('Error', 'The genres have not been saved. Please try again later.');
				setIsSubmiting(false);
				return;
			}
		}
		setShowEditInfoComponent(false);
		getToast('Success', 'Your B.A.P. has been updated.');
		setIsSubmiting(false);
	};
	const handleChange = e => {
		const { name, value } = e.target;
		const updatedBap = { ...selectedBapUpdated, [name]: value };
		dispatch(setSelectedBapUpdated(updatedBap));
		debouncedCheckIsMainInfoUpdated(selectedBap, {
			...updatedBap,
			src: bapImageSrc,
			designId: newDesignId,
		});
	};

	const handleSelect = ({ value }) => {
		const updatedBap = { ...selectedBapUpdated, country: value };
		dispatch(setSelectedBapUpdated(updatedBap));
		debouncedCheckIsMainInfoUpdated(selectedBap, {
			...updatedBap,
			src: bapImageSrc,
			designId: newDesignId,
		});
	};

	const getCandidatesToTakeoverBap = bapMembers => {
		if (bapMembers.length > 1) {
			const isMulti = bapMembers?.length > 1;
			setIsMultiUsers(isMulti);
			const preparedMembers = bapMembers
				?.filter(member => member.userId !== user.id)
				.map(member => {
					return { value: member.email, label: member.email };
				});

			setMembersOptions(preparedMembers);
			setCandidateEmail(preparedMembers[0]?.value);
		}
	};

	useEffect(() => {
		const bapMembers = selectedBap?.bapMembers;
		if (bapMembers) {
			getCandidatesToTakeoverBap(bapMembers);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.bapMembers]);

	const onDeleteBap = async () => {
		setIsLoading(true);

		const regex = /^(?=.{1,30}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (isMultiUsers && !regex.test(candidateEmail)) {
			setIsEmailError(true);
			return;
		}
		setIsEmailError(false);

		let formData;
		if (isMultiUsers) {
			formData = new FormData();
			formData.append('emailFutureCreator', `${candidateEmail}`);
		}

		const resData = await applyToDeletionBap(selectedBap.bapId, formData);
		if (resData.success) {
			const description = isMultiUsers
				? 'BAP removal application successfully submitted. Check your email'
				: 'BAP removal application successfully submitted. A confirmation email will be sent to your email';
			getToast('Success', description);
			setCurrentModal(0);
			setShowEditInfoComponent(false);
		} else {
			getToast('Error', `Failed to delete this B.A.P.: ${resData?.message}`);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		dispatch(setSelectedBapUpdated({ ...selectedBapUpdated, isEdited: isNewBapData }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, isNewBapData]);

	const cancelHandler = () => {
		dispatch(setSelectedBapUpdated(selectedBap));
		setShowEditInfoComponent(false);
	};

	const closeBandSpotifyModal = () => {
		setCurrentModal(0);
	};

	const handleChooseImgFile = e => {
		setBapImageFile(e);
		setNewDesignId(null);
	};

	useEffect(() => {
		const res = checkIsMainInfoUpdated(selectedBap, {
			...selectedBapUpdated,
			src: bapImageSrc,
			designId: newDesignId,
		});
		setIsNewMainInfo(res);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bapImageSrc, newDesignId]);

	const handleDeleteLogo = () => {
		setBapImageSrc('/assets/images/logo-primary.png');
		setBapImageFile(null);
		setNewDesignId(null);
	};

	const handleResyncToSpotify = async () => {
		setIsSyncing(true);
		const spotifyRes = await getSpotifyArtistInfoByArtistId(selectedBap.spotifyId);
		if (spotifyRes?.success) {
			// const auddData = await getBapInfoFromPlatforms(selectedBap.spotifyId, mainGenres,axiosPrivate);

			// if (auddData?.genres?.mainGenre?.id) {
			// 	const res = compareGenres(genresData, auddData?.genres);
			// 	setIsNewGenres(res);
			// 	setGenresData(auddData?.genres);
			// }
			getToast('Success', 'The resync has been successfull. If there are changes, click "Save".');
			const artist = spotifyRes?.artist;
			const updatedBap = {
				...selectedBapUpdated,
				bapName: artist?.name,
				src: artist?.images[0]?.url,
			};
			dispatch(setSelectedBapUpdated(updatedBap));
			setBapImageSrc(artist?.images[0]?.url);
			setBapImageFile(null);
		} else {
			getToast('Error', 'Something went wrong. Try again later');
		}
		setIsSyncing(false);
	};

	const handleOpenDeleteModal = async () => {
		setIsLoadingMembers(true);
		const res = await dispatch(getBapMembers({ bapId: selectedBap.bapId, userId: user?.id }));
		setIsLoadingMembers(false);
		if (res?.payload?.success) {
			setCurrentModal(4);
		} else {
			getToast('Error', 'Something went wrong. Try again later');
		}
	};

	const isDefaultLogo = bapImageSrc === '/assets/images/logo-primary.png';

	return (
		<>
			<Flex flexDir={'column'} w='100%' h='100%'>
				<Flex
					justifyContent={'space-between'}
					alignItems={'center'}
					w='100%'
					pb='24px'
					pr='24px'
					bgColor={'white'}
					borderRadius='10px'
				>
					<Text fontSize={'18px'} fontWeight={'500'} pl='12px'>
						Edit
					</Text>

					<Flex>
						<CustomButton
							isSubmiting={isSubmiting}
							onClickHandler={handleSaveButton}
							styles={isNewBapData ? 'main' : 'disabled'}
						>
							Save
						</CustomButton>

						<CustomButton styles={'light'} ml='16px' onClickHandler={cancelHandler}>
							Cancel
						</CustomButton>
					</Flex>
				</Flex>

				<Flex ref={containerRef} mr='24px' flexDir={'column'} h='100%' w='100%' overflow={'auto'}>
					<Flex flexDir={'column'} w='100%' maxW='475px'>
						<Text px='12px' fontSize={'16px'} fontWeight={'400'} color='black'>
							Title
						</Text>

						<FormControl isInvalid={isNameError}>
							<CustomInput
								isInvalid={!!isNameError}
								name={'bapName'}
								value={selectedBapUpdated?.bapName || ''}
								onChange={handleChange}
								readOnly={selectedBapUpdated?.spotifyId}
							/>
							{isNameError ? (
								<FormErrorMessage mt='4px' px='12px' fontSize='14px' fontWeight='400' color='accent'>
									Title is required.
								</FormErrorMessage>
							) : (
								<FormHelperText mt='4px' px='12px' fontSize='14px' fontWeight='400' color='secondary'>
									Tell us the name of your band, artist or project.
								</FormHelperText>
							)}
						</FormControl>
						{selectedBap.spotifyId ? (
							<CustomButton
								onClickHandler={handleResyncToSpotify}
								iconRight={spotifyIcon}
								w='213px'
								styles={'transparent-bold'}
								mt='20px'
								ml='2px'
								isSubmiting={isSyncing}
							>
								<Text>Resync to Spotify</Text>
							</CustomButton>
						) : (
							<Flex alignItems={'center'} mt='20px' gap='12px'>
								<Text pl='12px' fontSize={'16px'} fontWeight={'400'} color='black'>
									Pull in your artist image from Spotify
								</Text>

								<CustomButton
									onClickHandler={() => setCurrentModal(3)}
									iconRight={spotifyIcon}
									w='213px'
									styles={'transparent-bold'}
								>
									<Text>Sync with Spotify</Text>
								</CustomButton>
							</Flex>
						)}
						<Box mt='20px'>
							<Flex justifyContent={'space-between'} alignItems={'center'} mb='4px'>
								<Text px='12px' color='black' fontSize='16px'>
									Short description
								</Text>

								<Text color={'secondary'} fontWeight={'400'} fontSize='14px'>
									{selectedBapUpdated?.bapDescription?.trim()?.length || 0}/160
								</Text>
							</Flex>

							<CustomTextarea
								name={'bapDescription'}
								value={selectedBapUpdated?.bapDescription || ''}
								onChange={handleChange}
								placeholder='Enter text'
								minH='144px'
								border='1px solid #D2D2D2'
								borderColor='brand.lightGray'
								borderRadius='10px'
								bgColor='brand.white'
								_focus={{
									borderColor: 'brand.gray',
								}}
								maxLength={160}
								resize='none'
								_placeholder={{ color: 'stroke' }}
							/>

							<Text mt='4px' px='12px' fontWeight={'400'} fontSize={'14px'} color='secondary'>
								This description will be used as the default meta description for your web pages
							</Text>
						</Box>
						{/* <Box mt='20px'>
							<Flex justifyContent={'space-between'} alignItems={'center'} mb='4px'>
								<Text px='12px' color='black' fontSize='16px'>
									Artist biography
								</Text>

								<Text color={'secondary'} fontWeight={'400'} fontSize='14px'>
									{selectedBapUpdated?.bapArtistBio?.trim()?.length || 0}/320
								</Text>
							</Flex>

							<CustomTextarea
								name={'bapArtistBio'}
								value={selectedBapUpdated?.bapArtistBio || ''}
								onChange={handleChange}
								placeholder='Enter text'
								minHeight='120px'
								border='1px solid #D2D2D2'
								borderColor='brand.lightGray'
								borderRadius='10px'
								bgColor='brand.white'
								maxLength={320}
							/>

							<Text mt='4px' px='12px' fontWeight={'400'} fontSize={'14px'} color='secondary'>
								Save time! Add your artist biography once here and it will automatically be pulled through
								into your future press and sync submissions
							</Text>
						</Box> */}
						<Box mt='20px'>
							<Text px='12px' color='black' fontSize='16px' mb='4px'>
								Country of the artist
							</Text>
							<CustomSelect
								options={countries.list}
								name='country'
								value={selectedBapUpdated?.country || ''}
								placeholder='Select'
								onChange={handleSelect}
							/>
							<Text mt='4px' px='12px' fontWeight={'400'} fontSize={'14px'} color='secondary'>
								The country name will be used in distribution
							</Text>
						</Box>
						<Box mt='16px'>
							<Text px='12px'>Profile picture</Text>

							<Text mt='4px' px='12px' fontWeight={'400'} fontSize={'14px'} color='secondary'>
								This will become the default image for press and publishing submissions. You can change it
								later.
							</Text>

							<Flex mt='16px' px='12px'>
								<Flex flexDir={'column'} w='min-content'>
									<Flex>
										<Canva
											setImageFile={setBapImageFile}
											setImageSrc={setBapImageSrc}
											w={'202px'}
											h={'130px'}
											setNewDesignId={setNewDesignId}
											create={true}
											title='Use Canva to create your profile picture'
										/>
										<Flex justify='center' align='center' mx='16px'>
											<Text fontSize='14px' fontWeight='400' color='secondary'>
												or
											</Text>
										</Flex>
										<UploadImage
											setImageSrc={setBapImageSrc}
											setImageFile={handleChooseImgFile}
											w={'202px'}
											h={'130px'}
										/>
									</Flex>

									{bapImageSrc && (
										<Box
											pos='relative'
											mt='8px'
											borderRadius='10px'
											overflow='hidden'
											w='450px'
											h='450px'
											maxH={isDefaultLogo ? '300px' : '450px'}
										>
											{isDefaultLogo ? (
												<Image src={bapImageSrc} alt='bap image' w='450px' h='300px' />
											) : (
												<Image
													src={bapImageSrc}
													alt='bap image'
													w='450px'
													h='450px'
													style={{ objectFit: 'cover' }}
												/>
											)}
											{!isDefaultLogo && (
												<Tooltip
													hasArrow
													label={'Delete B.A.P. logo'}
													placement='top'
													bg='bg.black'
													color='textColor.white'
													fontSize='16px'
													borderRadius={'5px'}
												>
													<Box pos='absolute' right={newDesignId ? '60px' : '10px'} top='10px'>
														<IconButton
															size='md'
															aria-label={'Delete B.A.P. logo'}
															icon={<TrashIcon />}
															color='secondary'
															transition='0.3s linear'
															onClick={handleDeleteLogo}
															bgColor='bg.secondary'
														/>
													</Box>
												</Tooltip>
											)}

											{newDesignId && (
												<Tooltip
													hasArrow
													label={'This design can be edited with Canva'}
													placement='top'
													bg='bg.black'
													color='textColor.white'
													fontSize='16px'
													borderRadius={'5px'}
												>
													<Box position={'absolute'} top='10px' right='10px' overflow={'hidden'}>
														<Canva
															setImageFile={setBapImageFile}
															setImageSrc={setBapImageSrc}
															w={'40px'}
															h={'40px'}
															title={''}
															setNewDesignId={setNewDesignId}
															designId={newDesignId}
															justify={'space-between'}
															flexDir={'row'}
															create={false}
														/>
													</Box>
												</Tooltip>
											)}
										</Box>
									)}
								</Flex>
							</Flex>
						</Box>
						<Genres
							genresData={genresData}
							setGenresData={setGenresData}
							setIsNewGenres={setIsNewGenres}
							currentGenres={selectedBap?.genres}
						/>
					</Flex>

					<Flex justifyContent={'end'} pr='24px' mt='32px'>
						{selectedBap?.isCreator && (
							<CustomButton
								mb='3px'
								h='40px'
								onClickHandler={handleOpenDeleteModal}
								_hover={''}
								styles='light-red'
								isSubmiting={isLoadingMembers}
							>
								Delete B.A.P.
							</CustomButton>
						)}
					</Flex>
				</Flex>
			</Flex>

			{currentModal === 1 && <CreateNewBAPModal setCurrentModal={setCurrentModal} />}
			{currentModal === 2 && <ConfirmConnectToSpotify setCurrentModal={setCurrentModal} />}
			{currentModal === 3 && (
				<BandSearchInSpotify
					setBapImageSrc={setBapImageSrc}
					setBapImageFile={handleChooseImgFile}
					closeBandSpotifyModal={closeBandSpotifyModal}
					setGenresData={setGenresData}
					setIsNewGenres={setIsNewGenres}
				/>
			)}
			{currentModal === 4 && (
				<DeleteModal
					title={'Delete B.A.P.'}
					text={'Are you sure, that you want to delete this bap?'}
					description={'Once deleted, it cannot be restored'}
					closeModal={() => setCurrentModal(0)}
					deleteHandler={onDeleteBap}
					setCandidateEmail={setCandidateEmail}
					candidateEmail={candidateEmail}
					isBapDeletion={true}
					isMultiUsers={isMultiUsers}
					isEmailError={isEmailError}
					setIsEmailError={setIsEmailError}
					membersOptions={membersOptions}
					isLoadingDelete={isLoading}
				/>
			)}
		</>
	);
};

export default MainInfoEditing;
