import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getOrdersRequest from 'src/functions/serverRequests/downloads/getOrdersRequest';
import { audioSelectors } from 'store/audio';
import { setPlaylist } from 'store/audio/audio-slice';
import { downloadsSelectors } from 'store/downloads';
import { resetDownloadsState } from 'store/downloads/downloads-slice';

import { AllTracks } from './components/AllTracks';
import { ArtistAndBands } from './components/ArtistAndBands';
import FullPlayer from './components/FullPlayer';
import { Heading } from './components/Heading';
import { Releases } from './components/Releases';

export const Downloads = () => {
	const dispatch = useDispatch();
	const { user } = useSelector(state => state.user);
	const axiosPrivate = useAxiosPrivate();
	const playMode = useSelector(audioSelectors.getPlayMode);
	const currentRelease = useSelector(downloadsSelectors.getCurrentRelease);
	const currentArtist = useSelector(downloadsSelectors.getCurrentArtist);
	const orders = useSelector(downloadsSelectors.getOrders);

	useEffect(() => {
		const checkCurrent = () => {
			if (currentRelease && !currentArtist) {
				dispatch(setPlaylist(currentRelease?.tracks));
			} else if (currentArtist && !currentRelease) {
				dispatch(setPlaylist(currentArtist?.tracks));
			} else if (!currentRelease && !currentArtist && orders) {
				dispatch(setPlaylist(orders));
			}
		};
		checkCurrent();
	}, [currentArtist, currentRelease, dispatch, orders]);

	useEffect(() => {
		dispatch(resetDownloadsState());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (user?.id) {
			getOrdersRequest(axiosPrivate, dispatch);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, user?.id]);

	return (
		<>
			<Flex flexDir='column' gap='16px' my='16px' px='16px' position='relative'>
				<Heading />
				<Releases />
				<Grid templateColumns='minmax(100px, 1fr)  minmax(150px, 2.01fr)' gap='16px'>
					<GridItem w='100%' borderRadius='20px' bg='bg.main' h='650px'>
						<ArtistAndBands />
					</GridItem>
					<GridItem w='100%' borderRadius='20px' bg='bg.main' h='650px'>
						<AllTracks />
					</GridItem>
				</Grid>
				{playMode === 'playlist' && (
					<Box position='fixed' bottom='0px' left='0' right='0' zIndex={5}>
						<FullPlayer />
					</Box>
				)}
			</Flex>
		</>
	);
};
