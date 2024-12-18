import { Icon } from '@chakra-ui/react';

import crossIcon from '@/assets/icons/shop/closeSmall.svg';

const Cross = ({ onCrossClick, ml = '0' }) => {
	return (
		<Icon
			onClick={onCrossClick}
			as={crossIcon}
			color={'secondary'}
			_hover={{ color: 'accent' }}
			transition={'300ms'}
			cursor={'pointer'}
			ml={ml}
		/>
	);
};

export default Cross;
