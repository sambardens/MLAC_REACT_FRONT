import { Box, Flex, Grid, GridItem, Input, Text, Tooltip, useToast } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { extractColors } from 'extract-colors';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import deleteBrandKit from 'src/functions/serverRequests/brandKit/deleteBrandKit';
import editBrandMainInfo from 'src/functions/serverRequests/brandKit/editBrandMainInfo';
import editPaletteOfBrand from 'src/functions/serverRequests/brandKit/editPaletteOfBrand';
import getBrandInfoRequest from 'src/functions/serverRequests/brandKit/getBrandInfoRequest';
import compareArraysOfObjects from 'src/functions/utils/compareArraysOfObjects';
import getImageBlobFromUrl from 'src/functions/utils/getImageBlobFromUrl';
import getImageSrc from 'src/functions/utils/getImageSrc';
import jsonToFormData from 'src/functions/utils/jsonToFormData';
import { setSelectedBapUpdated } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import DeleteModal from '@/components/Modals/DeleteModal.js';

import TrashIcon from '@/assets/icons/all/trash_2.svg';
import EditIcon from '@/assets/icons/modal/edit.svg';

import { Fonts } from './components/Fonts';
import { Logos } from './components/Logos';
import { Palette } from './components/Palette';
import { poppins_600_18_27 } from '@/styles/fontStyles';

//  options for extractColors

const options = {
	pixels: 64000,
	distance: 0.3,
	colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
	saturationDistance: 0.35,
	lightnessDistance: 0.35,
	hueDistance: 0.083333333,
};

