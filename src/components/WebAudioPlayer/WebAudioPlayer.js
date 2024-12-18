import { Box, Text } from '@chakra-ui/react';

import { useRef, useState } from 'react';
import { useEffect } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentIndex } from 'store/audio/audio-slice';

import NextTrackIcon from '@/assets/icons/shop/next_track.svg';
import PauseIcon from '@/assets/icons/shop/pause.svg';
// import PlayIcon from '@/assets/icons/shop/play.svg';
import PrevTrackIcon from '@/assets/icons/shop/prev_track.svg';

import PlayIcon from '../Icons/PlayIcon/PlayIcon';

const WebAudioPlayer = ({
	tracks,
	color = 'white',
	textColor = '#282727',
	fontStyle = 'initial',
	isFullTrack = false,
	textMaxW = null,
}) => {
	const { currentIndex, isPlayAllTracks } = useSelector(state => state.audio);
	const dispatch = useDispatch();
	const audioPlayer = useRef();
	const [isTrackLoaded, setIsTrackLoaded] = useState(false);
	const [forceUpdate, setForceUpdate] = useState(false);

	const onPause = () => {
		audioPlayer?.current?.audio?.current.pause();
	};

	const onPlay = () => {
		audioPlayer?.current?.audio?.current.play();
	};

	useEffect(() => {
		if (isPlayAllTracks && isTrackLoaded) {
			onPlay();
		} else {
			onPause();
		}
	}, [isPlayAllTracks, isTrackLoaded]);

	const handleLoadedMetaData = () => {
		setIsTrackLoaded(true);
	};

	const handleClickPrevious = () => {
		const newIndex = currentIndex === 0 ? tracks?.length - 1 : currentIndex - 1;
		dispatch(setCurrentIndex(newIndex));
	};

	const handleClickNext = () => {
		const newIndex = currentIndex === tracks.length - 1 ? 0 : currentIndex + 1;
		dispatch(setCurrentIndex(newIndex));
	};

	useEffect(() => {
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			audioPlayer?.current?.audio?.current?.pause();
			dispatch(setCurrentIndex(0));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const src = isFullTrack ? tracks[currentIndex]?.trackFull : tracks[currentIndex]?.trackPreview;
	return (
		<Box bgColor='transparent' w='100%' data-id='webpage' pl='64px' pos='relative' mb='24px' mt='6px'>
			<Text
				fontSize='16px'
				fontWeight={500}
				color={textColor}
				mb='4px'
				fontStyle={fontStyle}
				maxW={textMaxW}
			>
				{tracks[currentIndex]?.name}
			</Text>
			<AudioPlayer
				// key={forceUpdate}
				onPlayError={error => console.log(error)}
				onLoadedMetaData={handleLoadedMetaData}
				onPlay={onPlay}
				onPause={onPause}
				onEnded={handleClickNext}
				loop={true}
				ref={audioPlayer}
				src={src}
				preload='metadata'
				autoPlay={false}
				onClickPrevious={handleClickPrevious}
				onClickNext={handleClickNext}
				showSkipControls={true}
				showJumpControls={false}
				showDownloadProgress={false}
				style={{
					backgroundColor: 'transparent',
					width: '100%',
					height: '18px',
					padding: '0px',
					borderColor: 'transparent',
				}}
				customIcons={{
					play: <PlayIcon fill={color} color={textColor} />,
					pause: <PauseIcon fill={color} />,
					previous: <PrevTrackIcon fill={color} />,
					next: <NextTrackIcon fill={color} />,
				}}
				customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
				customProgressBarSection={[
					RHAP_UI.PROGRESS_BAR,
					RHAP_UI.CURRENT_TIME,

					<div key='line' style={{ color: '#909090', fontSize: '12px' }}>
						/
					</div>,
					RHAP_UI.DURATION,
				]}
				volume={0.5}
			/>
		</Box>
	);
};

export default WebAudioPlayer;
