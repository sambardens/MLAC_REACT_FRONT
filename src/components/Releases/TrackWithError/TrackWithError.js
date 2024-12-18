import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import warningIcon from '@/assets/icons/base/warning.svg';
import TrashIcon from '@/assets/icons/modal/trash.svg';

const TrackWithError = ({ track, handleDeleteTrackWithError }) => {
	return (
		<Box borderRadius='10px' bgColor='bg.light' p='16px 8px'>
			<Flex align='center' justify='space-between'>
				<Flex align='center'>
					<Icon as={warningIcon} mr='8px' boxSize='24px' color='accent' />
					<Text fontSize='14px' fontWeight='500' color='accent' lineHeight='1'>
						{track.error}
					</Text>
				</Flex>

				<Flex
					as='button'
					onClick={handleDeleteTrackWithError}
					w='40px'
					py='8px'
					color='secondary'
					_hover={{ color: 'accent' }}
					transition='0.3s linear'
					aria-label={`Delete track ${track?.name}`}
					align='center'
					justify='center'
				>
					<Icon as={TrashIcon} boxSize='24px' />
				</Flex>
			</Flex>
			<Text fontSize='12px' fontWeight='400' color='accent' lineHeight='1'>
				Track will be automatically deleted after switching to another page or you can delete it now
			</Text>
			<Text fontSize='16px' fontWeight='400' color='black' mt='8px'>
				{track.name}
			</Text>
		</Box>
	);
};

export default TrackWithError;