export const BrandKitTab = () => {
	const { selectedBapUpdated, selectedBap } = useSelector(state => state.user);
	const [isEditTitle, setIsEditTitle] = useState(false);
	const [titleBrandKit, setTitleBrandKit] = useState('');
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [selectedImageSrc, setSelectedImageSrc] = useState(null);
	const [selectedImageFile, setSelectedImageFile] = useState(null);
	const [brandColorsFromImage, setBrandColorsFromImage] = useState([]);
	const [isCreateNewPalette, setIsCreateNewPalette] = useState(false);
	//--------------------- initial ---------------------
	const [initialTitleBrandKit, setInitialTitleBrandKit] = useState('');
	const [initialBrandKitFonts, setInitialBrandKitFonts] = useState([]);
	const [initialImageSrc, setInitialImageSrc] = useState(null);
	const [oldPaletteArr, setOldPaletteArr] = useState([]);
	//--------------------- is new ---------------------
	const [isNewFonts, setIsNewFonts] = useState(false);
	const [isNewPallete, setIsNewPallete] = useState(false);

	//---------------------------------------------------
	const [brandKitFonts, setBrandKitFonts] = useState([]);
	const [selectedFont, setSelectedFont] = useState({
		activeFontFamily: 'Open Sans',
	});
	const [fontSizeValue, setFontSizeValue] = useState({ value: 14, label: 14 });
	const [brandKitData, setBrandKitData] = useState(null);
	const [isLoadingSaveData, setIsLoadingSaveData] = useState(false);
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [titlePalette, setTitlePalette] = useState('New palette');
	const [paletteArr, setPaletteArr] = useState([]);

	// for Canva
	const [newDesignId, setNewDesignId] = useState(null);
	const [bapImageSrc, setBapImageSrc] = useState(null);

	const toast = useToast();
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
	const isCanEdit = selectedBap?.isCreator || selectedBap?.isFullAdmin;

	useEffect(() => {
		const res = compareArraysOfObjects(initialBrandKitFonts, brandKitFonts);
		setIsNewFonts(res);
	}, [brandKitFonts, initialBrandKitFonts]);

	useEffect(() => {
		const arr1 = paletteArr.map(el => ({ ...el, colours: JSON.stringify(el.colours) }));
		const arr2 = oldPaletteArr.map(el => ({ ...el, colours: JSON.stringify(el.colours) }));
		const res = compareArraysOfObjects(arr1, arr2);
		setIsNewPallete(res);
	}, [oldPaletteArr, paletteArr]);

	const isNewLogo = Boolean(selectedImageFile || initialImageSrc !== bapImageSrc);
	const isNewTitle = initialTitleBrandKit !== titleBrandKit;
	const isNew =
		isNewTitle || isNewLogo || isNewFonts || isNewPallete || brandColorsFromImage?.length > 0;

	useEffect(() => {
		dispatch(setSelectedBapUpdated({ ...selectedBapUpdated, isEdited: isNew }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, isNew]);

	useEffect(() => {
		if (selectedBap?.bapId) {
			setIsLoadingData(true);
			getBrandInfoRequest(selectedBap?.bapId)
				.then(res => {
					if (!res) {
						getToast('error', 'Error', 'Error loading data from server');
					}

					setBrandKitData(res);
					setTitleBrandKit(res?.name || '');
					setInitialTitleBrandKit(res?.name || '');

					if (res?.fonts) {
						setBrandKitFonts(res?.fonts);
						setInitialBrandKitFonts(res?.fonts);
					}
					const logo = getImageSrc(res?.logo, false);
					setBapImageSrc(logo);
					setInitialImageSrc(logo);
					res?.designId && setNewDesignId(res?.designId);
					if (res?.palette) {
						const newPaletteArr = res?.palette.map(palette => {
							return {
								...palette,
								colours: [...palette.colours],
							};
						});
						setPaletteArr(newPaletteArr);
						setOldPaletteArr(res?.palette);
					}
				})
				.catch(error => {
					console.error(error);
				})
				.finally(() => {
					setIsLoadingData(false);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.bapId]);

	// for extractColors from Canva
	useEffect(() => {
		bapImageSrc &&
			getImageBlobFromUrl(bapImageSrc)
				.then(blob => {
					const imageSrc = URL.createObjectURL(blob);
					setSelectedImageSrc(imageSrc);
					bapImageSrc.substring(bapImageSrc.lastIndexOf('/') + 1) !== brandKitData?.logo &&
						extractColors(imageSrc, options).then(processExtractedColors).catch(console.error);
				})
				.catch(error => {
					console.log(error);
				});
	}, [bapImageSrc, brandKitData?.logo]);

	const deleteHandler = async () => {
		setIsLoadingDelete(true);
		try {
			const res = await deleteBrandKit(brandKitData?.id);
			if (res?.success) {
				setSelectedImageSrc(null);
				setBrandColorsFromImage([]);
				setBrandKitFonts([]);
				setInitialBrandKitFonts([]);
				setTitleBrandKit('');
				setInitialTitleBrandKit('');
				setIsOpenDeleteModal(false);
				setOldPaletteArr([]);
				setPaletteArr([]);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingDelete(false);
		}
	};

	const processExtractedColors = res => {
		const normalizedHexColorArray = [];
		res &&
			res.map(item =>
				normalizedHexColorArray.push({
					hex: item?.hex,
					id: nanoid(),
				}),
			);
		setBrandColorsFromImage(normalizedHexColorArray);
	};

	const handleFileSelect = async event => {
		setBapImageSrc(null);
		const selectedFileArg = event.target.files[0];
		setSelectedImageFile(selectedFileArg);
		setNewDesignId(null);
		setBrandColorsFromImage([]);
		if (selectedFileArg) {
			const imageSrc = URL.createObjectURL(selectedFileArg);
			setSelectedImageSrc(imageSrc);

			extractColors(imageSrc, options).then(processExtractedColors).catch(console.error);
		}
	};

	const handleButtonClick = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.onchange = handleFileSelect;
		fileInput.click();
	};

	const saveMainInfo = async () => {
		const isNewBrandKit = isNewTitle || isNewLogo || isNewFonts;
		if (!isNewBrandKit) {
			setIsLoadingSaveData(false);
			return;
		}
		const options = {
			name: titleBrandKit,
			...(newDesignId && { designId: newDesignId }),
			fonts: JSON.stringify(brandKitFonts),
		};
		if (selectedImageFile) {
			options.logo = selectedImageFile;
		} else if (
			bapImageSrc?.includes('https://i.scdn.co/') ||
			bapImageSrc?.includes('https://export-download.canva')
		) {
			options.urlLogo = bapImageSrc;
			setInitialImageSrc(bapImageSrc);
		}

		try {
			await editBrandMainInfo(brandKitData?.id, jsonToFormData(options));
			setInitialTitleBrandKit(titleBrandKit);
			setInitialBrandKitFonts(brandKitFonts);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoadingSaveData(false);
		}
	};

	const handleSaveNewData = async () => {
		if (brandColorsFromImage?.length > 0) {
			getToast('error', 'Error', 'Please complete editing your colour palette.');
			return;
		}
		setIsLoadingSaveData(true);
		if (isNewPallete && paletteArr?.length !== 0) {
			const isCompletedPallete = paletteArr.every(el => el.colours?.length === 3);
			if (!isCompletedPallete) {
				getToast('error', 'Error', 'Your colour palette must contain three colours.');
				setIsLoadingSaveData(false);
				return;
			}

			const editPromises = paletteArr.map(({ name, colours }) => {
				const hexArray = colours.map(obj => obj.hex);
				const paletteOptions = { brandPaletteName: name, hex: hexArray };
				return editPaletteOfBrand(brandKitData?.id, paletteOptions);
			});

			try {
				await Promise.all(editPromises);
				setOldPaletteArr([...paletteArr]);
			} catch (error) {
				getToast('error', 'Error', 'Something went wrong. Colours have been not saved');
				setIsLoadingSaveData(false);
				return;
			}
		}
		saveMainInfo();
	};

	const handleInitialState = () => {
		setSelectedImageFile(null);
		setBapImageSrc(initialImageSrc);
		setPaletteArr([...oldPaletteArr]);
		setBrandKitFonts(initialBrandKitFonts);
		setTitleBrandKit(initialTitleBrandKit);
		setBrandColorsFromImage([]);
		setIsCreateNewPalette(false);
	};
	return (
		<>
			<Flex alignItems={'center'} justifyContent={'space-between'} mb={'24px'}>
				<Flex alignItems={'center'}>
					{/* <Box>
						<ArrowDownIcon />
					</Box> */}

					{isEditTitle ? (
						<Input
							variant={'unstyled'}
							minW={'150px'}
							maxWidth={'400px'}
							flexGrow={'1'}
							sx={poppins_600_18_27}
							color='black'
							borderBottom={'2px'}
							borderRadius={'0px'}
							height={'22px'}
							borderColor={'secondary'}
							autoFocus={isEditTitle}
							// disabled={isLoadingName}
							onBlur={() => setIsEditTitle(false)}
							value={titleBrandKit}
							onChange={e => {
								setTitleBrandKit(e.target.value);
							}}
						/>
					) : (
						<Tooltip
							hasArrow
							label={titleBrandKit?.length > 39 && titleBrandKit}
							placement='auto'
							bg='bg.black'
							color='textColor.white'
							fontSize='16px'
							borderRadius={'5px'}
						>
							{!isLoadingData ? (
								<Text
									maxWidth={'400px'}
									color='black'
									sx={poppins_600_18_27}
									overflow={'hidden'}
									textOverflow={'ellipsis'}
									whiteSpace='nowrap'
									ml={'16px'}
								>
									{titleBrandKit?.trim() ? titleBrandKit?.trim() : 'Brand kit'}
								</Text>
							) : (
								<Box
									className='animate-pulse'
									w={'85px'}
									h={'20px'}
									bg={'bg.secondary'}
									mx={'15px'}
									borderRadius={'5px'}
								/>
							)}
						</Tooltip>
					)}

					{isCanEdit && (
						<Box
							cursor={'pointer'}
							onClick={() => {
								setIsEditTitle(prev => !prev);
							}}
							ml='10px'
						>
							<EditIcon />
						</Box>
					)}
				</Flex>

				{isCanEdit && (
					<Flex alignItems={'center'}>
						<Box
							cursor={'pointer'}
							onClick={() => {
								setIsOpenDeleteModal(true);
							}}
							mr={'20px'}
						>
							<TrashIcon />
						</Box>

						<CustomButton
							isSubmiting={isLoadingSaveData}
							onClickHandler={handleSaveNewData}
							styles={isNew ? 'main' : 'disabled'}
						>
							Save
						</CustomButton>
						<CustomButton
							onClickHandler={handleInitialState}
							styles={!isLoadingSaveData && isNew ? 'light' : 'disabled'}
							ml='16px'
						>
							Cancel
						</CustomButton>
					</Flex>
				)}
			</Flex>
			<Flex flexDir={'column'} h={'calc(100% - 80px)'} overflow={'auto'}>
				{isOpenDeleteModal && (
					<DeleteModal
						closeModal={() => {
							setIsOpenDeleteModal(false);
						}}
						deleteHandler={deleteHandler}
						title={'Delete Brand kit'}
						text={'Are you sure you want to delete the brand kit?'}
						description={'Once deleted, it cannot be restored'}
						isLoadingDelete={isLoadingDelete}
					/>
				)}

				<Grid templateColumns='repeat(3, 1fr)' gap={'20px'}>
					<GridItem borderRadius={'5px'}>
						<Logos
							handleButtonClick={handleButtonClick}
							selectedImageSrc={selectedImageSrc}
							setBapImageSrc={setBapImageSrc}
							setNewDesignId={setNewDesignId}
							newDesignId={newDesignId}
							isLoadingData={isLoadingData}
							brandKitData={brandKitData}
							isCanEdit={isCanEdit}
						/>
					</GridItem>
					<GridItem borderRadius={'5px'}>
						<Palette
							brandColorsFromImage={brandColorsFromImage}
							setBrandColorsFromImage={setBrandColorsFromImage}
							setTitlePalette={setTitlePalette}
							titlePalette={titlePalette}
							isLoadingData={isLoadingData}
							paletteArr={paletteArr}
							setPaletteArr={setPaletteArr}
							brandKitData={brandKitData}
							isCanEdit={isCanEdit}
							setIsCreateNewPalette={setIsCreateNewPalette}
							isCreateNewPalette={isCreateNewPalette}
							setOldPaletteArr={setOldPaletteArr}
						/>
					</GridItem>
					<GridItem borderRadius={'5px'}>
						<Fonts
							selectedFont={selectedFont}
							setSelectedFont={setSelectedFont}
							brandKitFonts={brandKitFonts}
							setBrandKitFonts={setBrandKitFonts}
							fontSizeValue={fontSizeValue}
							setFontSizeValue={setFontSizeValue}
							isLoadingData={isLoadingData}
							isCanEdit={isCanEdit}
						/>
					</GridItem>
				</Grid>
			</Flex>
		</>
	);
};
