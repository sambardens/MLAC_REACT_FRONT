import { useRouter } from 'next/router';

import {
	Box,
	Flex,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	Image,
	Text,
	Tooltip,
	useToast,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeBapSocialLinks } from 'store/links/links-operations';
import { createBap, editBapInfo, saveBapGenres } from 'store/operations';
import { setSelectedBapUpdated } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import Canva from '@/components/Canva/Canva';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import CustomTextarea from '@/components/CustomInputs/CustomTextarea';
import Genres from '@/components/Genres/Genres';
import { CreateNewBAPModal } from '@/components/Modals/NewBap/CreateNewBAPModal';
import { JoinExistingBapModal } from '@/components/Modals/NewBap/JoinExistingBapModal';
import { NewBapModal } from '@/components/Modals/NewBap/NewBapModal';
import { BandSearchInSpotify } from '@/components/Spotify/BandSearchInSpotify';
import { ConfirmConnectToSpotify } from '@/components/Spotify/ConfirmConnectToSpotify';
import UploadImage from '@/components/UploadMedia/UploadImage';

import countries from '@/assets/countries.json';
import spotifyIcon from '@/assets/icons/social/spotify-small.svg';

const NewBap = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isNameError, setIsNameError] = useState(false);
	const toast = useToast();
	const { selectedBap, selectedBapUpdated } = useSelector(state => state.user);

	const [bapImageFile, setBapImageFile] = useState(null);
	const [bapImageSrc, setBapImageSrc] = useState(null);
	const [genresData, setGenresData] = useState({
		mainGenre: null,
		secondaryGenre: null,
		subGenres: [],
	});

	const [currentModal, setCurrentModal] = useState(0);
	const [newDesignId, setNewDesignId] = useState(null);
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

	const handleSelect = ({ value }) => {
		const updatedBap = { ...selectedBapUpdated, country: value };
		dispatch(setSelectedBapUpdated(updatedBap));
	};

	const handleChange = e => {
		const { name, value } = e.target;
		const updatedBap = { ...selectedBapUpdated, [name]: value };
		dispatch(setSelectedBapUpdated(updatedBap));
	};

	const hanldeBlur = () => {
		const res = selectedBapUpdated?.bapName?.trim()?.length > 0 ? false : true;
		setIsNameError(res);
	};
	const handleSaveButton = async () => {
		if (isNameError) {
			return;
		}

		setIsSubmiting(true);
		const { bapName, role } = selectedBapUpdated;
		const formData = new FormData();
		formData.append('name', `${bapName}`);
		formData.append('role', `${role}`);

		const newBapRes = await dispatch(createBap(formData));
		if (newBapRes?.payload?.error) {
			getToast('Error', newBapRes?.payload?.error);
			setIsSubmiting(false);
			return;
		}
		const bapId = newBapRes.payload.bapId;
		const isMainInfoUpdate =
			selectedBapUpdated?.bapDescription?.trim() ||
			selectedBapUpdated?.bapArtistBio?.trim() ||
			bapImageFile ||
			bapImageSrc ||
			newDesignId ||
			selectedBapUpdated?.spotifyId ||
			selectedBapUpdated?.country;

		if (isMainInfoUpdate) {
			const bapData = {
				name: selectedBapUpdated.bapName.trim(),
				description: selectedBapUpdated?.bapDescription?.trim() || '',
				artistBio: selectedBapUpdated?.bapArtistBio?.trim() || '',
				bapImageFile,
				bapImageSrc,
				bapId,
				designId: newDesignId || '',
				spotifyId: selectedBapUpdated?.spotifyId,
				spotifyUri: selectedBapUpdated?.spotifyUri,
				deezerId: selectedBapUpdated?.deezerId,
				napsterId: selectedBapUpdated?.napsterId,
				appleMusicId: selectedBapUpdated?.appleMusicId,
				facebookPixel: selectedBapUpdated?.facebookPixel || '',
				country: selectedBapUpdated?.country,
				soundCloudId: selectedBapUpdated?.soundCloudId || '',
			};
			const editRes = await dispatch(editBapInfo(bapData));
			if (editRes?.payload?.error) {
				getToast(
					'Error',
					'Your B.A.P. has been created but some information was not saved. Please try again later.',
				);
				setIsSubmiting(false);
				return;
			}
		}
		if (selectedBapUpdated?.socialLinks) {
			dispatch(
				changeBapSocialLinks({
					socialData: selectedBapUpdated?.socialLinks,
					bapId,
				}),
			);
		}
		if (genresData.mainGenre?.id) {
			const genresRes = await dispatch(saveBapGenres({ bapId, genres: genresData }));
			if (genresRes?.payload?.error) {
				getToast('Error', 'The genres have not been saved. Please try again later.');
			}
		}
		router.push({
			pathname: '/bap/[bapId]/bap-info',
			query: { bapId },
		});
		getToast('Success', 'Your B.A.P. has been created.');
		// setIsSubmiting(false);
	};

	const cancelHandler = async () => {
		setCurrentModal(null);
		router.back();
	};

	const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

	useEffect(() => {
		const handleResize = () => {
			setViewportHeight(window.innerHeight);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (selectedBap?.isFirstVisit === 'yes') {
			setCurrentModal(4);
		} else if (selectedBap?.isFirstVisit === 'no') {
			setCurrentModal(1);
		}
	}, [selectedBap?.isFirstVisit]);

	const closeBandSpotifyModal = () => {
		setCurrentModal(0);
	};

	return (
		<>
			<Flex
				flexDir={'column'}
				w='100%'
				py='24px'
				pl='24px'
				bg='bg.main'
				borderRadius='10px'
				h={`${viewportHeight - 115}px`}
			>
				<Flex justifyContent={'space-between'} alignItems={'center'} w='100%' pr='24px'>
					<Text fontSize={'18px'} fontWeight={'500'} ml='12px'>
						Create
					</Text>

					<Flex>
						<CustomButton
							isSubmiting={isSubmiting}
							onClickHandler={handleSaveButton}
							styles={selectedBapUpdated?.bapName ? 'main' : 'disabled'}
						>
							Save
						</CustomButton>

						<CustomButton styles={'light'} ml='16px' onClickHandler={cancelHandler}>
							Cancel
						</CustomButton>
					</Flex>
				</Flex>

				<Box h='100%' mt='24px' overflow={'auto'}>
					<Flex flexDir={'column'} w='100%' maxW='475px'>
						<Text px='12px' fontSize={'16px'} fontWeight={'400'}>
							Title
						</Text>

						<FormControl isInvalid={isNameError}>
							<CustomInput
								isInvalid={!!isNameError}
								name='bapName'
								value={selectedBapUpdated?.bapName || ''}
								onChange={handleChange}
								onBlur={hanldeBlur}
								readOnly={selectedBapUpdated?.spotifyId}
							/>
							{isNameError ? (
								<FormErrorMessage mt='4px' px='12px' fontSize='14px' fontWeight='400' color='accent'>
									Title is required.
								</FormErrorMessage>
							) : (
								<FormHelperText
									mt='4px'
									px='12px'
									fontSize={'14px'}
									fontWeight={'400'}
									color={'brand.textGray'}
								>
									Tell us the name of your band, artist or project.
								</FormHelperText>
							)}
						</FormControl>

						{!selectedBap.spotifyId && (
							<Flex alignItems={'center'} mt='20px' gap='12px'>
								<Text pl='12px' fontSize={'16px'} fontWeight={'400'} color='black'>
									Pull in your artist image from Spotify
								</Text>

								<CustomButton
									onClickHandler={() => setCurrentModal(5)}
									iconRight={spotifyIcon}
									w='213px'
									styles={'transparent-bold'}
								>
									<Text>Sync with Spotify</Text>
								</CustomButton>
							</Flex>
						)}
						<Box mt='20px'>
							<Flex justifyContent={'space-between'} alignItems={'center'}>
								<Text px='12px'>Short description</Text>

								<Text color={'secondary'} fontWeight={'400'} fontSize='14px'>
									{selectedBapUpdated?.bapDescription?.trim()?.length || 0}/160
								</Text>
							</Flex>

							<CustomTextarea
								name={'bapDescription'}
								value={selectedBapUpdated?.bapDescription || ''}
								onChange={handleChange}
								placeholder='Enter text'
								mt='4px'
								minH='144px'
								border='1px solid #D2D2D2'
								borderColor='brand.lightGray'
								borderRadius='10px'
								bgColor='brand.white'
								_focus={{
									borderColor: 'brand.gray',
								}}
								resize='none'
								maxLength={160}
							/>

							<Text mt='4px' px='12px' fontWeight={'400'} fontSize={'14px'} color='secondary'>
								This description will be used as the default meta description for your web pages
							</Text>
						</Box>
						{/* <Box mt='20px'>
							<Flex justifyContent={'space-between'} alignItems={'center'}>
								<Text px='12px'>Artist biography</Text>

								<Text color={'secondary'} fontWeight={'400'} fontSize='14px'>
									{selectedBapUpdated?.bapArtistBio?.trim()?.length || 0}/320
								</Text>
							</Flex>

							<CustomTextarea
								name={'bapArtistBio'}
								value={selectedBapUpdated?.bapArtistBio || ''}
								onChange={handleChange}
								placeholder='Enter text'
								mt='4px'
								minHeight='120px'
								border='1px solid #D2D2D2'
								borderColor='brand.lightGray'
								borderRadius='10px'
								bgColor='brand.white'
								_focus={{
									borderColor: 'brand.gray',
								}}
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

							<Flex mt='16px'>
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
											setImageFile={setBapImageFile}
											w={'202px'}
											h={'130px'}
										/>
									</Flex>
									{bapImageSrc && (
										<Box position='relative'>
											<Image src={bapImageSrc} alt='bap image' w='100%' mt='8px' />
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
													<Box position={'absolute'} top={'15px'} right={'10px'} overflow={'hidden'}>
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
						<Genres genresData={genresData} setGenresData={setGenresData} />
					</Flex>
				</Box>
			</Flex>

			{currentModal === 1 && (
				<NewBapModal setCurrentModal={setCurrentModal} cancelHandler={cancelHandler} />
			)}
			{currentModal === 2 && (
				<JoinExistingBapModal setCurrentModal={setCurrentModal} cancelHandler={cancelHandler} />
			)}
			{currentModal === 3 && (
				<CreateNewBAPModal setCurrentModal={setCurrentModal} cancelHandler={cancelHandler} />
			)}
			{currentModal === 4 && <ConfirmConnectToSpotify setCurrentModal={setCurrentModal} />}
			{currentModal === 5 && (
				<BandSearchInSpotify
					setBapImageSrc={setBapImageSrc}
					setBapImageFile={setBapImageFile}
					closeBandSpotifyModal={closeBandSpotifyModal}
					setGenresData={setGenresData}
				/>
			)}
		</>
	);
};

export default NewBap;
