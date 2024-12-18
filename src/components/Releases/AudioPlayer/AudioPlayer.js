// import dynamic from 'next/dynamic';
import { Flex, Text } from '@chakra-ui/react';

// const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const AudioPlayer = ({ trackLink }) => {
	return trackLink ? (
		<audio
			controls
			preload='metadata'
			style={{ width: '100%', height: '56px' }}
			controlsList='nodownload noplaybackrate'
		>
			<source src={trackLink} type='audio/mpeg' />
			<source src={trackLink} type='audio/wav' />
			<source src={trackLink} type='audio/flac' />
		</audio>
	) : (
		// <ReactPlayer
		// 	width='100%'
		// 	height='56px'
		// 	url={trackLink}
		// 	controls
		// 	playing={false}
		// 	config={{
		// 		file: { forceVideo: false },
		// 	}}
		// 	preload='metadata'
		// />
		<Flex align='center' w='100%' h='56px'>
			<Text color='secondary'>Preview unavailable</Text>
		</Flex>
	);
};

export default AudioPlayer;
