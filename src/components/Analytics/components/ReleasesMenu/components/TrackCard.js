import { Flex, Text } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { setReleaseFilter } from 'store/analytics/analytics-slice';

const TrackCard = ({ tr, setIsReleasesModal }) => {
	const dispatch = useDispatch();
	const selectedRelease = useSelector(state => state.analytics.filters.releaseFilter?.release);
	const selectedTrack = useSelector(state => state.analytics.filters.releaseFilter?.track);
	const isSelected = tr.id === selectedTrack?.id;

	const clickHandler = async () => {
		let newFilter;
		if (isSelected) {
			newFilter = {
				release: selectedRelease,
				track: null,
			};
		}
		if (!isSelected) {
			newFilter = {
				release: selectedRelease,
				track: tr,
			};
		}
		setIsReleasesModal(false);
		dispatch(setReleaseFilter(newFilter));
	};

	return (
		<Flex
			onClick={clickHandler}
			justifyContent={'space-between'}
			alignItems={'center'}
			// w='100%'
			w='287px'
			p='12px'
			cursor={'pointer'}
			bgColor={isSelected && 'pink'}
		>
			<Flex>
				<Text ml='12px' isTruncated={true} maxW='263px'>
					{tr.name}
				</Text>
			</Flex>
		</Flex>
	);
};

export default TrackCard;
