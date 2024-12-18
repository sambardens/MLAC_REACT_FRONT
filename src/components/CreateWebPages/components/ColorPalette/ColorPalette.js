import {
	Box,
	Flex,
	IconButton,
	ListItem,
	Text,
	Tooltip,
	UnorderedList,
	useToast,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import getAccurateTooltipLabel from 'src/functions/utils/shop/getAccurateTooltipLabel';
import isPaletteChecked from 'src/functions/utils/web-pages/shop/isPaletteSelected';

import { ColorCards } from '@/components/BapInfo/BrandKit/components/ColorCards';
import DeleteModal from '@/components/Modals/DeleteModal';
import Cross from '@/components/VisualElements/Cross';

import AddPaletteIcon from '@/assets/icons/all/addPalette.svg';

import { HeaderCard } from '../../../BapInfo/BrandKit/components/HeaderCard';

import { poppins_400_14_21, poppins_500_16_24, poppins_500_18_27 } from '@/styles/fontStyles';

const initialColor = '#abcdef';

export const ColorPalette = ({
	paletteList,
	mt,
	isCross = false,
	selectionHandler,
	onCrossClick,
	storedPalette,
}) => {
	const [isOpenDeletePaletteModal, setIsOpenDeletePaletteModal] = useState(false);
	const [colorsArr, setColorsArr] = useState([]);
	const [newColorArr, setNewColorArr] = useState([]);
	const [color, setColor] = useState(initialColor);
	const [isCreateNewPalette, setIsCreateNewPalette] = useState(false);
	const [titlePalette, setTitlePalette] = useState('My palette');
	const [isEditTitlePalette, setIsEdiTitlePalette] = useState(false);
	// Этот стейт перекинуть в родительский для отправки на бек (выбранная палитра цветов)
	const [checkedPalette, setCheckedPalette] = useState(storedPalette);

	useEffect(() => {
		setCheckedPalette(storedPalette);
	}, [storedPalette]);

	const handlePaletteSelection = value => {
		setCheckedPalette(value);
		selectionHandler(value);
	};

	const toast = useToast();

	useEffect(() => {
		if (paletteList) {
			setColorsArr(paletteList);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getToast = (title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status: 'error',
			duration: 4000,
			isClosable: true,
		});
	};

	const handleColorChange = () => {
		if (newColorArr) {
			setNewColorArr(prev => [...prev, { hex: color, id: crypto.randomUUID() }]);
		} else {
			setNewColorArr([{ hex: color, id: crypto.randomUUID() }]);
		}
	};

	const deleteColorFromArrayColors = id => {
		setNewColorArr(prev =>
			prev?.filter(item => {
				return item?.id !== id;
			}),
		);
	};

	const handleDeleteLastColor = () => {
		// brandColorsFromImage && setBrandColorsFromImage(prev => prev.slice(0, -1));
		setColor(initialColor);
	};

	const handleDeletePalette = () => {
		setNewColorArr([]);
		setIsOpenDeletePaletteModal(false);
		setIsCreateNewPalette(false);
	};

	const handleSaveNewPalette = () => {
		if (newColorArr?.length > 3 || newColorArr?.length < 3) {
			getToast('Error', 'The palette should only contain three colours.');
			return;
		}
		if (newColorArr?.length === 0) {
			getToast('Error', 'Choose at least one color.');
			return;
		}
		if (!titlePalette) {
			getToast('Error', 'The palette name must not be empty.');
			setIsEdiTitlePalette(true);
			return;
		}

		const desiredObject = colorsArr.find(obj => obj.palette === titlePalette);
		if (desiredObject) {
			getToast('Error', 'The palette name must be unique.');
			setIsEdiTitlePalette(true);
			return;
		}

		const colorsArray = newColorArr.map(color => color.hex);
		const temp = [
			...colorsArr,
			{ palette: titlePalette, id: crypto.randomUUID(), colors: colorsArray },
		];
		setColorsArr(temp);
		setIsCreateNewPalette(false);
		setNewColorArr([]);
	};

	const handleDeleteUnsavedPalette = () => {
		setNewColorArr([]);
		setIsOpenDeletePaletteModal(false);
		setIsCreateNewPalette(false);
		setTitlePalette('My palette');
	};

	return (
		<Box mt={mt}>
			{isOpenDeletePaletteModal && (
				<DeleteModal
					closeModal={() => setIsOpenDeletePaletteModal(false)}
					deleteHandler={handleDeletePalette}
					title={'Delete palette'}
					text={'Are you sure, that you want to delete this palette?'}
					description={'Once deleted, it cannot be restored'}
				/>
			)}

			<Flex justifyContent={'space-between'} alignItems={'center'} w='100%'>
				<Box>
					<Text color='black' sx={poppins_500_18_27} mt={'4px'}>
						Colour palette
					</Text>

					<Text color={'textColor.gray'} sx={poppins_400_14_21}>
						Choose an existing colour palette or create a new one
					</Text>
				</Box>

				{isCross && <Cross onCrossClick={onCrossClick} />}
			</Flex>

			<Flex
				w={'100%'}
				p={'8px 12px'}
				alignItems={'center'}
				justifyContent={'space-between'}
				borderRadius={'5px'}
				bg={'bg.light'}
				mt={'16px'}
			>
				<Text color='black' sx={poppins_500_16_24}>
					My palette
				</Text>

				<IconButton
					onClick={() => {
						setIsCreateNewPalette(!isCreateNewPalette);
						setIsEdiTitlePalette(true);
					}}
					aria-label='Add palette'
					icon={<AddPaletteIcon />}
				/>
			</Flex>

			<Box
				className={`fadeInDown ${isCreateNewPalette ? 'show' : ''}  ${
					!isCreateNewPalette && 'visually-hidden'
				}`}
				p={'14px 10px 20px 10px'}
				border={'1px solid #D2D2D2'}
				borderRadius={'5px'}
				mt={'8px'}
			>
				<HeaderCard
					setIsOpenDeletePaletteModal={setIsOpenDeletePaletteModal}
					titlePalette={titlePalette}
					setTitlePalette={setTitlePalette}
					isEditTitlePalette={isEditTitlePalette}
					setIsEdiTitlePalette={setIsEdiTitlePalette}
					handleSaveNewPalette={handleSaveNewPalette}
					handleDeleteUnsavedPalette={handleDeleteUnsavedPalette}
				/>

				<ColorCards
					brandColorsFromImage={newColorArr}
					deleteColorFromArrayColors={deleteColorFromArrayColors}
					handleColorChange={handleColorChange}
					handleDeleteLastColor={handleDeleteLastColor}
					setColor={setColor}
					color={color}
				/>
			</Box>

			{colorsArr?.length > 0 &&
				colorsArr?.map(item => {
					return (
						<Flex
							key={item.id}
							w={'100%'}
							p={'8px 12px'}
							alignItems={'center'}
							justifyContent={'space-between'}
							borderRadius={'5px'}
							border={'1px'}
							bg={'bg.light'}
							mt={'4px'}
							cursor={'pointer'}
							borderColor={isPaletteChecked(item, checkedPalette) ? 'bg.red' : 'transparent'}
							onClick={() => {
								handlePaletteSelection(item, checkedPalette);
							}}
						>
							<Text color='black' sx={poppins_500_16_24}>
								{item?.palette || item?.name}
							</Text>

							<UnorderedList display={'flex'} gap={'4px'} flexWrap={'wrap'}>
								{item?.colors?.map((item, i) => {
									return (
										<Tooltip
											key={item}
											label={getAccurateTooltipLabel('color', i)}
											hasArrow
											// label={getFontTitle(index, itemFont)?.length > 17 && getFontTitle(index, itemFont)}
											placement='auto'
											bg='bg.black'
											color='textColor.white'
											fontSize='16px'
											borderRadius={'5px'}
										>
											<ListItem
												key={item}
												listStyleType={'none'}
												w={'40px'}
												h={'40px'}
												border={'1px solid #D2D2D2'}
												borderRadius={'5px'}
												bgColor={item}
											></ListItem>
										</Tooltip>
									);
								})}
							</UnorderedList>
						</Flex>
					);
				})}
		</Box>
	);
};
