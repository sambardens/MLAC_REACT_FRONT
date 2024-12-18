import { Icon } from '@chakra-ui/react';

import CustomButton from '@/components/Buttons/CustomButton';

import ArrowLeftIcon from '@/assets/icons/base/arrow-left.svg';

const BackButton = ({
  onClickHandler, styles = 'transparent', title, iconColor = 'black', w,
}) => {
  return (
    <CustomButton
      onClickHandler={onClickHandler}
      styles={styles}
      w={w}>
      <Icon
        as={ArrowLeftIcon}
        boxSize='24px'
        mr='12px'
        color={iconColor}/>	{title}
    </CustomButton>
  );
};

export default BackButton;
