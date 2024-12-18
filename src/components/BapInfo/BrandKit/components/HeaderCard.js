import { Box, Flex, Input, Text, Tooltip } from '@chakra-ui/react';

import { useState } from 'react';

import CheckIcon from '@/assets/icons/all/check.svg';
import DeleteIcon from '@/assets/icons/all/delete.svg';

import { poppins_500_16_24 } from '@/styles/fontStyles';

export const HeaderCard = ({
	handleDeleteUnsavedPalette,
	titlePalette,
	setTitlePalette,
	handleSaveNewPalette,
	isEditTitlePalette,
	setIsEdiTitlePalette,
	isCanEdit,
}) => {
	return (
		<Flex alignItems={'center'} justifyContent={'space-between'}>
			{isEditTitlePalette ? (
				<Input
					variant={'unstyled'}
					minW={'200px'}
					maxWidth={'220px'}
					flexGrow={'1'}
					sx={poppins_500_16_24}
					color='black'
					borderBottom={'2px'}
					borderRadius={'0px'}
					height={'22px'}
					borderColor={'secondary'}
					autoFocus={isEditTitlePalette}
					// disabled={isLoadingName}
					onBlur={() => setIsEdiTitlePalette(false)}
					value={titlePalette}
					onChange={e => {
						setTitlePalette(e.target.value);
					}}
				/>
			) : (
				<Box width={'200px'} h={'18px'} onClick={() => setIsEdiTitlePalette(!isEditTitlePalette)}>
					<Tooltip
						hasArrow
						label={titlePalette?.length > 20 && titlePalette}
						placement='auto'
						bg='bg.black'
						color='textColor.white'
						fontSize='16px'
						borderRadius={'5px'}
					>
						<Text
							maxWidth={'220px'}
							color='black'
							sx={poppins_500_16_24}
							overflow={'hidden'}
							textOverflow={'ellipsis'}
							whiteSpace='nowrap'
						>
							{titlePalette}
						</Text>
					</Tooltip>
				</Box>
			)}
			<Flex alignItems={'center'}>
				<Box
					cursor={'pointer'}
					onClick={() => {
						handleSaveNewPalette && handleSaveNewPalette();
					}}
				>
					<CheckIcon />
				</Box>
				<Box cursor={'pointer'} ml={'10px'} onClick={() => handleDeleteUnsavedPalette()}>
					<DeleteIcon />
				</Box>
			</Flex>
		</Flex>
	);
};
