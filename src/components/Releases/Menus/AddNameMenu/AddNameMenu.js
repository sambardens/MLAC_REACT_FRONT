import { Box, Image as ChakraImage, Flex, Text, Tooltip, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import compareObjects from 'src/functions/utils/compareObjects';
import getTodayDate from 'src/functions/utils/getTodayDate';
import { handleCreateRelease, handleEditRelease, handleSaveReleaseLogo } from 'store/operations';
import { setReleaseSelectedMenu } from 'store/slice';

import Canva from '@/components/Canva/Canva';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import UploadImage from '@/components/UploadMedia/UploadImage';

import NextButton from '../../../Buttons/NextButton/NextButton';
import MenuTitle from '../MenuTitle/MenuTitle';

import { releaseTypes } from './releaseTypes';

const AddNameMenu = ({ handleSelectMenu }) => {
	const [isLoading, setIsLoading] = useState(false);
	const { selectedBap, selectedRelease } = useSelector(state => state.user);
	const initialReleaseData = {
		name: selectedRelease.name,
		type: selectedRelease.type,
	};
	const [releaseData, setReleaseData] = useState(initialReleaseData);
	const [oldReleaseData, setOldReleaseData] = useState(initialReleaseData);
	const [imageFile, setImageFile] = useState(null);
	const [newDesignId, setNewDesignId] = useState(selectedRelease.designId);
	const [canvaSrc, setCanvaSrc] = useState('');
	const [imageSrc, setImageSrc] = useState(selectedRelease?.logoMin || selectedRelease.logo || '');
	const toast = useToast();

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

	const { name, type } = releaseData;
	const fields = name && type && imageSrc;
	const dispatch = useDispatch();
	const handleChange = e => {
		const { name, value } = e.target;
		setReleaseData(prev => ({ ...prev, [name]: value }));
	};

	const handleSelect = ({ value }) => {
		setReleaseData(prev => ({ ...prev, type: value }));
	};

	const handleEditReleaseData = async e => {
		if (!selectedRelease?.id) return;
		const isNewReleaseData = compareObjects(releaseData, oldReleaseData);
		if (isNewReleaseData) {
			// const isDuplicate = Boolean(selectedBap.releases?.find(el => el.name === name));
			// if (isDuplicate) {
			// 	toast({
			// 		position: 'top',
			// 		title: 'Error',
			// 		description: 'You already have release this current name',
			// 		status: 'error',
			// 		duration: 5000,
			// 		isClosable: true,
			// 	});
			// 	return;
			// }
			dispatch(handleEditRelease({ releaseId: selectedRelease.id, releaseData }));
			setOldReleaseData(releaseData);
		}
	};

	const handleRelease = async () => {
		if (fields) {
			if (!selectedRelease?.id) {
				// const isDuplicate = Boolean(selectedBap.releases?.find(el => el.name === name));
				// if (isDuplicate) {
				// 	toast({
				// 		position: 'top',
				// 		title: 'Error',
				// 		description: 'You already have release with current name',
				// 		status: 'error',
				// 		duration: 5000,
				// 		isClosable: true,
				// 	});
				// 	return;
				// }
				const formData = new FormData();
				formData.append('name', name);
				formData.append('type', type);
				formData.append('releaseDate', getTodayDate());

				setIsLoading(true);
				if (imageFile) {
					formData.append('logo', imageFile);
				} else if (canvaSrc.includes('https://i.scdn.co/') || canvaSrc.includes('https://export-download.canva')) {
					formData.append('urlLogo', canvaSrc);
				} else if (
					imageSrc?.includes('https://i.scdn.co/') ||
					imageSrc?.includes('https://mosaic.scdn.co/') ||
					imageSrc?.includes('https://e-cdns-images.dzcdn.net') ||
					imageSrc?.includes('https://is1-ssl.mzstatic.com')
				) {
					formData.append('urlLogo', imageSrc);
				}
				const res = await dispatch(handleCreateRelease({ bapId: selectedBap?.bapId, formData, isExisting: false }));
				if (res?.payload?.success) {
					dispatch(setReleaseSelectedMenu(2));
				} else {
					getToast('error', 'Error', res?.payload?.error);
				}
				setIsLoading(false);
			} else {
				handleSelectMenu(2);
			}
		} else {
			getToast('error', 'Not available', 'At first you need to add name, type and artwork image of the release');
		}
	};

	const handleEditLogo = async () => {
		const formData = new FormData();
		if (imageFile) {
			formData.append('logo', imageFile);
			formData.append('designId', newDesignId ? newDesignId : null);
			dispatch(handleSaveReleaseLogo({ id: selectedRelease.id, formData }));
			setCanvaSrc('');
			setImageFile(null);
			return;
		} else if (canvaSrc.includes('https://i.scdn.co/') || canvaSrc.includes('https://export-download.canva')) {
			formData.append('urlLogo', canvaSrc);
			formData.append('designId', newDesignId ? newDesignId : null);
			dispatch(handleSaveReleaseLogo({ id: selectedRelease.id, formData }));
			setCanvaSrc('');
			setImageFile(null);
		}
	};

	useEffect(() => {
		if (selectedRelease?.id && (imageFile || canvaSrc)) {
			handleEditLogo();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canvaSrc, imageFile]);

	const handleCanvaSrc = src => {
		setImageSrc(src);
		setCanvaSrc(src);
		setImageFile(null);
	};

	const handleChooseImgFile = data => {
		setNewDesignId(null);
		setImageFile(data);
	};

	const handleChooseImgSrc = data => {
		setNewDesignId(null);
		setImageSrc(data);
	};

	const editLogoAvalaible = (!imageSrc && selectedRelease?.releaseSpotifyId) || !selectedRelease?.releaseSpotifyId || selectedRelease?.artwork?.error;
	const coverArtText = `This image will be used as the cover for your release. ${
		editLogoAvalaible ? 'The artwork image must be of 1:1 ratio (square), and size can range from 1400px to 4000px. File size should be between 100KB and 10 MB' : ''
	}`;

	useEffect(() => {
		if (selectedRelease.id) {
			setReleaseData({
				name: selectedRelease.name,
				type: selectedRelease.type || '',
			});
			setOldReleaseData({
				name: selectedRelease.name,
				type: selectedRelease.type || '',
			});
			selectedRelease.logo && setImageSrc(selectedRelease.logoMin || selectedRelease.logo);
			selectedRelease.designId && setNewDesignId(selectedRelease.designId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRelease.id]);
	return (
		<Flex flexDir='column' justify='space-between' h='100%' pos='relative'>
			<Box>
				<Flex>
					<MenuTitle
						title='Title & artwork'
						// text='Add a title for your release and an artwork, they will be used for sale in the future'
					/>
				</Flex>
				<Box mb='32px' maxW='500px'>
					<CustomInput
						label='Title'
						name='name'
						value={name}
						onChange={handleChange}
						onBlur={handleEditReleaseData}
						placeholder='Add the title of your release'
						mb='16px'
						readOnly={selectedRelease?.releaseSpotifyId}
					/>
					<CustomSelect options={releaseTypes} name='type' value={type} placeholder='Select version type' onChange={handleSelect} onBlur={handleEditReleaseData} label='Type' />
				</Box>
				<MenuTitle title='Cover art' text={coverArtText} mb='16px' />
				{editLogoAvalaible && (
					<Flex>
						<Canva setImageSrc={handleCanvaSrc} setImageFile={setImageFile} setNewDesignId={setNewDesignId} create={true} checkSize={true} />
						<Flex justify='center' align='center' mx='16px'>
							<Text fontSize='14px' fontWeight='400' color='secondary'>
								or
							</Text>
						</Flex>
						<UploadImage setImageSrc={handleChooseImgSrc} setImageFile={handleChooseImgFile} checkSize={true} />
					</Flex>
				)}
				{imageSrc && (
					<Box position={'relative'} mt='20px' borderRadius='10px' overflow='hidden' w='301px'>
						<ChakraImage alt='Release logo' src={imageSrc} width={301} height={301} quality={100} />
						{newDesignId && newDesignId !== 'null' && (
							<Tooltip hasArrow label={'This design can be edited with Canva'} placement='top' bg='bg.black' color='textColor.white' fontSize='16px' borderRadius={'5px'}>
								<Box position={'absolute'} top={'15px'} right={'10px'} overflow={'hidden'}>
									<Canva
										setImageFile={setImageFile}
										setImageSrc={handleCanvaSrc}
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
			</Box>
			<Flex mt='16px'>
				<NextButton onClickHandler={handleRelease} isSubmiting={isLoading} styles={fields ? 'main' : 'disabled'} />
			</Flex>
		</Flex>
	);
};

export default AddNameMenu;
