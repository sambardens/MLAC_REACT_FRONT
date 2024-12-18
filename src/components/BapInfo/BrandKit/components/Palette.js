import { Box, Flex, Text, Tooltip, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import removePaletteOfBrand from 'src/functions/serverRequests/brandKit/removePaletteOfBrand';

import { HeaderCard } from '@/components/BapInfo/BrandKit/components/HeaderCard';
import DeleteModal from '@/components/Modals/DeleteModal';

import TrashIcon from '@/assets/icons/all/trash_2.svg';

import { ColorCards } from './ColorCards';
import { HeadingComponent } from './HeadingComponent';
import { TextWithArrow } from './TextWithArrow';
import PaletteCardSkeleton from './sekeletons/PaletteCardSkeleton';
import { poppins_400_14_21, poppins_500_16_24 } from '@/styles/fontStyles';

const initialColor = '#abcdef';

export const Palette = ({
	brandColorsFromImage,
	setBrandColorsFromImage,
	titlePalette,
	setTitlePalette,
	isLoadingData,
	paletteArr,
	setPaletteArr,
	brandKitData,
	isCanEdit,
	isCreateNewPalette,
	setIsCreateNewPalette,
	setOldPaletteArr,
}) => {
	const [isOpenDeletePaletteModal, setIsOpenDeletePaletteModal] = useState(false);
	const [isEditTitlePalette, setIsEdiTitlePalette] = useState(false);
	const [color, setColor] = useState(initialColor);
	const [currentPalette, setCurrentPalette] = useState(null);
	const toast = useToast();

	useEffect(() => {
		brandColorsFromImage?.length !== 0 && setIsEdiTitlePalette(true);
	}, [brandColorsFromImage]);

	const getToast = (title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status: 'error',
			duration: 5000,
			isClosable: true,
		});
	};

	const handleColorChange = () => {
		if (brandColorsFromImage?.length >= 3) {
			getToast('Error', 'You can only add three colours.');
		} else if (brandColorsFromImage) {
			setBrandColorsFromImage(prev => [...prev, { hex: color, id: crypto.randomUUID() }]);
		} else {
			setBrandColorsFromImage([{ hex: color, id: crypto.randomUUID() }]);
		}
	};

	const handleColorChangeInSavedPalette = paletteId => {
		const findPalette = paletteArr.find(item => item.id === paletteId);

		if (findPalette?.colours?.length === 3) {
			getToast('Error', 'You can only add three colours.');
			return;
		}
		if (findPalette) {
			findPalette.colours.push({ hex: color, id: crypto.randomUUID() });
			setPaletteArr(prevArr => {
				return prevArr.map(palette => {
					if (palette.id === paletteId) {
						return findPalette;
					}
					return palette;
				});
			});
		}
	};

	const handleClick = () => {
		console.log('click');
	};

	const deleteColorFromArrayColors = id => {
		setBrandColorsFromImage(prev =>
			prev?.filter(item => {
				return item?.id !== id;
			}),
		);
	};

	const removeColorFromItemPalette = (hexColor, itemPaletteId) => {
		const newPaletteArr = paletteArr.map(palette => {
			if (palette.id === itemPaletteId) {
				const newColours = palette.colours.filter(color => color.hex !== hexColor);
				return { ...palette, colours: newColours };
			}
			return palette;
		});
		setPaletteArr([...newPaletteArr]);
	};

	const handleDeleteUnsavedPalette = () => {
		setBrandColorsFromImage([]);
		setIsOpenDeletePaletteModal(false);
		setIsCreateNewPalette(false);
		setTitlePalette('New palette');
	};

	const handleDeleteSavedPalette = async currentPalette => {
		try {
			const res = await removePaletteOfBrand(brandKitData?.id, currentPalette?.name);

			if (res?.success) {
				setPaletteArr(prev => {
					return prev.filter(item => item.id !== currentPalette?.id);
				});
				setOldPaletteArr(prev => {
					return prev.filter(item => item.id !== currentPalette?.id);
				});
				setCurrentPalette(null);
				setIsOpenDeletePaletteModal(false);
			}
		} catch (error) {
			console.error(error);
			getToast('Error', 'Failed to delete palette. Please try again later.');
		}
	};

	const handleDeleteLastColor = () => {
		// brandColorsFromImage && setBrandColorsFromImage(prev => prev.slice(0, -1));
		setColor(initialColor);
	};

	const handleSaveNewPalette = () => {
		if (brandColorsFromImage?.length !== 3) {
			getToast('Error', 'The palette should only contain three colours.');
			return;
		}
		if (!titlePalette) {
			getToast('Error', 'The palette name must not be empty.');
			setIsEdiTitlePalette(true);
			return;
		}

		const desiredObject = paletteArr.find(obj => obj.name === titlePalette);
		if (desiredObject) {
			getToast('Error', 'The palette name must be unique.');
			setIsEdiTitlePalette(true);
			return;
		}

		const temp = [
			...paletteArr,
			{ name: titlePalette, id: crypto.randomUUID(), colours: brandColorsFromImage },
		];
		setPaletteArr(temp.reverse());
		setIsCreateNewPalette(false);
		setBrandColorsFromImage([]);
	};

	const handleOpenCreateNewPalette = () => {
		// setIsEdiTitlePalette(true);
		setTitlePalette('New palette');
		setIsCreateNewPalette(prev => !prev);
	};

	return (
		<Flex flexDir={'column'}>
			{isOpenDeletePaletteModal && (
				<DeleteModal
					closeModal={() => setIsOpenDeletePaletteModal(false)}
					deleteHandler={() => handleDeleteSavedPalette(currentPalette)}
					title={'Delete palette'}
					text={'Are you sure, that you want to delete this palette?'}
					description={'Once deleted, it cannot be restored'}
				/>
			)}

			{isCanEdit && (
				<HeadingComponent
					title={'Palette'}
					handleClick={handleClick}
					handleColorChange={handleColorChange}
					handleDeleteLastColor={handleDeleteLastColor}
					setColor={setColor}
					color={color}
					handleOpenCreateNewPalette={handleOpenCreateNewPalette}
				/>
			)}

			{isCanEdit &&
				paletteArr?.length === 0 &&
				!isLoadingData &&
				!isCreateNewPalette &&
				(!brandColorsFromImage || brandColorsFromImage?.length === 0) && (
					<TextWithArrow text={'Click the plus sign to add a new colour palette'} />
				)}

			{!isCanEdit && (
				<Text color={'textColor.gray'} sx={poppins_400_14_21} w={'100%'} pb='4px'>
					B.A.P owner or admin can add brand kit palette.
				</Text>
			)}

			{isLoadingData && <PaletteCardSkeleton />}

			{((brandColorsFromImage && brandColorsFromImage?.length !== 0 && !isLoadingData) ||
				isCreateNewPalette) && (
				<Box p={'14px 10px 20px 10px'} border={'1px solid #D2D2D2'} borderRadius={'5px'} mt={'8px'}>
					<HeaderCard
						handleDeleteUnsavedPalette={handleDeleteUnsavedPalette}
						titlePalette={titlePalette}
						setTitlePalette={setTitlePalette}
						handleSaveNewPalette={handleSaveNewPalette}
						isEditTitlePalette={isEditTitlePalette}
						setIsEdiTitlePalette={setIsEdiTitlePalette}
						isCanEdit={isCanEdit}
					/>

					<ColorCards
						brandColorsFromImage={brandColorsFromImage}
						deleteColorFromArrayColors={deleteColorFromArrayColors}
						handleColorChange={handleColorChange}
						handleDeleteLastColor={handleDeleteLastColor}
						setColor={setColor}
						color={color}
						isCanEdit={isCanEdit}
						isCanAddNew={!brandColorsFromImage || brandColorsFromImage?.length < 3}
					/>
				</Box>
			)}

			{paletteArr?.length > 0 && (
				<Box as='ul'>
					{paletteArr?.map(item => {
						return (
							<Box
								key={item?.id}
								as='li'
								p={'14px 10px 20px 10px'}
								border={'1px solid #D2D2D2'}
								borderRadius={'5px'}
								mt={'8px'}
							>
								<Flex alignItems={'center'} justifyContent={'space-between'}>
									<Tooltip
										hasArrow
										label={item?.name?.length > 11 && item?.name}
										placement='auto'
										bg='bg.black'
										color='textColor.white'
										fontSize='16px'
										borderRadius={'5px'}
									>
										<Text
											color='black'
											maxWidth={'200px'}
											sx={poppins_500_16_24}
											overflow={'hidden'}
											textOverflow={'ellipsis'}
											whiteSpace='nowrap'
										>
											{item?.name}
										</Text>
									</Tooltip>

									{isCanEdit && (
										<Box
											cursor={'pointer'}
											ml={'10px'}
											onClick={() => {
												setCurrentPalette(item);
												setIsOpenDeletePaletteModal(true);
											}}
										>
											<TrashIcon />
										</Box>
									)}
								</Flex>

								<ColorCards
									brandColorsFromImage={item?.colours}
									deleteColorFromArrayColors={deleteColorFromArrayColors}
									handleColorChange={handleColorChange}
									handleDeleteLastColor={handleDeleteLastColor}
									setColor={setColor}
									color={color}
									removeColorFromItemPalette={removeColorFromItemPalette}
									itemPalette={item}
									handleColorChangeInSavedPalette={handleColorChangeInSavedPalette}
									isCanEdit={isCanEdit}
									isCanAddNew={item?.colours?.length < 3}
								/>
							</Box>
						);
					})}
				</Box>
			)}
		</Flex>
	);
};
