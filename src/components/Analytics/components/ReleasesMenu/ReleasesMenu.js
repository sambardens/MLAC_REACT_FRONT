import { Box, Flex, Text } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getTracksToReleaseShop from 'src/functions/serverRequests/shop/releases/getTracksToReleaseShop';
import { setSelectedBap } from 'store/slice';

import Item from './components/Item';
import ReleaseCard from './components/ReleaseCard';
import TrackCard from './components/TrackCard';

const ReleasesMenu = ({ setIsReleasesModal }) => {
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const selectedBap = useSelector(state => state.user.selectedBap);
	const selectedRelease = useSelector(state => state.analytics.filters.releaseFilter?.release);

	const getReleasesTracks = async () => {
		const promises = selectedBap?.releases.map(rel => getTracksToReleaseShop(rel.id, axiosPrivate));
		const tracksArray = await Promise.all(promises);

		const releasesWithTracks = selectedBap?.releases.map((rel, index) => {
			const tracks = tracksArray[index];
			const relWithTracks = { ...rel, tracks };
			return relWithTracks;
		});

		const bapWithTracks = { ...selectedBap, releases: releasesWithTracks };
		dispatch(setSelectedBap(bapWithTracks));
	};

	useEffect(() => {
		if (!selectedBap?.releases[0]?.tracks && selectedBap?.releases?.length) {
			getReleasesTracks();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap.bapId]);

	return (
		<Flex
			bgColor={'white'}
			borderRadius={'10px'}
			border='1px'
			borderColor='stroke'
			boxShadow='0px 4px 10px 0px rgba(0, 0, 0, 0.10)'
		>
			{selectedBap?.releases.length > 0 ? (
				<Item title={'Release'}>
					{selectedBap?.releases.map(rel => (
						<ReleaseCard key={rel.id} rel={rel} />
					))}
				</Item>
			) : (
				<Text p='24px' color='accent'>
					You don&apos;t have any releases in this B.A.P.
				</Text>
			)}

			{selectedRelease && (
				<Item title={'Track'}>
					{selectedRelease?.tracks?.map(tr => (
						<TrackCard key={tr.id} tr={tr} setIsReleasesModal={setIsReleasesModal} />
					))}
				</Item>
			)}
		</Flex>
	);
};

export default ReleasesMenu;
