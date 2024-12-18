import { Flex, Icon, Image, Text } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { resetReleaseFilter, setReleaseFilter } from 'store/analytics/analytics-slice';

import DownIcon from '@/assets/icons/base/down.svg';

const ReleaseCard = ({ rel }) => {
	const dispatch = useDispatch();
	const selectedRelease = useSelector(state => state.analytics.filters.releaseFilter?.release);
	const isSelected = rel.id === selectedRelease?.id;

	const clickHandler = () => {
		if (isSelected) {
			dispatch(resetReleaseFilter());

			return;
		}

		const newFilter = {
			release: rel,
			track: null,
		};

		dispatch(setReleaseFilter(newFilter));
	};

	return (
		<Flex
			onClick={clickHandler}
			justifyContent={'space-between'}
			alignItems={'center'}
			w='350px'
			p='12px'
			cursor='pointer'
			bgColor={isSelected ? 'pink' : 'transparent'}
		>
			<Flex align='center'>
				<Image src={rel?.logoMin || rel.logo} w='40px' h='40px' alt='release logo' />
				<Text ml='12px'>{rel.name}</Text>
			</Flex>

			<Icon
				as={DownIcon}
				boxSize='24px'
				ml='10px'
				transform={isSelected ? 'rotate(90deg)' : 'rotate(270deg)'}
				transition={'300ms'}
			/>
		</Flex>
	);
};

export default ReleaseCard;
