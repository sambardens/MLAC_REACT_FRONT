import { Flex, Icon } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { setBannerPosition } from 'store/shop/shop-slice';

import fullIcon from '@/assets/icons/shop/positions/full.svg';
import largeIcon from '@/assets/icons/shop/positions/large.svg';
import slimIcon from '@/assets/icons/shop/positions/slim.svg';
import squareIcon from '@/assets/icons/shop/positions/square.svg';

const PositionCard = ({ title, posType }) => {
	const dispatch = useDispatch();
	const shop = useSelector(state => state.shop);

	const isSelected = Number(shop.bannerPosition) === posType;

	return (
		<Flex
			onClick={() => dispatch(setBannerPosition(posType))}
			flexDir={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			w='50%'
			h='120px'
			cursor='pointer'
			borderRadius='10px'
			bgColor={isSelected ? 'bg.pink' : null}
			border={isSelected ? '2px solid black' : null}
			borderColor='accent'
			color={isSelected ? 'black' : 'secondary'}
		>
			{title === 'Slim' && (
				<Icon as={slimIcon} w='81px' h='81px' color={`${isSelected ? 'black' : 'secondary'}`} />
			)}
			{title === 'Full' && (
				<Icon as={fullIcon} w='81px' h='81px' color={`${isSelected ? 'black' : 'secondary'}`} />
			)}
			{title === 'Large' && (
				<Icon as={largeIcon} w='81px' h='81px' color={`${isSelected ? 'black' : 'secondary'}`} />
			)}
			{title === 'Square' && (
				<Icon as={squareIcon} w='81px' h='81px' color={`${isSelected ? 'black' : 'secondary'}`} />
			)}

			{title}
		</Flex>
	);
};

export default PositionCard;
