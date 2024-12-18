import { Box, Flex, Text } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';

import AudioPlayer from '@/components/Releases/AudioPlayer/AudioPlayer';

const TrackCardInModal = ({ track }) => {
	return (
		<Box as='li' p='16px' bg='bg.light' borderRadius='10px' w='100%'>
			<Text fontWeight='400' fontSize='16px' color='black' mb='8px'>
				{track.name}
			</Text>
			<AudioPlayer trackLink={track?.trackFull} />
			{/* <Flex as='ul' flexDir='column' mt='16px' gap='16px'>
				{track?.splitUsers.map(el => (
					<Flex key={nanoid()} align='center'>
						<Text fontWeight='500' fontSize='16px' color='black' mr='8px'>
							{el.firstName ? (
								`${el.firstName} ${el.lastName}`
							) : (
								<>
									{el.email}
									<Text as='span' fontWeight={400} color='secondary'>
										(pending)
									</Text>
								</>
							)}
						</Text>
						<Text fontWeight='400' fontSize='16px' color='secondary'>
							{el.credits.length === 0
								? 'No credit'
								: el.credits.map(el => el.value).join(', ')}
						</Text>
					</Flex>
				))}
			</Flex> */}
		</Box>
	);
};

export default TrackCardInModal;
