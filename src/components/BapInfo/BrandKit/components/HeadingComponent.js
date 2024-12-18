import {
	Box,
	Flex,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useToast,
} from '@chakra-ui/react';

import { useState } from 'react';

import Canva from '@/components/Canva/Canva';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import PlusIcon from '@/assets/icons/all/plus.svg';
import fromDeviceIcon from '@/assets/icons/base/fromDevice.svg';

import { PopoverColorPicker } from './PopoverColorPicker';
import { PopoverFonts } from './PopoverFonts';
import { poppins_500_16_24 } from '@/styles/fontStyles';

export const HeadingComponent = ({
	title,
	handleClick,
	handleColorChange,
	handleDeleteLastColor,
	setColor,
	color,
	setBapImageSrc = false,
	setNewDesignId = false,
	selectedFont,
	setSelectedFont,
	fontSizeValue,
	setFontSizeValue,
	setBrandKitFonts,
	brandKitFonts,
	handleOpenCreateNewPalette,
}) => {
	const optionsCanvaForSelect = [
		{ id: 1, value: 'Square', label: 'Square' },
		{ id: 2, value: 'Rectangle', label: 'Rectangle' },
	];
	const [isOpen, setIsOpen] = useState(false);
	const [imgType, setImgType] = useState(optionsCanvaForSelect[0].value);

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
	const handleIconClick = () => {
		getToast('error', 'Error', 'You can only add three colours.');
	};

	const closeMenu = () => {
		setIsOpen(false);
	};

	const handleMenuItemSelect = shouldClose => {
		if (shouldClose) {
			closeMenu();
		}
	};
	const imgH = imgType === 'Square' ? 1500 : 1080;
	const imgW = imgType === 'Square' ? 1500 : 1920;

	return (
		<Flex
			px={'12px'}
			py={'16px'}
			alignItems={'center'}
			justifyContent={'space-between'}
			bg={'bg.light'}
			borderRadius={'6px'}
		>
			<Text color='black' sx={poppins_500_16_24}>
				{title}
			</Text>

			{title === 'Logos' ? (
				// <Box cursor={'pointer'} onClick={handleClick}>
				// 	<PlusIcon />
				// </Box>
				<Menu closeOnSelect={true} isOpen={isOpen} onClose={closeMenu} isLazy>
					<MenuButton
						as={IconButton}
						aria-label='Options'
						icon={<PlusIcon />}
						variant=''
						onClick={() => setIsOpen(!isOpen)}
					/>
					<MenuList
						position={'absolute'}
						left={'-90px'}
						border={'none'}
						boxShadow={'0px 4px 7px 5px rgba(136, 136, 136, 0.1)'}
						zIndex={50}
					>
						<Box px={'12px'} zIndex={'100px'}>
							<Text color={'red'} fontSize={'12px'} mb={'3px'}>
								*Choose template for Canva
							</Text>
							<CustomSelect
								name='artwork sizes'
								onChange={({ value }) => {
									setImgType(value);
								}}
								value={imgType}
								options={optionsCanvaForSelect}
								dropdownIconColor='secondary'
								minHeight={'30px'}
								hControl={'30px'}
								pyValueContainer={'1px'}
								mtMenu={'0px'}
								ptMenu={'5px'}
							/>
						</Box>
						<MenuItem onSelect={() => handleMenuItemSelect(false)}>
							<Canva
								setImageSrc={setBapImageSrc}
								w={'202px'}
								h={'55px'}
								textMarginTop={'5px'}
								textMarginLeft={'10px'}
								justify={'space-between'}
								flexDir={'row'}
								title={'Create with Canva'}
								setNewDesignId={setNewDesignId}
								create={true}
								imgW={imgW}
								imgH={imgH}
							/>
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleClick();
								handleMenuItemSelect(true);
							}}
						>
							<Flex
								justify={'space-between'}
								alignItems={'center'}
								width={'202px'}
								height={'55px'}
								p='10px'
								bg='bg.secondary'
								borderRadius='10px'
								cursor='pointer'
							>
								<Icon as={fromDeviceIcon} w='40px' h='40px' />
								<Text textAlign={'center'} fontSize={'14px'} fontWeight={'400'} color={'secondary'}>
									Upload from device
								</Text>
							</Flex>
						</MenuItem>
					</MenuList>
				</Menu>
			) : title === 'Fonts' ? (
				brandKitFonts?.length > 2 ? (
					<Box onClick={handleIconClick}>
						<PlusIcon />
					</Box>
				) : (
					<PopoverFonts
						selectedFont={selectedFont}
						setSelectedFont={setSelectedFont}
						fontSizeValue={fontSizeValue}
						setFontSizeValue={setFontSizeValue}
						setBrandKitFonts={setBrandKitFonts}
					/>
				)
			) : (
				<PopoverColorPicker
					handleColorChange={handleColorChange}
					handleDeleteLastColor={handleDeleteLastColor}
					setColor={setColor}
					color={color}
					handleOpenCreateNewPalette={handleOpenCreateNewPalette}
				/>
			)}
		</Flex>
	);
};
