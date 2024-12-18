import { Box, IconButton, Text } from '@chakra-ui/react';

import AudioPlayer from '@/components/Releases/AudioPlayer/AudioPlayer';

import CloseIcon from '@/assets/icons/base/close.svg';

const SplitTrack = ({ track, onClick }) => {
	const handleAddTrackToSplit = () => {
		if (!track.selected) {
			onClick();
		}
	};
	85;
	return (
		<>
			<Box
				w='calc(100% - 48px)'
				borderRadius='10px'
				bg='bg.light'
				p='12px'
				onClick={handleAddTrackToSplit}
				cursor={!track.selected ? 'pointer' : 'auto'}
				border='1px solid'
				borderColor={track.selected ? 'accent' : 'transparent'}
			>
				<Text fontSize='16px' fontWeight='400' mb='8px'>
					{track.name}
				</Text>
				<AudioPlayer trackLink={track.trackFull} />
			</Box>

			{track.selected && (
				<IconButton
					ml='8px'
					h='24px'
					w='24px'
					aria-label={`Unselect track ${track.name} `}
					icon={<CloseIcon />}
					color='stroke'
					_hover={{ color: 'accent' }}
					onClick={onClick}
					transition='0.3s linear'
				/>
			)}
		</>
	);
};

export default SplitTrack;
