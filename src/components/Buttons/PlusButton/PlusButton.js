import { Icon } from '@chakra-ui/react';

import CustomButton from '@/components/Buttons/CustomButton';

import PlusIcon from '@/assets/icons/base/plus.svg';

const PlusButton = ({
	onClickHandler,
	styles = 'main',
	title,
	iconColor = 'white',
	w = '240px',
}) => {
	return (
		<CustomButton w={w} minW={w} ml='auto' onClickHandler={onClickHandler} styles={styles}>
			<Icon as={PlusIcon} boxSize='24px' mr='12px' color={iconColor} />
			{title}
		</CustomButton>
	);
};

export default PlusButton;
