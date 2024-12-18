import { Box, Button, Flex, Text, Tooltip } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { audioSelectors } from 'store/audio';
import {
	pauseAllTracks,
	pauseSingleTrack,
	setFullPlayerCurrentTrack,
	setPlayMode,
	startPlayAllTracks,
} from 'store/audio/audio-slice';
import { downloadsSelectors } from 'store/downloads';

import PlayAlIcon from '@/assets/icons/downloads/playAll.svg';

import { poppins_500_16_24, poppins_500_18_27, poppins_600_64_96 } from '@/styles/fontStyles';

export const Heading = () => {
	const dispatch = useDispatch();
	const playMode = useSelector(audioSelectors.getPlayMode);
	const currentPlaylist = useSelector(audioSelectors.gatCurrentPlaylist);
	const user = useSelector(state => state.user.user);
	const currentRelease = useSelector(downloadsSelectors.getCurrentRelease);
	const currentArtist = useSelector(downloadsSelectors.getCurrentArtist);
	const orders = useSelector(downloadsSelectors.getOrders);

	const handleClickAllTracks = () => {
		if (currentPlaylist?.length > 0) {
			if (playMode === 'playlist') {
				dispatch(setPlayMode(''));
				dispatch(setFullPlayerCurrentTrack(null));
				dispatch(pauseAllTracks());
			} else {
				dispatch(pauseSingleTrack());
				dispatch(setPlayMode('playlist'));
				dispatch(startPlayAllTracks());
				dispatch(setFullPlayerCurrentTrack(currentPlaylist[0]));
			}
		}
	};

	const capitalizedStr = str => {
		return str?.charAt(0).toUpperCase() + str?.slice(1);
	};

	const checkCurrent = () => {
		if (currentRelease && !currentArtist) {
			return (
				<Flex>
					In release&nbsp;
					<Box as='span' color={'textColor.red'}>
						{currentRelease?.name}
					</Box>
					,&nbsp;you have&nbsp;
					{currentRelease?.tracks?.length} songs
				</Flex>
			);
		} else if (currentArtist && !currentRelease) {
			return (
				<Flex>
					In B.A.P.&nbsp;
					<Box as='span' color={'textColor.red'}>
						{currentArtist?.artistName}
					</Box>
					,&nbsp;you have&nbsp;
					{currentArtist?.tracks?.length} songs
				</Flex>
			);
		} else if (!currentArtist && !currentRelease && orders)
			return `You have ${currentPlaylist?.length} songs`;
	};

	return (
		<Flex
			alignItems={'center'}
			justifyContent={'space-between'}
			background={
				'linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/images/mockImg/userAccBg.jpg) center center  no-repeat'
			}
			backgroundSize={'cover'}
			w={'100%'}
			h={'200px'}
			borderRadius={'20px'}
			px={'24px'}
			py={'34.5px'}
		>
			<Flex flexDirection={'column'} gap={'8px'}>
				<Tooltip
					hasArrow
					label={
						(user?.firstName + user?.lastName)?.length > 16 && user?.firstName + ' ' + user?.lastName
					}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Box
						as={'h1'}
						sx={poppins_600_64_96}
						color={'white'}
						width={'700px'}
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
					>
						{capitalizedStr(user?.firstName)} {capitalizedStr(user?.lastName)}
					</Box>
				</Tooltip>

				<Box sx={poppins_500_18_27} color={'white'}>
					{/* You have {currentPlaylist?.length} songs */}
					{checkCurrent()}
				</Box>
			</Flex>
			<Button
				variant={'unstyled'}
				w={'154px'}
				h={'56px'}
				p={'8px'}
				bg={'bg.main'}
				borderRadius={'51px'}
				bgColor={playMode === 'playlist' ? 'bg.pink' : 'white'}
			>
				<Flex justifyContent={'end'} onClick={handleClickAllTracks}>
					<Flex alignItems={'center'} gap={'24px'}>
						<Text sx={poppins_500_16_24} color={'texColor.black'}>
							Play all
						</Text>
						<PlayAlIcon />
					</Flex>
				</Flex>
			</Button>
		</Flex>
	);
};
