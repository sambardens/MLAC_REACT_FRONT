import { Icon } from '@chakra-ui/react';

import CustomButton from '@/components/Buttons/CustomButton';

import ArrowRightIcon from '@/assets/icons/base/arrow-right.svg';

const NextButton = ({ onClickHandler, mt, ml = 'auto', w, type, isSubmiting, styles }) => {
	return (
		<CustomButton
			mt={mt}
			ml={ml}
			onClickHandler={onClickHandler}
			w={w}
			type={type}
			styles={styles}
			isSubmiting={isSubmiting}
		>
			Next <Icon as={ArrowRightIcon} boxSize='24px' ml='10px' />
		</CustomButton>
	);
};

export default NextButton;
