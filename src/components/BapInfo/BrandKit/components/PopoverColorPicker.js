import {
	Box,
	Flex,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
} from '@chakra-ui/react';

import { ChromePicker } from 'react-color';

import PlusIcon from '@/assets/icons/all/plus.svg';
import TrashIcon from '@/assets/icons/all/trash_2.svg';

import { poppins_400_14_21 } from '@/styles/fontStyles';

export const PopoverColorPicker = ({
	handleColorChange,
	handleDeleteLastColor,
	addColor = false,

	setColor,
	color,
	handleOpenCreateNewPalette,
	handleColorChangeInSavedPalette,
	itemPalette,
}) => {
	const pickerStyles = {
		default: {
			picker: {
				width: '100%',
				padding: '0',
				borderRadius: '0',
				boxShadow: 'none',
				marginTop: '16px',
			},
		},
	};

	return (
		<>
			{!addColor ? (
				<Box cursor={'pointer'} onClick={handleOpenCreateNewPalette}>
					<PlusIcon />
				</Box>
			) : (
				<Popover
					isLazy={true}
					onClose={() => {
						if (itemPalette) {
							handleColorChangeInSavedPalette(itemPalette?.id);
						} else {
							color !== '#abcdef' && handleColorChange();
						}
					}}
				>
					<PopoverTrigger>
						<Flex
							alignItems={'center'}
							justifyContent={'center'}
							border={'1px solid #D2D2D2'}
							borderRadius={'5px'}
							bg={'bg.secondary'}
							h={'50px'}
							w={'50px'}
							cursor={'pointer'}
						>
							<PlusIcon />
						</Flex>
					</PopoverTrigger>
					<PopoverContent
						py={'11px'}
						px={'10px'}
						borderRadius={'5px'}
						boxShadow={'0px 4px 7px 5px rgba(136, 136, 136, 0.1)'}
						border={'none'}
						w={'322px'}
					>
						{/* <PopoverCloseButton /> */}
						<PopoverBody>
							<Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
								<Text color='black' sx={poppins_400_14_21}>
									Choose the color
								</Text>
								<Box cursor={'pointer'} onClick={handleDeleteLastColor}>
									<TrashIcon />
								</Box>
							</Flex>

							<ChromePicker
								onChange={color => {
									setColor(color?.hex);
								}}
								// onChangeComplete={color => handleColorChange(color)}
								color={color}
								styles={pickerStyles}
							/>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			)}
		</>
	);
};
