import { Box, Flex, ListItem, UnorderedList } from '@chakra-ui/react';

import DeleteColorIcon from '@/assets/icons/all/delete-brand-color.svg';

import { PopoverColorPicker } from './PopoverColorPicker';

export const ColorCards = ({
	brandColorsFromImage,
	deleteColorFromArrayColors,
	handleColorChange,
	handleDeleteLastColor,
	setColor,
	color,
	removeColorFromItemPalette = false,
	itemPalette = false,
	handleColorChangeInSavedPalette = false,
	isCanEdit = true,
	isCanAddNew = true,
}) => {
	return (
		<UnorderedList m={'0'} mt={'33px'} display={'flex'} gap={'5px'} flexWrap={'wrap'}>
			{brandColorsFromImage?.map(itemColor => {
				return (
					<ListItem key={itemColor?.id} listStyleType={'none'} bg={itemColor?.hex} border={'1px '} borderColor={'brand.lightGray'} borderRadius={'5px'} h={'50px'} w={'50px'} position={'relative'}>
						{isCanEdit && (
							<Box
								position={'absolute'}
								top={0}
								right={0}
								cursor={'pointer'}
								onClick={() => {
									itemPalette ? removeColorFromItemPalette(itemColor?.hex, itemPalette?.id) : deleteColorFromArrayColors(itemColor?.id);
								}}
							>
								<DeleteColorIcon />
							</Box>
						)}
					</ListItem>
				);
			})}
			{isCanAddNew && isCanEdit && (
				<PopoverColorPicker
					addColor={true}
					handleColorChange={handleColorChange}
					handleDeleteLastColor={handleDeleteLastColor}
					setColor={setColor}
					color={color}
					handleColorChangeInSavedPalette={handleColorChangeInSavedPalette}
					itemPalette={itemPalette}
				/>
			)}
		</UnorderedList>
	);
};
