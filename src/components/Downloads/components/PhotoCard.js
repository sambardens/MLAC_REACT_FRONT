import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import { audioSelectors } from 'store/audio';

import { poppins_400_14_21, poppins_500_18_27 } from '@/styles/fontStyles';

export const PhotoCard = () => {
	const fullPlayerCurrentTrack = useSelector(audioSelectors.getFullPlayerCurrentTrack);

	const handleOnError = e => {
		e.target.src = '/assets/images/mockImg/rectangle_3.jpg';
	};

	// console.log(fullPlayerCurrentTrack, 'fullPlayerCurrentTrack');

	return (
		<Flex alignItems={'center'} w={'312px'} h={'56px'}>
			<Image
				borderRadius={'10px'}
				w={'56px'}
				h={'56px'}
				src={fullPlayerCurrentTrack?.trackLogo}
				alt={'img'}
				onError={e => handleOnError(e)}
			/>
			<Box ml={'16px'}>
				<Tooltip
					hasArrow
					label={fullPlayerCurrentTrack?.trackName?.length > 38 && fullPlayerCurrentTrack?.trackName}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						sx={poppins_500_18_27}
						color={'textColor.black'}
						width={'400px'}
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
					>
						{fullPlayerCurrentTrack?.trackName}
					</Text>
				</Tooltip>
				<Tooltip
					hasArrow
					label={fullPlayerCurrentTrack?.artistName?.length > 38 && fullPlayerCurrentTrack?.artistName}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						mt={'8px'}
						sx={poppins_400_14_21}
						color={'textColor.gray'}
						width={'400px'}
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
					>
						{fullPlayerCurrentTrack?.artistName}
					</Text>
				</Tooltip>
			</Box>
		</Flex>
	);
};
