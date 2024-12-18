import { Box, Flex, Image, ListItem, Text, Tooltip, UnorderedList } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import {
	downloadListOfTracks,
	downloadOneTrack,
} from 'src/functions/serverRequests/downloads/getTracksToDownLoad';
import { setCurrentTrack, setPlayMode, startPlaySingleTrack } from 'store/audio/audio-slice';
import { downloadsSelectors } from 'store/downloads';

import CustomInput from '@/components/CustomInputs/CustomInput';
import RingLoader from '@/components/Loaders/RingLoader';

import DownloadIcon from '@/assets/icons/base/download.svg';
import SearchIcon from '@/assets/icons/base/search.svg';

import BasePlayer from './BasePlayer';
import AllTracksSkeleton from './skeletons/AllTracksSkeleton';
import {
	poppins_400_14_21,
	poppins_400_16_24,
	poppins_500_18_27,
	poppins_600_32_48,
} from '@/styles/fontStyles';

export const AllTracks = () => {
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const [downloadTrackId, setDownloadTrackId] = useState(null);
	const [isDownloadingTracks, setIsDownloadingTracks] = useState(false);
	const [musicData, setMusicData] = useState(null);
	const [searchValue, setSearchValue] = useState('');
	const currentRelease = useSelector(downloadsSelectors.getCurrentRelease);
	const currentArtist = useSelector(downloadsSelectors.getCurrentArtist);
	const orders = useSelector(downloadsSelectors.getOrders);
	const isLoadingData = useSelector(downloadsSelectors.getIsLoading);

	useEffect(() => {
		if (currentRelease) {
			setMusicData(currentRelease?.tracks);
		} else if (currentArtist) {
			setMusicData(currentArtist?.tracks);
		} else if (!currentRelease && !currentArtist) {
			setMusicData(orders);
		}
		setSearchValue('');
	}, [currentArtist, currentRelease, orders]);

	const handlePlay = itemTrack => {
		dispatch(setPlayMode(''));
		dispatch(startPlaySingleTrack());
		dispatch(setCurrentTrack(itemTrack));
	};

	const handleOnError = e => {
		e.target.src = '/assets/images/mockImg/rectangle_3.jpg';
	};

	const handleDownloadTrack = async trackData => {
		setDownloadTrackId(trackData.id);
		await downloadOneTrack({ trackData, isFree: false, axiosPrivate, bapId: 0 });
		setDownloadTrackId(null);
	};

	const handleChange = e => {
		setSearchValue(e.target.value);
	};
	const normalizedFilterValue = searchValue?.toLowerCase().trim();
	const tracks = normalizedFilterValue
		? musicData?.filter(track => track.trackName.toLowerCase().includes(normalizedFilterValue))
		: musicData;
	const additionalInfo = currentRelease?.name || currentArtist?.artistName;

	const handleDownloadAllTrack = async () => {
		const tracksData = tracks.map(el => ({ id: el.trackId, name: el.trackName }));
		const fullName = currentRelease ? `${currentRelease?.band} - ${currentRelease?.name}` : 'tracks';
		const folderName = currentArtist?.artistName || fullName;
		const artwork = currentArtist?.artwork || currentRelease?.artwork || '';

		const artworkName = currentArtist?.artistName || currentRelease?.name;
		setIsDownloadingTracks(true);
		await downloadListOfTracks({
			tracks: tracksData,
			axiosPrivate,
			folderName,
			artwork,
			artworkName,
			bapId: 0,
		});
		setIsDownloadingTracks(false);
	};

	return (
		<Box as='section' p='24px' h='100%'>
			<Flex justify='space-between' mb='24px'>
				<Flex pos='relative' mr='16px' w='100%' align='center'>
					<Text sx={poppins_600_32_48} color='black'>
						All tracks
					</Text>
					{additionalInfo && (
						<Text sx={poppins_500_18_27} color='accent' pos='absolute' top='48px'>
							{additionalInfo}
						</Text>
					)}
					{isDownloadingTracks && (
						<Flex h='40px' align='center' justify='center' ml='16px'>
							<RingLoader w='24px' h='24px' />
						</Flex>
					)}
					{tracks?.length > 0 && !isDownloadingTracks && (
						<Flex
							as='button'
							align='center'
							onClick={handleDownloadAllTrack}
							// minW='115px'
							color='black'
							aria-label='download selected tracks'
							_hover={{ color: 'accent' }}
							transition='0.3s linear'
							ml='16px'
						>
							<DownloadIcon />
						</Flex>
					)}
				</Flex>
				<CustomInput
					icon={SearchIcon}
					maxW='350px'
					placeholder='Search'
					value={searchValue}
					onChange={handleChange}
					name='searchValue'
				/>
			</Flex>

			{isLoadingData && <AllTracksSkeleton />}

			<UnorderedList
				margin={'0px'}
				w='100%'
				h='calc(100% - 80px)'
				overflowY='scroll'
				display='flex'
				flexDir='column'
				gap='8px'
			>
				{tracks?.length > 0 &&
					tracks?.map(itemTrack => {
						return (
							<ListItem
								key={itemTrack.trackId}
								p={'8px'}
								listStyleType={'none'}
								w='calc(100% - 5px)'
								pos='relative'
								data-id='single-track'
								pl='60px'
							>
								<Flex align={'center'}>
									<Image
										borderRadius={'10px'}
										w={'82px'}
										h={'82px'}
										src={itemTrack?.trackLogo}
										alt={'img'}
										onError={handleOnError}
									/>
									<Flex flexDir={'column'} ml='16px' w='calc(100% - 98px)'>
										<Flex align={'center'} justify={'space-between'}>
											<Tooltip
												hasArrow
												label={itemTrack?.trackName?.length > 38 && itemTrack?.trackName}
												placement='auto'
												bg='bg.black'
												color='textColor.white'
												fontSize='16px'
												borderRadius={'5px'}
											>
												<Text
													maxW='calc(100% - 123px)'
													overflow={'hidden'}
													textOverflow={'ellipsis'}
													whiteSpace='nowrap'
													sx={poppins_500_18_27}
													color={'black'}
												>
													{itemTrack?.trackName}
												</Text>
											</Tooltip>
											{downloadTrackId === itemTrack.trackId ? (
												<Flex align='center' justify='center' color='secondary'>
													<RingLoader w='24px' h='24px' />
													<Text sx={poppins_400_16_24} ml='13px' w='77px' textAlign='center'>
														Loading
													</Text>
												</Flex>
											) : (
												<Flex
													as='button'
													align='center'
													onClick={() =>
														handleDownloadTrack({ id: itemTrack.trackId, name: itemTrack.trackName })
													}
													minW='115px'
													color='secondary'
													aria-label={`download track ${itemTrack.trackName}`}
													_hover={{ color: 'accent' }}
													transition='0.3s linear'
													ml='8px'
												>
													<DownloadIcon />
													<Text sx={poppins_400_16_24} ml='12px'>
														Download
													</Text>
												</Flex>
											)}
										</Flex>
										<Tooltip
											hasArrow
											label={itemTrack?.artistName?.length > 38 && itemTrack?.artistName}
											placement='auto'
											bg='bg.black'
											color='textColor.white'
											fontSize='16px'
											borderRadius={'5px'}
										>
											<Text
												sx={poppins_400_14_21}
												color={'textColor.gray'}
												mt={'8px'}
												maxW='calc(100% - 123px)'
												overflow={'hidden'}
												textOverflow={'ellipsis'}
												whiteSpace='nowrap'
											>
												{itemTrack?.artistName}
											</Text>
										</Tooltip>

										<Box mt='4px'>
											<BasePlayer itemTrack={itemTrack} handlePlay={handlePlay} />
										</Box>
									</Flex>
								</Flex>
							</ListItem>
						);
					})}
			</UnorderedList>
		</Box>
	);
};
