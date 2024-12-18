import { IconButton } from '@chakra-ui/react';

import React, { useEffect, useRef, useState } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import { downloadOneTrack } from 'src/functions/serverRequests/downloads/getTracksToDownLoad';
import { audioSelectors } from 'store/audio';
import {
	pauseAllTracks,
	setCurrentTrack,
	setFullPlayerCurrentTrack,
	startPlayAllTracks,
} from 'store/audio/audio-slice';

import DownloadIcon from '@/assets/icons/base/download.svg';
import LoopIcon from '@/assets/icons/downloads/loop.svg';
import NextTrackIcon from '@/assets/icons/downloads/next_track.svg';
import PauseIcon from '@/assets/icons/downloads/pause.svg';
import PlayIcon from '@/assets/icons/downloads/play.svg';
import PrevTrackIcon from '@/assets/icons/downloads/prev_track.svg';
import RandomPlayIcon from '@/assets/icons/downloads/random_play.svg';

import { PhotoCard } from './PhotoCard';

const FullPlayer = () => {
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const audioPlayer = useRef();
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
	const [isLoop, setIsLoop] = useState(false);
	const [isRandom, setIsRandom] = useState(false);
	const [playList, setPlaylist] = useState(null);

	const fullPlayerCurrentTrack = useSelector(audioSelectors.getFullPlayerCurrentTrack);
	const isPlayingAllTracks = useSelector(audioSelectors.getIsPlayAllTracks);
	const currentPlaylist = useSelector(audioSelectors.gatCurrentPlaylist);

	useEffect(() => {
		setPlaylist(currentPlaylist);
		return () => {
			setPlaylist(null);
		};
	}, [currentPlaylist]);

	const handleClickPrevious = autoNext => {
		if (isLoop && !autoNext) {
			setIsLoop(false);
		}
		setCurrentTrackIndex(prevIndex => {
			const newIndex = prevIndex === 0 ? playList?.length - 1 : prevIndex - 1;
			dispatch(setFullPlayerCurrentTrack(playList[newIndex]));
			return newIndex;
		});
	};

	const handleClickNext = autoNext => {
		if (isLoop && autoNext) {
			dispatch(startPlayAllTracks());
			return;
		}
		if (isLoop && !autoNext) {
			setIsLoop(false);
		}
		setCurrentTrackIndex(prevIndex => {
			const newIndex = prevIndex < playList.length - 1 ? prevIndex + 1 : 0;
			if (playList.length > 0) {
				dispatch(setFullPlayerCurrentTrack(playList[newIndex]));
			}
			return newIndex;
		});
	};

	const shuffleArray = () => {
		setIsRandom(true);
		const shuffledArray = [...playList];
		for (let i = playList.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
		}
		setPlaylist(shuffledArray);
	};

	const sortedArray = () => {
		setIsRandom(false);
		const sortedArray = [...playList];
		sortedArray.sort((a, b) => {
			return parseInt(a.ID) - parseInt(b.ID);
		});
		setPlaylist(sortedArray);
	};

	useEffect(() => {
		if (isPlayingAllTracks) {
			audioPlayer?.current?.audio?.current.play();
		} else {
			audioPlayer?.current?.audio?.current.pause();
		}
	}, [isPlayingAllTracks]);

	const handlePlay = () => {
		dispatch(startPlayAllTracks());
	};
	return (
		<AudioPlayer
			onPlaying={handlePlay}
			onPause={() => {
				dispatch(pauseAllTracks());
			}}
			onPlayError={error => console.log(error)}
			autoPlayAfterSrcChange={true}
			loop={isLoop}
			ref={audioPlayer}
			src={fullPlayerCurrentTrack?.src}
			onEnded={() => handleClickNext(true)}
			onClickPrevious={() => handleClickPrevious(false)}
			onClickNext={() => handleClickNext(false)}
			showSkipControls={true}
			showJumpControls={false}
			showFilledVolume={true}
			style={{
				backgroundColor: '#fff',
				width: '100%',
			}}
			customIcons={{
				play: <PlayIcon />,
				pause: <PauseIcon />,
				previous: <PrevTrackIcon />,
				next: <NextTrackIcon />,
				loopOff: <LoopIcon />,
			}}
			customControlsSection={[
				RHAP_UI.ADDITIONAL_CONTROLS,
				<IconButton
					key={'randomPlay'}
					mr={'16px'}
					size='xs'
					h='40px'
					icon={<RandomPlayIcon />}
					onClick={() => {
						isRandom ? sortedArray() : shuffleArray();
					}}
					color={isRandom ? 'accent' : 'secondary'}
					aria-label={isRandom ? 'Remove loop track' : 'Loop track'}
				/>,
				RHAP_UI.MAIN_CONTROLS,
				<IconButton
					key='loop'
					ml='16px'
					size='xs'
					h='40px'
					icon={<LoopIcon />}
					onClick={() => {
						setIsLoop(prev => !prev);
					}}
					color={isLoop ? 'accent' : 'secondary'}
					aria-label={isLoop ? 'Remove loop track' : 'Loop track'}
				/>,
				RHAP_UI.VOLUME_CONTROLS,
			]}
			customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
			volume={0.5}
			customVolumeControls={[
				RHAP_UI.VOLUME,
				<IconButton
					ml='20px'
					size='xs'
					icon={<DownloadIcon />}
					key={'volumeControls'}
					onClick={() =>
						downloadOneTrack({
							trackData: {
								id: fullPlayerCurrentTrack.trackId,
								name: fullPlayerCurrentTrack.trackName,
							},
							isFree: false,
							axiosPrivate,
							bapId: 0,
						})
					}
					color='secondary'
					aria-label={`download track ${fullPlayerCurrentTrack?.trackName}`}
					_hover={{ color: 'accent' }}
					transition='0.3s linear'
				/>,
			]}
			customAdditionalControls={[<PhotoCard key={'photoCard'} />]}
		/>
	);
};

export default FullPlayer;
