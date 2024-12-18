import {
	Box,
	Flex,
	Heading,
	IconButton,
	ListItem,
	Text,
	UnorderedList,
	useToast,
} from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';
import transformPaletteToDesignObj from 'src/functions/utils/web-pages/landing/transformPaletteToDesignObj';

import { ColorCards } from '@/components/BapInfo/BrandKit/components/ColorCards';
import { HeaderCard } from '@/components/BapInfo/BrandKit/components/HeaderCard';
import DeleteModal from '@/components/Modals/DeleteModal';

import AddPaletteIcon from '@/assets/icons/all/addPalette.svg';

import { poppins_400_14_21, poppins_500_16_24, poppins_500_18_27 } from '@/styles/fontStyles';

const initialColor = '#abcdef';

const LandingPalette = ({ mt, selectedDesign, setSelectedDesign, setPaletteArr, paletteArr }) => {
	const [isOpenDeletePaletteModal, setIsOpenDeletePaletteModal] = useState(false);
	const [newColorArr, setNewColorArr] = useState([]);
	const [color, setColor] = useState(initialColor);
	const [isCreateNewPalette, setIsCreateNewPalette] = useState(false);
	const [titlePalette, setTitlePalette] = useState('My palette');
	const [isEditTitlePalette, setIsEdiTitlePalette] = useState(false);
	const toast = useToast();

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
			setNewColorArr(prev => [...prev, { hex: color, id: nanoid() }]);
		} else {
			setNewColorArr([{ hex: color, id: nanoid() }]);
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
		setColor(initialColor);
	};

	const handleDeletePalette = () => {
		setNewColorArr([]);
		setIsOpenDeletePaletteModal(false);
		setIsCreateNewPalette(false);
	};

	const handleSaveNewPalette = () => {
		if (newColorArr?.length < 3) {
			getToast('Error', 'Please choose three colours to save.');
			return;
		}
		if (!titlePalette) {
			getToast('Error', 'The palette name must not be empty.');
			setIsEdiTitlePalette(true);
			return;
		}

		const desiredObject = paletteArr.find(obj => obj.paletteName === titlePalette);
		if (desiredObject) {
			getToast('Error', 'The palette name must be unique.');
			setIsEdiTitlePalette(true);
			return;
		}
		const temp = [...paletteArr, { paletteName: titlePalette, id: nanoid(), colors: newColorArr }];
		setPaletteArr(temp);
		setIsCreateNewPalette(false);
		setNewColorArr([]);
	};

	const handleDeleteUnsavedPalette = () => {
		setNewColorArr([]);
		setIsOpenDeletePaletteModal(false);
		setIsCreateNewPalette(false);
		setTitlePalette('My palette');
	};

	const handleSelectPalette = item => {
		setSelectedDesign(prev => transformPaletteToDesignObj(item, prev));
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

			<Box mb='16px'>
				<Heading as='h3' mb='4px' fontSize='18px' fontWeight='500'>
					Colour palette
				</Heading>
				<Text fontSize='14px' fontWeight='400' color='secondary' mb='16px'>
					Choose an existing colour palette or create a new one
				</Text>
			</Box>

			<Flex
				w='100%'
				p='8px 12px'
				align='center'
				justify='space-between'
				borderRadius='5px'
				bg='bg.light'
			>
				<Text fontSize='16px' fontWeight='500' color='black'>
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
					isCanAddNew={newColorArr?.length < 3}
				/>
			</Box>

			{paletteArr?.length > 0 &&
				paletteArr?.map(item => {
					return (
						<Flex
							key={item.id}
							w={'100%'}
							p={'8px 12px'}
							align={'center'}
							justify={'space-between'}
							borderRadius={'5px'}
							border={'1px'}
							bg={'bg.light'}
							mt={'4px'}
							cursor={'pointer'}
							borderColor={item?.id === selectedDesign?.id ? 'accent' : 'transparent'}
							onClick={() => {
								handleSelectPalette(item);
							}}
						>
							<Text color={'textColor.black'} sx={poppins_500_16_24}>
								{item?.paletteName}
							</Text>

							<UnorderedList display={'flex'} gap={'4px'} flexWrap={'wrap'}>
								{item?.colors?.map(color => {
									return (
										<ListItem
											key={color.id}
											listStyleType={'none'}
											w={'40px'}
											h={'40px'}
											border={'1px solid #D2D2D2'}
											borderRadius={'5px'}
											bgColor={color.hex}
										/>
									);
								})}
							</UnorderedList>
						</Flex>
					);
				})}
		</Box>
	);
};

export default LandingPalette;
