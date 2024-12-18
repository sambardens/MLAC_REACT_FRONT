import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';

import Canva from '@/components/Canva/Canva';

import { HeadingComponent } from './HeadingComponent';
import { TextWithArrow } from './TextWithArrow';
import { poppins_400_14_21 } from '@/styles/fontStyles';

export const Logos = ({
	handleButtonClick,
	selectedImageSrc,
	setBapImageSrc,
	setNewDesignId,
	newDesignId,
	isLoadingData,
	isCanEdit,
}) => {
	return (
		<Flex flexDir={'column'}>
			{isCanEdit && (
				<HeadingComponent
					title={'Logos'}
					handleClick={handleButtonClick}
					setBapImageSrc={setBapImageSrc}
					setNewDesignId={setNewDesignId}
				/>
			)}

			{!selectedImageSrc && !isLoadingData && isCanEdit && (
				<TextWithArrow text={'Click the plus sign to add a logo'} />
			)}

			{!isCanEdit && (
				<Text color={'textColor.gray'} sx={poppins_400_14_21} w={'100%'} pb='4px'>
					B.A.P owner or admin can add brand kit logo.
				</Text>
			)}

			{isLoadingData && (
				<Box
					className='animate-pulse'
					w={'100%'}
					h={'150px'}
					mt={'8px'}
					borderRadius={'5px'}
					bg={'bg.secondary'}
				/>
			)}
			{selectedImageSrc && (
				<Box position='relative' mt={'8px'}>
					<Image
						src={selectedImageSrc}
						alt={'img'}
						width={'100%'}
						borderRadius={'5px'}
						objectFit={'cover'}
					/>

					{newDesignId && isCanEdit && (
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
	);
};
