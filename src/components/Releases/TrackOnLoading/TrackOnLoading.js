import { Box, CircularProgress, Flex, Icon, Text } from '@chakra-ui/react';

import UploadTrackIcon from '@/assets/icons/releases-contracts/upload-track.svg';

const TrackOnLoading = ({ track }) => {
	return (
		<Box borderRadius='10px' bgColor='bg.light' p='16px 8px'>
			<Text fontSize='16px' fontWeight='400' color='black' mb='20px'>
				{track.trackName}
			</Text>
			<Flex align='center' mb='8px'>
				{track.progress !== 100 ? (
					<Icon as={UploadTrackIcon} boxSize='24px' color='stroke' />
				) : (
					<CircularProgress
						isIndeterminate
						color='accent'
						thickness='12px'
						size='24px'
						min={50}
						max={50}
					/>
				)}
				<Box ml='16px' h='8px' bgColor='bg.secondary' w='100%' borderRadius='20px' overflow='hidden'>
					<Box bgColor='accent' h='100%' w={`${track.progress}%`}></Box>
				</Box>
			</Flex>
			<Text ml='48px' fontSize='14px' fontWeight='400' color='accent'>
				{track.progress !== 100
					? 'We are uploading and checking for copyright. Please wait, this may take a couple of minutes.'
					: 'Сopyright and track preview are in progress, this may take a couple of minutes.'}
			</Text>
		</Box>
	);
};

export default TrackOnLoading;
