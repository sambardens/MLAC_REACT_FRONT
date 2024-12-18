import { Box, Flex } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setReleaseSelectedMenu } from 'store/slice';

import NextButton from '@/components/Buttons/NextButton/NextButton';

import MenuTitle from '../MenuTitle/MenuTitle';

import TrackWithCredits from './components/TrackWithCredits';

const AddCreditsMenu = ({ isCreditMenuValid }) => {
	const dispatch = useDispatch();
	const { selectedRelease } = useSelector(state => state.user);
	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		(function getTracksList() {
			const deals = selectedRelease.splitsAndContracts.filter(
				el => el.status === 0 || el.status === 1,
			);
			const addedTracks = [];
			deals.forEach(deal => {
				deal.splitTracks.forEach(track => {
					const existingResultEntry = addedTracks.find(
						addedTrack => addedTrack.trackId === track.trackId,
					);

					if (existingResultEntry) {
						const userIdsInExistingEntry = existingResultEntry.splitUsers.map(user => user.email);
						deal.splitUsers.forEach(user => {
							if (!userIdsInExistingEntry.includes(user.email)) {
								existingResultEntry.splitUsers.push(user);
							}
						});
					} else {
						addedTracks.push({
							...track,
							splitUsers: [...deal.splitUsers],
						});
					}
				});
			});
			setTracks(addedTracks);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Flex flexDir='column' justify='space-between' h='100%' pos='relative'>
			<Box>
				<MenuTitle title='Add credits' text="Specify credits for each track's participants." />

				<Box mb='32px' maxW='500px'>
					<Flex as='ul' flexDir='column' gap='16px'>
						{tracks.map((track, index) => (
							<TrackWithCredits
								key={track.trackId}
								track={track}
								n={index + 1}
								totalTracks={tracks.length}
							/>
						))}
					</Flex>
				</Box>
			</Box>
			<Flex mt='16px'>
				<NextButton
					onClickHandler={() => {
						dispatch(setReleaseSelectedMenu(5));
					}}
					styles={isCreditMenuValid ? 'main' : 'disabled'}
				/>
			</Flex>
		</Flex>
	);
};

export default AddCreditsMenu;
